"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface GenderToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const GenderToggle: React.FC<GenderToggleProps> = ({ value, onChange }) => {
  const t = useTranslations("common");

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold">{t("gender")}</label>
      <div className="flex rounded-xl overflow-hidden border border-gray-200">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 py-2.5 text-sm font-medium transition-all cursor-pointer ${
            value ? "text-white" : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
          style={value ? { backgroundColor: "#1a1a6e" } : {}}
        >
          {t("boy")}
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 py-2.5 text-sm font-medium transition-all cursor-pointer ${
            !value ? "text-white" : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
          style={!value ? { backgroundColor: "#8b1a3a" } : {}}
        >
          {t("girl")}
        </button>
      </div>
    </div>
  );
};

export default GenderToggle;