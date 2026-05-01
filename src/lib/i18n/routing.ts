import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from '@/lib/i18n/config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always show the locale prefix in the URL (/it/..., /fr/...)
  // This is better for SEO and clearer for users.
  localePrefix: 'always',
});

// Lightweight wrappers around Next's navigation APIs
// that consider the routing configuration.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
