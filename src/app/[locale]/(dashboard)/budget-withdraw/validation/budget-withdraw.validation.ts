import { useTranslations } from "next-intl";
import { z } from "zod";

export const getWithdrawSchema = (
  t: ReturnType<typeof useTranslations<"pages.budgetWithdraw">>,
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
    withdraw: z
      .number({ invalid_type_error: t("validation.withdrawRequired") })
      .positive(t("validation.withdrawPositive"))
      .min(1, t("validation.withdrawMin")),
    classId: z
      .number({ invalid_type_error: t("validation.classRequired") })
      .min(1, t("validation.classRequired")),
  });
};

export type TWithdrawInput = z.input<ReturnType<typeof getWithdrawSchema>>;