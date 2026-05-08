import { useTranslations } from "next-intl";
import { z } from "zod";

export const getRegisterOrgSchema = (
  t: ReturnType<typeof useTranslations<"pages.register">>,
) => {
  return z
    .object({
      nameOrganization: z
        .string()
        .trim()
        .min(1, t("formData.nameOrganization.validation.required")),
      name: z
        .string()
        .trim()
        .min(1, t("formData.name.validation.required")),
      userName: z
        .string()
        .trim()
        .min(1, t("formData.userName.validation.required"))
        .min(3, t("formData.userName.validation.min"))
        .regex(/^[a-zA-Z0-9_]+$/, t("formData.userName.validation.format")),
      email: z
        .string()
        .trim()
        .min(1, t("formData.email.validation.required"))
        .email(t("formData.email.validation.invalid")),
      password: z
        .string()
        .min(1, t("formData.password.validation.required"))
        .min(8, t("formData.password.validation.min"))
        .regex(/[A-Z]/, t("formData.password.validation.uppercase"))
        .regex(/[a-z]/, t("formData.password.validation.lowercase"))
        .regex(/\d/, t("formData.password.validation.number"))
        .regex(/[!@#$%^&*(),.?":{}|<>]/, t("formData.password.validation.symbol")),
      confirmPassword: z
        .string()
        .min(1, t("formData.confirmPassword.validation.required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("formData.confirmPassword.validation.match"),
      path: ["confirmPassword"],
    });
};

export type TRegisterOrgInput = z.input<ReturnType<typeof getRegisterOrgSchema>>;