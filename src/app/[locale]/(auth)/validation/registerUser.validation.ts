import { useTranslations } from "next-intl";
import { z } from "zod";

export const getRegisterUserSchema = (
  t: ReturnType<typeof useTranslations<"pages.registerUser">>,
) => {
  return z
    .object({
      organizationId: z
        .string()
        .trim()
        .min(1, t("formData.organizationId.validation.required")),
      name: z
        .string()
        .trim()
        .min(1, t("formData.name.validation.required")),
      userName: z
        .string()
        .trim()
        .min(1, t("formData.userName.validation.required"))
        .min(3, t("formData.userName.validation.min")),
      email: z
        .string()
        .trim()
        .min(1, t("formData.email.validation.required"))
        .email(t("formData.email.validation.invalid")),
      password: z
        .string()
        .min(1, t("formData.password.validation.required"))
        .min(6, t("formData.password.validation.min")),
      confirmPassword: z
        .string()
        .min(1, t("formData.confirmPassword.validation.required")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("formData.confirmPassword.validation.match"),
      path: ["confirmPassword"],
    });
};

export type TRegisterUserInput = z.input<ReturnType<typeof getRegisterUserSchema>>;