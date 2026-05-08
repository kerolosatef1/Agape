"use server";

import { api } from "@/src/shared/lib/axios/axios.instance";
import { IRegisterOrgFormData } from "../types/types";

export type RegisterOrgState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function registerOrganizationAction(
  _prevState: RegisterOrgState,
  formData: FormData,
): Promise<RegisterOrgState> {
  const data: IRegisterOrgFormData = {
    nameOrganization: formData.get("nameOrganization") as string,
    name: formData.get("name") as string,
    userName: formData.get("userName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  try {
    const { data: response } = await api.post(
      "/Auth/registerOrganization",
      data,
    );

    if (response.isAuthenticated) {
      return {
        success: true,
        message: "Organization registered successfully!",
      };
    }

    return {
      success: false,
      message: response.message || "Registration failed",
    };
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data ||
      "Something went wrong";

    return {
      success: false,
      message: typeof errorMessage === "string" ? errorMessage : "Registration failed",
      errors: error?.response?.data?.errors,
    };
  }
}