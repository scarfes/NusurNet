// =============================================================================
// NusurNet — Sprint 1 Phase 5 validation page
// =============================================================================
// /[locale]/dev/db-check
//
// Server Component that reads from Postgres via Prisma and renders the seeded
// universities + a count summary. Purpose: prove that the full stack works:
//
//   PostgreSQL ─► Prisma migration ─► seed ─► Prisma Client ─► Next.js RSC
//
// This is a dev-only page. We'll remove it (or move it behind admin auth)
// later in the project. For now it doubles as a smoke test you can hit after
// every migration.
// =============================================================================

import { db } from "@/lib/db";
import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n/config";

// Force dynamic so we always read fresh data (no caching during dev).
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function DbCheckPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Pull a tiny slice of every important entity, in parallel.
  const [
    universities,
    cityCount,
    courseCount,
    scholarshipCount,
    serviceCount,
    resourcePointCount,
    journeyStepCount,
  ] = await Promise.all([
    db.university.findMany({
      include: {
        city: { select: { nameIt: true, region: true } },
        translations: {
          where: { locale: locale.toUpperCase() as "IT" | "FR" | "AR" | "EN" },
        },
        _count: { select: { courses: true, scholarships: true } },
      },
      orderBy: { foundedYear: "asc" },
    }),
    db.city.count(),
    db.course.count(),
    db.scholarship.count(),
    db.service.count(),
    db.resourcePoint.count(),
    db.journeyStep.count(),
  ]);

  const counts = [
    { label: "Cities", value: cityCount, expected: 39 },
    { label: "Universities", value: universities.length, expected: 3 },
    { label: "Courses", value: courseCount, expected: 18 },
    { label: "Scholarships", value: scholarshipCount, expected: 5 },
    { label: "Services", value: serviceCount, expected: 5 },
    { label: "Resource Points", value: resourcePointCount, expected: 9 },
    { label: "Journey Steps", value: journeyStepCount, expected: 12 },
  ];

  const allMatch = counts.every((c) => c.value === c.expected);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-700">
        <p className="text-xs font-mono uppercase tracking-wider text-gray-500">
          Sprint 1 · Phase 5 · /dev/db-check
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Database smoke test
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Locale segment: <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-800">{locale}</code>
        </p>
      </header>

      {/* Counts summary */}
      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Catalog counts</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              allMatch
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
            }`}
          >
            {allMatch ? "✓ all match seed expectations" : "⚠ mismatch detected"}
          </span>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {counts.map((c) => (
            <li
              key={c.label}
              className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <p className="text-xs uppercase tracking-wider text-gray-500">
                {c.label}
              </p>
              <p className="mt-1 font-mono text-2xl font-semibold">
                {c.value}
                <span className="ml-1 text-sm font-normal text-gray-400">
                  / {c.expected}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Universities list */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Universities</h2>
        {universities.length === 0 ? (
          <p className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            No universities found. Did you run <code className="font-mono">npm run db:seed</code>?
          </p>
        ) : (
          <ul className="space-y-3">
            {universities.map((uni) => {
              const t = uni.translations[0];
              return (
                <li
                  key={uni.id}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold">
                      {t?.name ?? uni.slug}
                    </h3>
                    <span className="font-mono text-xs text-gray-500">
                      {uni.slug}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {uni.city.nameIt}, {uni.city.region}
                    {uni.foundedYear && ` · est. ${uni.foundedYear}`}
                    {uni.qsRanking && ` · QS #${uni.qsRanking}`}
                  </p>
                  {t?.description && (
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      {t.description}
                    </p>
                  )}
                  <div className="mt-3 flex gap-3 text-xs text-gray-500">
                    <span>{uni._count.courses} courses</span>
                    <span>·</span>
                    <span>{uni._count.scholarships} scholarships</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer className="mt-12 border-t border-gray-200 pt-6 text-xs text-gray-500 dark:border-gray-700">
        <p>
          Page rendered at {new Date().toISOString()}. Refresh to query the
          database again (cache disabled with <code className="font-mono">force-dynamic</code>).
        </p>
      </footer>
    </main>
  );
}
