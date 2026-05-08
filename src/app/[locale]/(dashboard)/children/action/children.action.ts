"use server";

import {
  addChild,
  editChild,
  deleteChild,
} from "../service/children.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";

export type ChildActionState = {
  success: boolean;
  message: string;
};

async function safeAction(fn: () => Promise<any>): Promise<ChildActionState> {
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

// useActionState compatible — Add Child
export async function addChildFormAction(
  _prevState: ChildActionState,
  formData: FormData,
): Promise<ChildActionState> {
  const payload = {
    chiledName: formData.get("chiledName") as string,
    gender: formData.get("gender") === "true",
    description: formData.get("description") as string,
    typeNeedy: formData.get("typeNeedy") === "true",
    classId: Number(formData.get("classId")),
  };
  return safeAction(() => addChild(payload));
}

// useActionState compatible — Edit Child
export async function editChildFormAction(
  _prevState: ChildActionState,
  formData: FormData,
): Promise<ChildActionState> {
  const id = Number(formData.get("chiledId"));
  const payload = {
    chiledName: formData.get("chiledName") as string,
    gender: formData.get("gender") === "true",
    description: formData.get("description") as string,
    typeNeedy: formData.get("typeNeedy") === "true",
    classId: Number(formData.get("classId")),
  };
  return safeAction(() => editChild(id, payload));
}

// Regular action — Delete Child
export const deleteChildAction = async (id: number) =>
  safeAction(() => deleteChild(id));