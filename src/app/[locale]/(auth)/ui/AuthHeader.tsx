"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";

const AuthHeader: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="flex flex-col gap-6">
      <div
        className="flex items-center ms-auto gap-1.5 text-muted-foreground transition-colors duration-300 hover:bg-muted hover:text-primary cursor-pointer p-2 w-fit rounded-lg"
        onClick={() => toggleLocale(locale === "ar" ? "en" : "ar")}
      >
        <Globe size={16} />
        <span className="text-sm font-medium">
          {locale === "ar" ? "English" : "العربية"}
        </span>
      </div>
    </header>
  );
};

export default AuthHeader;
