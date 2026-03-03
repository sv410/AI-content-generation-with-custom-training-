import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { openai } from "./replit_integrations/audio/client"; // Reuse the configured openai client

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Models
  app.get(api.models.list.path, async (req, res) => {
    const models = await storage.getModels();
    res.json(models);
  });

  app.post(api.models.create.path, async (req, res) => {
    try {
      const input = api.models.create.input.parse(req.body);
      const model = await storage.createModel(input);
      res.status(201).json(model);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.models.get.path, async (req, res) => {
    const model = await storage.getModel(Number(req.params.id));
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }
    res.json(model);
  });

  // Training Data
  app.get(api.trainingData.list.path, async (req, res) => {
    const data = await storage.getTrainingDataForModel(Number(req.params.modelId));
    res.json(data);
  });

  app.post(api.trainingData.add.path, async (req, res) => {
    try {
      const modelId = Number(req.params.modelId);
      const input = api.trainingData.add.input.parse(req.body);
      
      const model = await storage.getModel(modelId);
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }

      const data = await storage.addTrainingData({
        modelId,
        content: input.content
      });
      
      res.status(201).json(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Generated Content
  app.get(api.generate.list.path, async (req, res) => {
    const content = await storage.getGeneratedContentForModel(Number(req.params.modelId));
    res.json(content);
  });

  app.post(api.generate.create.path, async (req, res) => {
    try {
      const modelId = Number(req.params.modelId);
      const input = api.generate.create.input.parse(req.body);
      
      const model = await storage.getModel(modelId);
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }

      const trainingDataList = await storage.getTrainingDataForModel(modelId);
      const trainingContext = trainingDataList.map(t => t.content).join("\n\n");

      let systemPrompt = `You are a professional content generator for the ${model.industry} industry. Your tone should be ${model.tone}.`;
      if (trainingContext) {
        systemPrompt += `\n\nHere is some context and examples of the desired output style to learn from:\n${trainingContext}`;
      }
      
      systemPrompt += `\n\nYou are tasked with generating a ${input.contentType}.`;

      // Call OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-5.2", // Use newest model as it supports chat completions
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input.prompt }
        ],
      });

      const outputContent = response.choices[0]?.message?.content || "Failed to generate content.";

      const generatedRecord = await storage.addGeneratedContent({
        modelId,
        prompt: input.prompt,
        contentType: input.contentType,
        outputContent
      });

      res.status(201).json(generatedRecord);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Content generation error:", err);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  // Seed data on startup
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const models = await storage.getModels();
  if (models.length === 0) {
    const model1 = await storage.createModel({
      name: "SaaS Marketing Copilot",
      description: "Generates high-converting marketing copy for B2B SaaS",
      industry: "B2B SaaS",
      tone: "Professional, Authoritative, yet Conversational",
      baseModel: "gpt-4o"
    });

    await storage.addTrainingData({
      modelId: model1.id,
      content: "Example Post: Discover how AcmeCorp increased developer velocity by 30% using our new AI integrations. Link in bio to read the full case study. #SaaS #DeveloperTools"
    });

    await storage.addTrainingData({
      modelId: model1.id,
      content: "Example Post: Stop wasting time on manual data entry. Our automated workflows sync your CRM with your email marketing platform instantly. Try it free today!"
    });
    
    await storage.createModel({
      name: "DTC E-commerce Product Describer",
      description: "Writes punchy, engaging product descriptions for DTC brands",
      industry: "E-commerce & Retail",
      tone: "Playful, Engaging, Persuasive",
      baseModel: "gpt-4o"
    });
  }
}
