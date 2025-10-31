import { z } from 'zod';

const configSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.number().default(3000),
  clientUrl: z.string().url().default('http://localhost:5173'),
  databaseUrl: z.string().url(),
  jwtSecret: z.string().min(32),
  jwtExpiresIn: z.string().default('7d'),
  redisUrl: z.string().url().default('redis://localhost:6379'),
});

export const config = configSchema.parse({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '3000'),
  clientUrl: process.env.CLIENT_URL,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  redisUrl: process.env.REDIS_URL,
});