"use server";

import { addReceive, editReceive, deleteReceive } from "../service/receive.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";

export type ReceiveActionState = {
  success: boolean;
  message: string;
};

async function safeAction(fn: () => Promise<any>): Promise<ReceiveActionState> {
  try {
    const response = await fn();
    return {
      success: true,
      message: typeof response === "string" ? response : response?.message || "Done successfully!",
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function addReceiveFormAction(
  _prevState: ReceiveActionState,
  formData: FormData,
): Promise<ReceiveActionState> {
  const classId = Number(formData.get("classId"));
  const moneyAmount = Number(formData.get("moneyAmount"));
  const recieveFrom = formData.get("recieveFrom") as string;
  const description = formData.get("description") as string;
  return safeAction(() => addReceive({ classId, moneyAmount, recieveFrom, description }));
}

export async function editReceiveFormAction(
  _prevState: ReceiveActionState,
  formData: FormData,
): Promise<ReceiveActionState> {
  const id = Number(formData.get("recieveId"));
  const classId = Number(formData.get("classId"));
  const moneyAmount = Number(formData.get("moneyAmount"));
  const recieveFrom = formData.get("recieveFrom") as string;
  const description = formData.get("description") as string;
  return safeAction(() => editReceive(id, { classId, moneyAmount, recieveFrom, description }));
}

export const deleteReceiveAction = async (id: number) =>
  safeAction(() => deleteReceive(id));