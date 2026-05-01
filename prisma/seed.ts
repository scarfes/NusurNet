/**
 * Prisma seed script.
 *
 * Sprint 0: inserts a single HealthCheck row to verify the pipeline works.
 * Sprint 1 will replace this with real seeds (universities, services, etc.).
 *
 * Run with: npm run db:seed
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.info('🌱 Seeding database...');

  // Clean previous health checks (idempotent seed)
  await prisma.healthCheck.deleteMany();

  await prisma.healthCheck.create({
    data: {
      message: 'NusurNet Sprint 0 — DB connection OK',
    },
  });

  const count = await prisma.healthCheck.count();
  console.info(`✅ Seed complete. HealthCheck rows: ${count}`);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
