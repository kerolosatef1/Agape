"use server";

import { addSpend, editSpend, deleteSpend } from "../service/spend.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";

export type SpendActionState = { success: boolean; message: string };

async function safeAction(fn: () => Promise<any>): Promise<SpendActionState> {
  try {
    const res = await fn();
    return { success: true, message: typeof res === "string" ? res : res?.message || "Done!" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function addSpendFormAction(_prev: SpendActionState, fd: FormData): Promise<SpendActionState> {
  return safeAction(() => addSpend({
    classId: Number(fd.get("classId")), moneyAmount: Number(fd.get("moneyAmount")),
    sendTo: fd.get("sendTo") as string, description: fd.get("description") as string,
  }));
}

export async function editSpendFormAction(_prev: SpendActionState, fd: FormData): Promise<SpendActionState> {
  return safeAction(() => editSpend(Number(fd.get("spendId")), {
    classId: Number(fd.get("classId")), moneyAmount: Number(fd.get("moneyAmount")),
    sendTo: fd.get("sendTo") as string, description: fd.get("description") as string,
  }));
}

export const deleteSpendAction = async (id: number) => safeAction(() => deleteSpend(id));