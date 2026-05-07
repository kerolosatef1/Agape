"use server";

import {
  editOrganizationName,
  deleteOrganizationImage,
  changeUserEmail,
  changeUserName,
  deleteUserImage,
} from "../services/profile.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";

type ActionResult = {
  success: boolean;
  message: string;
};

// ═══════════════ Organization Actions (Admin) ═══════════════

export async function editOrgNameAction(name: string): Promise<ActionResult> {
  try {
    const response = await editOrganizationName(name);
    return {
      success: true,
      message: response?.message || response || "Name updated successfully!",
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function deleteOrgImageAction(): Promise<ActionResult> {
  try {
    const response = await deleteOrganizationImage();
    return {
      success: true,
      message: response?.message || response || "Image deleted successfully!",
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

// ═══════════════ User Actions ═══════════════

export async function changeUserNameAction(name: string): Promise<ActionResult> {
  try {
    const response = await changeUserName(name);
    return {
      success: true,
      message: response?.message || response || "Name updated successfully!",
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function changeUserEmailAction(email: string): Promise<ActionResult> {
  try {
    const response = await changeUserEmail(email);
    return {
      success: true,
      message: response?.message || response || "Email updated successfully!",
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function deleteUserImageAction(): Promise<ActionResult> {
  try {
    const response = await deleteUserImage();
    return {
      success: true,
      message: response?.message || response || "Image deleted successfully!",
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}