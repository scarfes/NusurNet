// Type-safe i18n: ensures useTranslations() autocompletes the keys.
import type messages from '../messages/it.json';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Omit<typeof messages, ''> {}
}
