import { defaultLocale, isLocale, type Locale } from "../i18n/routing";

export function stripLocale(pathname: string) {
  const withSlash = pathname?.startsWith("/") ? pathname : `/${pathname || ""}`;
  const parts = withSlash.split("/");
  const maybeLocale = parts[1];

  if (maybeLocale && isLocale(maybeLocale)) {
    const rest = "/" + parts.slice(2).join("/");
    const cleaned = rest.replace(/\/+$/, "") || "/";
    return cleaned === "/" ? "/" : cleaned;
  }

  const cleaned = withSlash.replace(/\/+$/, "") || "/";
  return cleaned === "/" ? "/" : cleaned;
}

export function withLocale(pathname: string, locale: Locale) {
  const base = stripLocale(pathname);
  if (locale === defaultLocale) return base;
  return base === "/" ? `/${locale}` : `/${locale}${base}`;
}
