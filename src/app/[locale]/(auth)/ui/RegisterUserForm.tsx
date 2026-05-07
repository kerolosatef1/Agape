"use client";

import React, { useActionState, useEffect, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  User, Mail, Lock, ArrowRight, ArrowLeft, UserPlus, Church,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getRegisterUserSchema, TRegisterUserInput,
} from "../validation/registerUser.validation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/src/shared/ui/FormField";
import PasswordField from "@/src/shared/ui/PasswordField";
import Spinner from "@/src/shared/ui/Spinner";
import PasswordStrength from "@/src/shared/ui/PasswordStrength";
import QrScanner from "@/src/shared/ui/QrScanner";
import {
  registerUserAction, RegisterUserState,
} from "../actions/registerUser.action";
import { toast } from "react-toastify";
import { useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";

const initialState: RegisterUserState = { success: false, message: "" };

const RegisterUserForm: React.FC = () => {
  const t = useTranslations("pages.registerUser");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const orgFromUrl = searchParams.get("org") || "";

  const [state, formAction] = useActionState(registerUserAction, initialState);
  const [isTransitioning, startTransition] = useTransition();

  const registerSchema = getRegisterUserSchema(t);
  const {
    register, handleSubmit, setValue, watch,
    formState: { errors, isValid },
  } = useForm<TRegisterUserInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { organizationId: orgFromUrl },
  });

  const organizationId = watch("organizationId");

  const handleQrScan = (orgId: string) => {
    if (orgId === "CAMERA_DENIED") {
      toast.error(t("cameraError"));
      return;
    }
    setValue("organizationId", orgId, { shouldValidate: true });
    toast.success(t("qrSuccess"));
  };

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

  const onSubmit: SubmitHandler<TRegisterUserInput> = async (data) => {
    const fd = new FormData();
    fd.append("organizationId", data.organizationId);
    fd.append("name", data.name);
    fd.append("userName", data.userName);
    fd.append("email", data.email);
    fd.append("password", data.password);
    fd.append("confirmPassword", data.confirmPassword);
    startTransition(() => formAction(fd));
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {/* QR Scanner */}
      <QrScanner onScan={handleQrScan} buttonLabel={t("scanQr")} />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">{t("or")}</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Organization ID */}
      <FormField
        type="text"
        id="organizationId"
        label={t("formData.organizationId.label")}
        placeholder={t("formData.organizationId.placeholder")}
        labelIcon={<Church size={16} className="text-[#1a1a6e]" />}
        hasError={!!errors?.organizationId?.message}
        errorMessage={errors?.organizationId?.message || ""}
        {...register("organizationId")}
      />

      {organizationId && !errors?.organizationId && (
        <p className="text-sm text-green-600 -mt-2">{t("orgDetected")}</p>
      )}

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

export default RegisterUserForm;