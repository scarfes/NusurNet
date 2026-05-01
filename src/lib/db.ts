// =============================================================================
// NusurNet — Prisma Client singleton (Prisma 5)
// =============================================================================
// The singleton pattern prevents the "too many open connections" issue in
// Next.js dev mode, where hot reload would otherwise spawn a new client on
// every file change. In production this code path runs once.
//
// Note: Prisma 7+ requires a driver adapter (@prisma/adapter-pg). When we
// upgrade Node.js and migrate to Prisma 7, this file will need to import
// PrismaPg and pass it via { adapter }.
// =============================================================================

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
