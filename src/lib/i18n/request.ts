import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n/config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Resolve the locale from the request (handles dynamic [locale] segments)
  const requested = await requestLocale;

  if (!requested || !isLocale(requested)) {
    notFound();
  }

  return {
    locale: requested,
    messages: (await import(`@/messages/${requested}.json`)).default,
  };
});
