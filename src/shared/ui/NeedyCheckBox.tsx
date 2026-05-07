"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";

interface NeedyCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const NeedyCheckbox: React.FC<NeedyCheckboxProps> = ({ id, checked, onCheckedChange }) => {
  const t = useTranslations("common");

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl"
      style={{ backgroundColor: "rgba(196, 148, 61, 0.08)" }}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="mt-0.5"
      />
      <div>
        <label htmlFor={id} className="text-sm font-semibold cursor-pointer">
          {t("needsSupport")}
        </label>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("needsSupportDesc")}
        </p>
      </div>
    </div>
  );
};

export default NeedyCheckbox;