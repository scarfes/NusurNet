/**
 * Environment variables validation.
 *
 * Validates env vars at startup using Zod. Throws if required vars are missing
 * or malformed, preventing silent failures in production.
 *
 * Usage: import { env } from '@/lib/env'
 */
import { z } from 'zod';

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('NusurNet'),

  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),

  // Auth (will be required in Sprint 2)
  AUTH_SECRET: z.string().min(32).optional(),
  AUTH_URL: z.string().url().optional(),

  // Feature flags
  NEXT_PUBLIC_FEATURE_PAYMENTS: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
  NEXT_PUBLIC_FEATURE_MENTORSHIP: z
    .string()
    .transform((v) => v === 'true')
    .default('false'),
});

// Parse and validate
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables. See .env.example.');
}

export const env = parsed.data;
export type Env = typeof env;
