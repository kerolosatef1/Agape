"use server";

import {
  addWithdraw,
  editWithdraw,
  deleteWithdraw,
} from "../service/budget-withdraw.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";

export type WithdrawActionState = {
  success: boolean;
  message: string;
};

async function safeAction(fn: () => Promise<any>): Promise<WithdrawActionState> {
  try {
    const response = await fn();
    return {
      success: true,
      message:
        typeof response === "string"
          ? response
          : response?.message || "Done successfully!",
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

// useActionState — Add
export async function addWithdrawFormAction(
  _prevState: WithdrawActionState,
  formData: FormData,
): Promise<WithdrawActionState> {
  const volunteerName = formData.get("volunteerName") as string;
  const description = formData.get("description") as string;
  const withdraw = Number(formData.get("withdraw"));
  const classId = Number(formData.get("classId"));
  return safeAction(() => addWithdraw({ volunteerName, description, withdraw, classId }));
}

// useActionState — Edit
export async function editWithdrawFormAction(
  _prevState: WithdrawActionState,
  formData: FormData,
): Promise<WithdrawActionState> {
  const id = Number(formData.get("budgetWithdrawId"));
  const volunteerName = formData.get("volunteerName") as string;
  const description = formData.get("description") as string;
  const withdraw = Number(formData.get("withdraw"));
  const classId = Number(formData.get("classId"));
  return safeAction(() => editWithdraw(id, { volunteerName, description, withdraw, classId }));
}

// Regular — Delete
export const deleteWithdrawAction = async (id: number) =>
  safeAction(() => deleteWithdraw(id));