"use server";

import { registerUser } from "../services/auth.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";
import { IRegisterUserFormData } from "../types/types";

export type RegisterUserState = {
  success: boolean;
  message: string;
};

export async function registerUserAction(
  _prevState: RegisterUserState,
  formData: FormData,
): Promise<RegisterUserState> {
  const organizationId = formData.get("organizationId") as string;

  const data: IRegisterUserFormData = {
    name: formData.get("name") as string,
    userName: formData.get("userName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  try {
    const response = await registerUser(organizationId, data);

    return {
      success: true,
      message: response.message || response || "Registration successful! Waiting for admin approval.",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}