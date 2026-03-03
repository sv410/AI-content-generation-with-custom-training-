import { z } from 'zod';
import { insertAiModelSchema, aiModels, trainingData, generatedContent, insertTrainingDataSchema, insertGeneratedContentSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  models: {
    list: {
      method: 'GET' as const,
      path: '/api/models' as const,
      responses: {
        200: z.array(z.custom<typeof aiModels.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/models' as const,
      input: insertAiModelSchema,
      responses: {
        201: z.custom<typeof aiModels.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/models/:id' as const,
      responses: {
        200: z.custom<typeof aiModels.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  trainingData: {
    list: {
      method: 'GET' as const,
      path: '/api/models/:modelId/training-data' as const,
      responses: {
        200: z.array(z.custom<typeof trainingData.$inferSelect>()),
      },
    },
    add: {
      method: 'POST' as const,
      path: '/api/models/:modelId/training-data' as const,
      input: z.object({ content: z.string() }),
      responses: {
        201: z.custom<typeof trainingData.$inferSelect>(),
        400: errorSchemas.validation,
      },
    }
  },
  generate: {
    create: {
      method: 'POST' as const,
      path: '/api/models/:modelId/generate' as const,
      input: z.object({
        prompt: z.string(),
        contentType: z.string(),
      }),
      responses: {
        201: z.custom<typeof generatedContent.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/models/:modelId/generated-content' as const,
      responses: {
        200: z.array(z.custom<typeof generatedContent.$inferSelect>()),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
