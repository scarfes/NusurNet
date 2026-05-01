/**
 * Prisma client singleton.
 *
 * In development, Next.js hot-reload would create new PrismaClient instances
 * on every request, exhausting connections. We attach the client to globalThis
 * to reuse it across hot reloads.
 *
 * In production, a single instance is created.
 */
import { PrismaClient } from '@prisma/client';
import { env } from '@/lib/env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
