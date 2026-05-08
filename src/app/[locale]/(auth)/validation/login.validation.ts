import { useTranslations } from "next-intl";
import { z } from "zod";

export const getLoginSchema = (
  t: ReturnType<typeof useTranslations<"pages.login">>,
) => {
  return z.object({
    username: z
      .string()
      .trim()
      .min(1, t("formData.username.validation.required")),
    password: z
      .string()
        .min(1, t("formData.password.validation.required"))
        .min(8, t("formData.password.validation.min"))
        .regex(/[A-Z]/, t("formData.password.validation.uppercase"))
        .regex(/[a-z]/, t("formData.password.validation.lowercase"))
        .regex(/\d/, t("formData.password.validation.number"))
        .regex(/[!@#$%^&*(),.?":{}|<>]/, t("formData.password.validation.symbol")),
  });
};

export type TLoginInput = z.input<ReturnType<typeof getLoginSchema>>;
