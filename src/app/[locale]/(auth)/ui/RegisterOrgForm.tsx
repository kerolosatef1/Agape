"use client";

import React, { useActionState, useEffect, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Church, User, Mail, Lock, ArrowRight, ArrowLeft, UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getRegisterOrgSchema, TRegisterOrgInput,
} from "../validation/register.validation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/src/shared/ui/FormField";
import PasswordField from "@/src/shared/ui/PasswordField";
import Spinner from "@/src/shared/ui/Spinner";
import PasswordStrength from "@/src/shared/ui/PasswordStrength";
import {
  registerOrganizationAction, RegisterOrgState,
} from "../actions/register.action";
import { toast } from "react-toastify";
import { useRouter } from "@/src/i18n/navigation";

const initialState: RegisterOrgState = { success: false, message: "" };

const RegisterOrgForm: React.FC = () => {
  const t = useTranslations("pages.register");
  const locale = useLocale();
  const router = useRouter();

  const [state, formAction] = useActionState(registerOrganizationAction, initialState);
  const [isTransitioning, startTransition] = useTransition();

  const registerSchema = getRegisterOrgSchema(t);
  const {
    register, handleSubmit, watch,
    formState: { errors, isValid },
  } = useForm<TRegisterOrgInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        router.push("/login");
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router]);

  const onSubmit: SubmitHandler<TRegisterOrgInput> = async (data) => {
    const fd = new FormData();
    fd.append("nameOrganization", data.nameOrganization);
    fd.append("name", data.name);
    fd.append("userName", data.userName);
    fd.append("email", data.email);
    fd.append("password", data.password);
    fd.append("confirmPassword", data.confirmPassword);
    startTransition(() => formAction(fd));
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormField
        type="text"
        id="nameOrganization"
        label={t("formData.nameOrganization.label")}
        placeholder={t("formData.nameOrganization.placeholder")}
        labelIcon={<Church size={16} className="text-[#1a1a6e]" />}
        hasError={!!errors?.nameOrganization?.message}
        errorMessage={errors?.nameOrganization?.message || ""}
        {...register("nameOrganization")}
      />

      <FormField
        type="text"
        id="name"
        label={t("formData.name.label")}
        placeholder={t("formData.name.placeholder")}
        labelIcon={<User size={16} className="text-[#1a1a6e]" />}
        hasError={!!errors?.name?.message}
        errorMessage={errors?.name?.message || ""}
        {...register("name")}
      />

      <FormField
        type="text"
        id="userName"
        label={t("formData.userName.label")}
        placeholder={t("formData.userName.placeholder")}
        labelIcon={<UserPlus size={16} className="text-[#1a1a6e]" />}
        hasError={!!errors?.userName?.message}
        errorMessage={errors?.userName?.message || ""}
        {...register("userName")}
      />

      <FormField
        type="email"
        id="email"
        label={t("formData.email.label")}
        placeholder={t("formData.email.placeholder")}
        labelIcon={<Mail size={16} className="text-[#1a1a6e]" />}
        hasError={!!errors?.email?.message}
        errorMessage={errors?.email?.message || ""}
        {...register("email")}
      />

      <PasswordField
        label={t("formData.password.label")}
        placeholder={t("formData.password.placeholder")}
        labelIcon={<Lock size={16} className="text-[#1a1a6e]" />}
        hasError={!!errors?.password?.message}
        errorMessage={errors?.password?.message || ""}
        {...register("password")}
      />

      <PasswordStrength password={watch("password") || ""} />

      <PasswordField
        label={t("formData.confirmPassword.label")}
        placeholder={t("formData.confirmPassword.placeholder")}
        labelIcon={<Lock size={16} className="text-[#1a1a6e]" />}
        hasError={!!errors?.confirmPassword?.message}
        errorMessage={errors?.confirmPassword?.message || ""}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold rounded-xl mt-2"
        style={{ backgroundColor: "#1a1a6e" }}
        disabled={!isValid || isTransitioning}
      >
        {isTransitioning ? (
          <Spinner />
        ) : (
          <>
            <span>{t("formData.submitButton")}</span>
            {locale === "ar" ? <ArrowLeft className="ms-2" /> : <ArrowRight className="ms-2" />}
          </>
        )}
      </Button>
    </form>
  );
};

export default RegisterOrgForm;