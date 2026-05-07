"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  defaultLocale, isLocale, type Locale,
} from "@/src/shared/lib/i18n/routing";
import { usePathname, useRouter } from "@/src/i18n/navigation";

export default function LocaleSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ locale?: string }>();

  const currentLocale: Locale = useMemo(() => {
    const raw = params?.locale;
    return raw && isLocale(raw) ? raw : defaultLocale;
  }, [params]);

  const navigateTo = (nextLocale: Locale) => {
    router.replace(pathname, { locale: nextLocale });
    router.refresh();
  };

  const nextLocale: Locale = currentLocale === "en" ? "ar" : "en";
  const label = nextLocale === "ar" ? "العربية" : "English";

  return (
    <Button
      variant="outline"
      className="gap-2 px-3 rounded-lg cursor-pointer text-sm font-medium border-gray-200"
      onClick={() => navigateTo(nextLocale)}
      aria-label="Language"
    >
      {label}
    </Button>
  );
}