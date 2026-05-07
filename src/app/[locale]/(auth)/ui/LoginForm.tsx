"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { User, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLoginSchema, TLoginInput } from "../validation/login.validation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/auth.hooks";
import FormField from "@/src/shared/ui/FormField";
import PasswordField from "@/src/shared/ui/PasswordField";
import Spinner from "@/src/shared/ui/Spinner";
import Link from "next/link";

const LoginForm: React.FC = () => {
  const t = useTranslations("pages.login");
  const tRegister = useTranslations("pages.register");
  const locale = useLocale();

  const loginSchema = getLoginSchema(t);
  const userLogin = useLogin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TLoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<TLoginInput> = async (data) => {
    await userLogin(data);
    reset({ username: "", password: "" });
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Welcome text */}
      <div className="flex flex-col items-center gap-2">
        <p
          className="text-xs font-medium tracking-[0.3em] uppercase"
          style={{ color: "#c4943d" }}
        >
          — {t("welcomeBack")} —
        </p>
        <h1 className="text-3xl font-bold text-[#1a1a6e]">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          type="text"
          id="username"
          label={t("formData.username.label")}
          placeholder={t("formData.username.placeholder")}
          labelIcon={<User size={16} className="text-[#1a1a6e]" />}
          hasError={!!errors?.username?.message}
          errorMessage={errors?.username?.message || ""}
          inputClassName="border-gray-300 focus:border-[#1a1a6e] focus:ring-[#1a1a6e]/20"
          {...register("username")}
        />

        <div className="flex flex-col gap-1">
          <PasswordField
            label={t("formData.password.label")}
            placeholder={t("formData.password.placeholder")}
            labelIcon={<Lock size={16} className="text-[#1a1a6e]" />}
            hasError={!!errors?.password?.message}
            errorMessage={errors?.password?.message || ""}
            inputClassName="border-gray-300 focus:border-[#1a1a6e] focus:ring-[#1a1a6e]/20"
            {...register("password")}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold rounded-xl mt-2"
          style={{
            backgroundColor: "#1a1a6e",
            color: "#ffffff",
          }}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <Spinner />
          ) : (
            <>
              <span>{t("formData.loginButton")}</span>
              {locale === "ar" ? (
                <ArrowLeft className="ms-2" />
              ) : (
                <ArrowRight className="ms-2" />
              )}
            </>
          )}
        </Button>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="font-semibold hover:underline"
          style={{ color: "#1a1a6e" }}
        >
          {tRegister("title")}
        </Link>
      </p>
    </section>
  );
};

export default LoginForm;