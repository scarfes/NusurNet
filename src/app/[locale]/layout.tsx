import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { isLocale, isRtl, locales } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Generate static params for all supported locales (enables SSG)
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: 'NusurNet',
    template: '%s · NusurNet',
  },
  description:
    'La plateforme des immigrés et étudiants en Italie. Information transparente, gratuite, vérifiée.',
  // SEO: tell Google about alternate language versions
  // (will be expanded once content is ready)
};

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale segment — middleware should have caught this, but
  // defense in depth: if someone hits /xx/... directly, return 404.
  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = isRtl(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={cn(inter.variable)}>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
