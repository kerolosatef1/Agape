"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import NavItem from "./NavItem";
import { NAV_ITEMS } from "@/src/shared/config/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import ActiveSeasonBadge from "@/src/app/[locale]/(dashboard)/seasons/ui/ActiveSeasonBadge";
import DailyVerse from "@/src/shared/ui/DialyVerse";

export default function AppSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const t = useTranslations();
  const year = new Date().getFullYear();
  const { data: session } = useSession();

  const roles: string[] = (session?.user as any)?.roles || [];
  const isAdmin = roles.includes("Admin");

  const filteredItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || isAdmin,
  );

  return (
    <div className="flex h-full w-full flex-col">
      {/* Logo — desktop */}
      <div className="hidden lg:flex items-center gap-3 px-6 py-5">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center border"
          style={{ borderColor: "#c4943d", background: "rgba(196, 148, 61, 0.15)" }}
        >
          <svg width="18" height="18" viewBox="0 0 200 200" fill="none">
            <rect x="85" y="10" width="30" height="180" rx="4" fill="#c4943d" />
            <rect x="10" y="65" width="180" height="30" rx="4" fill="#c4943d" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">Agápē</h2>
          <p className="text-[10px] text-white/40">— church · service —</p>
        </div>
      </div>

      {/* Active Season */}
      {isAdmin && (
        <div className="px-4 pb-3">
          <ActiveSeasonBadge />
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 px-3 py-3">
          {filteredItems.map((item) => (
            <NavItem key={item.key} item={item} onNavigate={onNavigate} />
          ))}
        </nav>
      </ScrollArea>

      {/* Daily Verse */}
      <div className="px-3 py-3">
        <DailyVerse />
      </div>
    </div>
  );
}