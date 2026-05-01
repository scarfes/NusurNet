import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * GET /api/health
 *
 * Returns 200 + status payload if the app is up and the DB is reachable.
 * Returns 503 if the DB is down.
 *
 * Used by:
 *  - Uptime monitoring (UptimeRobot, Better Uptime)
 *  - Container orchestrators / load balancers
 *  - Manual smoke tests after deployment
 */
export async function GET() {
  const startedAt = Date.now();

  try {
    // Lightweight query - just check the connection works
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
        services: {
          database: 'ok',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('api.health.db_failed', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
        services: {
          database: 'error',
        },
      },
      { status: 503 }
    );
  }
}
