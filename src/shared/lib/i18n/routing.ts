import { routing } from "@/src/i18n/routing";

export const locales = routing.locales;
export type Locale = (typeof routing.locales)[number];

export const defaultLocale = routing.defaultLocale as Locale;

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}
