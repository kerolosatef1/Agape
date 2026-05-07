"use client";

import { useState } from "react";
import { Menu, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppSidebar from "./AppSidebar";
import LocaleSwitch from "@/src/shared/ui/LocaleSwitch";
import { useLocale, useTranslations } from "next-intl";
import { useLogout } from "@/src/app/[locale]/(auth)/hooks/auth.hooks";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "@/src/i18n/navigation";
import NotificationBell from "@/src/shared/ui/NotificationBell";

export default function AppTopbar() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const isRTL = locale?.toLowerCase().startsWith("ar");

  const { data: session } = useSession();
  const user = session?.user;

  const userLogout = useLogout();
  const handleLogout = async () => await userLogout();

  // Get user initials
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const roles: string[] = (user as any)?.roles || [];
  const primaryRole = roles.includes("Admin") ? "Admin" : roles[0] || "User";

  const MenuBtn = (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden cursor-pointer"
      onClick={() => setOpen(true)}
    >
      <Menu className="size-6" />
    </Button>
  );

  // Church name in topbar
  const ChurchName = (
    <p className="hidden lg:block text-sm italic" style={{ color: "#c4943d" }}>
      {t("app.shortName")}
    </p>
  );

  const UserDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 gap-2.5 rounded-full px-2 cursor-pointer"
        >
          {isRTL ? (
            <>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold leading-tight">{user?.name}</span>
                <span className="text-[10px] text-muted-foreground">{primaryRole}</span>
              </div>
              <span
                className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: "#1a1a6e" }}
              >
                {getInitials(user?.name)}
              </span>
            </>
          ) : (
            <>
              <span
                className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: "#1a1a6e" }}
              >
                {getInitials(user?.name)}
              </span>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-semibold leading-tight">{user?.name}</span>
                <span className="text-[10px] text-muted-foreground">{primaryRole}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-44">
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => router.push("/profile")}
        >
          {t("topbar.profile")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onSelect={handleLogout}
        >
          {t("topbar.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const Controls = (
    <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
      <LocaleSwitch />
      <NotificationBell />
      <div className="hidden lg:block h-6 w-px bg-gray-200" />
      {UserDropdown}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100">
      <div className="flex h-16 items-center px-4 sm:px-6">
        {isRTL ? (
          <>
            {Controls}
            <div className="flex-1" />
            {ChurchName}
            <div className="lg:hidden ms-2">{MenuBtn}</div>
          </>
        ) : (
          <>
            <div className="lg:hidden me-2">{MenuBtn}</div>
            {ChurchName}
            <div className="flex-1" />
            {Controls}
          </>
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={isRTL ? "right" : "left"}
          className="p-0 w-[272px]"
          style={{ background: "linear-gradient(180deg, #1a1a6e 0%, #0d0d4a 100%)" }}
        >
          <SheetHeader className="px-4 py-3">
            <SheetTitle className="text-white">{t("topbar.menu")}</SheetTitle>
          </SheetHeader>
          <AppSidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}