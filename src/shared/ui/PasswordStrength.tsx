"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

interface Rule {
  key: string;
  test: (pw: string) => boolean;
}

const rules: Rule[] = [
  { key: "minLength", test: (pw) => pw.length >= 8 },
  { key: "uppercase", test: (pw) => /[A-Z]/.test(pw) },
  { key: "lowercase", test: (pw) => /[a-z]/.test(pw) },
  { key: "number", test: (pw) => /\d/.test(pw) },
  { key: "symbol", test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const t = useTranslations("common.passwordRules");

  const results = useMemo(
    () => rules.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [password],
  );

  const passedCount = results.filter((r) => r.passed).length;

  const strengthColor =
    passedCount <= 1
      ? "#ef4444"
      : passedCount <= 3
        ? "#f59e0b"
        : passedCount <= 4
          ? "#c4943d"
          : "#22c55e";

  const strengthLabel =
    passedCount <= 1
      ? t("weak")
      : passedCount <= 3
        ? t("medium")
        : passedCount <= 4
          ? t("strong")
          : t("veryStrong");

  if (!password) return null;

  return (
    <div className="flex flex-col gap-2 mt-1">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(passedCount / rules.length) * 100}%`,
              backgroundColor: strengthColor,
            }}
          />
        </div>
        <span className="text-xs font-medium" style={{ color: strengthColor }}>
          {strengthLabel}
        </span>
      </div>

      {/* Rules checklist */}
      <div className="grid grid-cols-2 gap-1">
        {results.map((rule) => (
          <div key={rule.key} className="flex items-center gap-1.5">
            {rule.passed ? (
              <Check size={12} className="text-green-500 shrink-0" />
            ) : (
              <X size={12} className="text-gray-300 shrink-0" />
            )}
            <span
              className={`text-xs ${rule.passed ? "text-green-600" : "text-gray-400"}`}
            >
              {t(rule.key)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;