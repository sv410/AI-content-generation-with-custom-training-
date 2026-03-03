import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const aiModels = pgTable("ai_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  industry: text("industry").notNull(),
  tone: text("tone").notNull(),
  baseModel: text("base_model").notNull().default("gpt-4o"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trainingData = pgTable("training_data", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const generatedContent = pgTable("generated_content", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").notNull(),
  prompt: text("prompt").notNull(),
  outputContent: text("output_content").notNull(),
  contentType: text("content_type").notNull(), // 'post', 'blog', 'product_description'
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas
export const insertAiModelSchema = createInsertSchema(aiModels).omit({ id: true, createdAt: true });
export const insertTrainingDataSchema = createInsertSchema(trainingData).omit({ id: true, createdAt: true });
export const insertGeneratedContentSchema = createInsertSchema(generatedContent).omit({ id: true, createdAt: true, outputContent: true });

// Types
export type AiModel = typeof aiModels.$inferSelect;
export type InsertAiModel = z.infer<typeof insertAiModelSchema>;

export type TrainingData = typeof trainingData.$inferSelect;
export type InsertTrainingData = z.infer<typeof insertTrainingDataSchema>;

export type GeneratedContent = typeof generatedContent.$inferSelect;
export type InsertGeneratedContent = z.infer<typeof insertGeneratedContentSchema>;
