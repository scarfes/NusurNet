/**
 * Internationalization configuration.
 *
 * Sprint 0: FR + IT
 * Sprint 1.1: AR (RTL) + EN
 *
 * The default locale is Italian since the audience is in Italy and
 * Italian is the legal/administrative language of all referenced services.
 */

export const locales = ['it', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'it';

// RTL locales (will include 'ar' in v1.1)
export const rtlLocales: Locale[] = [];

// Display names for the language switcher
export const localeNames: Record<Locale, string> = {
  it: 'Italiano',
  fr: 'Français',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
