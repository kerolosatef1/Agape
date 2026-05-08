"use client";

import React from "react";
import { Church, User } from "lucide-react";
import { useTranslations } from "next-intl";

interface AuthTabsProps {
  activeTab: "admin" | "user";
  onTabChange: (tab: "admin" | "user") => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
  const t = useTranslations("pages.registerPage");

  return (
    <div className="flex w-full rounded-xl overflow-hidden border border-gray-200">
      <button
        type="button"
        onClick={() => onTabChange("admin")}
        className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-semibold transition-all duration-200 cursor-pointer ${
          activeTab === "admin"
            ? "text-white"
            : "bg-white text-gray-500 hover:bg-gray-50"
        }`}
        style={
          activeTab === "admin"
            ? { backgroundColor: "#1a1a6e" }
            : {}
        }
      >
        <Church size={18} />
        {t("adminTab")}
      </button>
      <button
        type="button"
        onClick={() => onTabChange("user")}
        className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-semibold transition-all duration-200 cursor-pointer ${
          activeTab === "user"
            ? "text-white"
            : "bg-white text-gray-500 hover:bg-gray-50"
        }`}
        style={
          activeTab === "user"
            ? { backgroundColor: "#1a1a6e" }
            : {}
        }
      >
        <User size={18} />
        {t("userTab")}
      </button>
    </div>
  );
};

export default AuthTabs;