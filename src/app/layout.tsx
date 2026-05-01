/**
 * Root layout.
 *
 * With next-intl App Router, the real layout lives in [locale]/layout.tsx.
 * This file only exists to satisfy Next.js requirements — it's never rendered
 * because the middleware always redirects to a locale-prefixed URL.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
