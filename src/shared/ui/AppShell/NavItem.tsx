"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { defaultLocale, type Locale } from "@/src/shared/lib/i18n/routing";
import { stripLocale, withLocale } from "@/src/shared/lib/i18n/pathname";

type NavItemModel = {
  key: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  labelKey?: string;
  label?: string;
};

export default function NavItem({
  item,
  onNavigate,
}: {
  item: NavItemModel;
  onNavigate?: () => void;
}) {
  const t = useTranslations();
  const pathname = usePathname();

  const locale = (useLocale() || defaultLocale) as Locale;
  const isRTL = locale === "ar";

  const raw = item.href?.startsWith("/") ? item.href : `/${item.href || ""}`;
  const href = withLocale(raw, locale);

  const currentNoLocale = stripLocale(pathname);
  const targetNoLocale = stripLocale(href);

  const isActive =
    currentNoLocale === targetNoLocale ||
    currentNoLocale.startsWith(`${targetNoLocale}/`);

  const Icon = item.icon;

  return (
    <Link
      href={href}
      onClick={() => onNavigate?.()}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
        isRTL ? "flex-row-reverse" : "",
        isActive
          ? "text-white"
          : "text-white/60 hover:text-white hover:bg-white/10"
      )}
      style={
        isActive
          ? { backgroundColor: "rgba(196, 148, 61, 0.2)", borderInlineStart: "3px solid #c4943d" }
          : {}
      }
    >
      {Icon && (
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            isActive ? "text-[#c4943d]" : "text-white/40 group-hover:text-white/70"
          )}
        />
      )}
      <span className="min-w-0 truncate">
        {item.labelKey ? t(item.labelKey) : item.label ?? item.key}
      </span>
    </Link>
  );
}