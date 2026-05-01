import { getTranslations } from 'next-intl/server';

import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { HealthCheckBadge } from '@/components/health-check-badge';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// Force dynamic rendering for the home page so the health check is real-time.
// In Sprint 3+ we'll switch to ISR/SSG for content pages.
export const dynamic = 'force-dynamic';

async function getHealthCheck() {
  try {
    const row = await prisma.healthCheck.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    return { ok: true as const, message: row?.message ?? 'No row yet (run db:seed)' };
  } catch (error) {
    logger.error('healthcheck.failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: false as const, message: 'Database unreachable' };
  }
}

export default async function HomePage() {
  const t = await getTranslations('home');
  const tFooter = await getTranslations('footer');
  const health = await getHealthCheck();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-xl font-bold text-brand-700">NusurNet</div>
          <LocaleSwitcher />
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg text-slate-600">{t('subtitle')}</p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-lg bg-brand-600 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-brand-700"
            >
              {t('ctaStudents')}
            </button>
            <button
              type="button"
              className="rounded-lg bg-white px-6 py-3 font-medium text-slate-900 shadow-sm ring-1 ring-slate-300 transition hover:bg-slate-50"
            >
              {t('ctaCitizens')}
            </button>
            <button
              type="button"
              className="rounded-lg bg-white px-6 py-3 font-medium text-slate-900 shadow-sm ring-1 ring-slate-300 transition hover:bg-slate-50"
            >
              {t('ctaResources')}
            </button>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-16">
          <HealthCheckBadge ok={health.ok} message={health.message} />
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-500">
          <p>{tFooter('tagline')}</p>
          <p className="mt-1 text-xs">{tFooter('version')}</p>
        </div>
      </footer>
    </div>
  );
}
