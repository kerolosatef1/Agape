"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useAllClasses } from "@/src/app/[locale]/(dashboard)/classes/hooks/classes.hooks";

interface ClassSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

const ClassSelect: React.FC<ClassSelectProps> = ({
  value,
  onChange,
  error,
  label,
}) => {
  const t = useTranslations("common");
  const { data: classes } = useAllClasses();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold">{label || t("class")}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a6e]/20 focus:border-[#1a1a6e]/40 focus-within:outline-none"
      >
        <option value="">{t("selectClass")}</option>
        {classes?.map((cls) => (
          <option key={cls.classId} value={cls.classId}>
            {cls.className}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default ClassSelect;