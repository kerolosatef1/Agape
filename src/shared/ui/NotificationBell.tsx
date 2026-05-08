"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import { api } from "@/src/shared/lib/axios/axios.instance";
import { IManagedUser } from "@/src/app/[locale]/(dashboard)/users/types/types";

const NotificationBell: React.FC = () => {
  const t = useTranslations("topbar");
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const { data: pendingUsers } = useQuery<IManagedUser[]>({
    queryKey: ["users", "pending"],
    queryFn: async () => {
      const { data } = await api.get("/ManagementUser/UserNotApproved");
      return Array.isArray(data) ? data : [data].filter(Boolean);
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  const count = pendingUsers?.length || 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer">
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span
              className="absolute -top-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: "#c4943d" }}
            >
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-72">
        {count === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            {t("noNotifications")}
          </div>
        ) : (
          <>
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-semibold">
                {t("pendingApprovals")} ({count})
              </p>
            </div>
            {pendingUsers?.slice(0, 5).map((user) => (
              <DropdownMenuItem
                key={user.id}
                className="cursor-pointer px-4 py-3"
                onSelect={() => router.push("/users")}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    @{user.userName} — {t("waitingApproval")}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
            {count > 5 && (
              <DropdownMenuItem
                className="cursor-pointer text-center text-sm justify-center font-medium"
                style={{ color: "#1a1a6e" }}
                onSelect={() => router.push("/users")}
              >
                {t("viewAll")}
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;