"use client";

import { signIn, signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { TLoginInput } from "../validation/login.validation";
import { useRouter } from "@/src/i18n/navigation";
import axios from "axios";

// login
export const useLogin = () => {
  const t = useTranslations("pages.login");
  const router = useRouter();

  return async (data: TLoginInput) => {
    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // NextAuth passes the error message from authorize() throw
        const errorMsg =
          result.error === "CredentialsSignin"
            ? t("errorMsg")
            : result.error;
        toast.error(errorMsg);
        return;
      }

      if (result?.ok) {
        toast.success(t("successMsg"));
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error(t("errorMsg"));
      console.error("Login unexpected error:", error);
    }
  };
};

// logout
export const useLogout = () => {
  const t = useTranslations("pages.login");
  const router = useRouter();

  return async () => {
    try {
      await signOut({ redirect: false });
      toast.success(t("logoutSuccessMsg"));
      router.push("/login");
      router.refresh();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error?.response?.data?.message
        : t("logoutErrorMsg");
      toast.error(errorMessage);
      await signOut({ callbackUrl: "/login" });
    }
  };
};