import { useTranslations } from "next-intl";
import { z } from "zod";

export const getBudgetSchema = (
  t: ReturnType<typeof useTranslations<"pages.budget">>,
) => {
  return z.object({
    volunteerName: z
      .string()
      .trim()
      .min(1, t("validation.volunteerNameRequired"))
      .min(2, t("validation.volunteerNameMin")),
    description: z
      .string()
      .trim()
      .min(1, t("validation.descriptionRequired"))
      .min(3, t("validation.descriptionMin")),
    moneyAdd: z
      .number({ invalid_type_error: t("validation.moneyRequired") })
      .positive(t("validation.moneyPositive"))
      .min(1, t("validation.moneyMin")),
  });
};

export type TBudgetInput = z.input<ReturnType<typeof getBudgetSchema>>;