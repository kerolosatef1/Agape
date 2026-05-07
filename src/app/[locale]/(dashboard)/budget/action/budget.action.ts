"use server";

import {
  addBudget,
  editBudget,
  deleteBudget,
} from "../service/budget.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";

export type BudgetActionState = {
  success: boolean;
  message: string;
};

async function safeAction(fn: () => Promise<any>): Promise<BudgetActionState> {
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

// useActionState compatible — Add Budget
export async function addBudgetFormAction(
  _prevState: BudgetActionState,
  formData: FormData,
): Promise<BudgetActionState> {
  const volunteerName = formData.get("volunteerName") as string;
  const description = formData.get("description") as string;
  const moneyAdd = Number(formData.get("moneyAdd"));
  return safeAction(() => addBudget({ volunteerName, description, moneyAdd }));
}

// useActionState compatible — Edit Budget
export async function editBudgetFormAction(
  _prevState: BudgetActionState,
  formData: FormData,
): Promise<BudgetActionState> {
  const id = Number(formData.get("budgetAddId"));
  const volunteerName = formData.get("volunteerName") as string;
  const description = formData.get("description") as string;
  const moneyAdd = Number(formData.get("moneyAdd"));
  return safeAction(() => editBudget(id, { volunteerName, description, moneyAdd }));
}

// Regular action — Delete
export const deleteBudgetAction = async (id: number) =>
  safeAction(() => deleteBudget(id));