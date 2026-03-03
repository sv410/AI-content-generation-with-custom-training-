import { db } from "./db";
import {
  aiModels,
  trainingData,
  generatedContent,
  type AiModel,
  type InsertAiModel,
  type TrainingData,
  type InsertTrainingData,
  type GeneratedContent,
  type InsertGeneratedContent
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // AI Models
  getModels(): Promise<AiModel[]>;
  getModel(id: number): Promise<AiModel | undefined>;
  createModel(model: InsertAiModel): Promise<AiModel>;
  
  // Training Data
  getTrainingDataForModel(modelId: number): Promise<TrainingData[]>;
  addTrainingData(data: InsertTrainingData): Promise<TrainingData>;
  
  // Generated Content
  getGeneratedContentForModel(modelId: number): Promise<GeneratedContent[]>;
  addGeneratedContent(content: InsertGeneratedContent & { outputContent: string }): Promise<GeneratedContent>;
}

export class DatabaseStorage implements IStorage {
  async getModels(): Promise<AiModel[]> {
    return await db.select().from(aiModels);
  }

  async getModel(id: number): Promise<AiModel | undefined> {
    const [model] = await db.select().from(aiModels).where(eq(aiModels.id, id));
    return model;
  }

  async createModel(model: InsertAiModel): Promise<AiModel> {
    const [newModel] = await db.insert(aiModels).values(model).returning();
    return newModel;
  }

  async getTrainingDataForModel(modelId: number): Promise<TrainingData[]> {
    return await db.select().from(trainingData).where(eq(trainingData.modelId, modelId));
  }

  async addTrainingData(data: InsertTrainingData): Promise<TrainingData> {
    const [newData] = await db.insert(trainingData).values(data).returning();
    return newData;
  }

  async getGeneratedContentForModel(modelId: number): Promise<GeneratedContent[]> {
    return await db.select().from(generatedContent).where(eq(generatedContent.modelId, modelId));
  }

  async addGeneratedContent(content: InsertGeneratedContent & { outputContent: string }): Promise<GeneratedContent> {
    const [newContent] = await db.insert(generatedContent).values(content).returning();
    return newContent;
  }
}

export const storage = new DatabaseStorage();
