"use server";

import {
  approveUser,
  removeApproval,
  addRoleToUser,
  removeRoleFromUser,
  changeAdmin,
} from "../service/users.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";

type ActionResult = {
  success: boolean;
  message: string;
};

async function safeAction(fn: () => Promise<any>): Promise<ActionResult> {
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

export const approveUserAction = async (userId: string) =>
  safeAction(() => approveUser(userId));

export const removeApprovalAction = async (userId: string) =>
  safeAction(() => removeApproval(userId));

export const addRoleAction = async (userId: string, role: string) =>
  safeAction(() => addRoleToUser({ userId, role }));

export const removeRoleAction = async (userId: string, role: string) =>
  safeAction(() => removeRoleFromUser({ userId, role }));

export const changeAdminAction = async (userId: string) =>
  safeAction(() => changeAdmin(userId));