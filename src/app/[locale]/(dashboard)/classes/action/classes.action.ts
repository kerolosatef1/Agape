"use server";

import {
  addClass,
  updateClass,
  deleteClass,
  addClassUser,
  deleteClassUser,
} from "../service/classes.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";

export type ClassActionState = {
  success: boolean;
  message: string;
};

const initialState: ClassActionState = { success: false, message: "" };

async function safeAction(fn: () => Promise<any>): Promise<ClassActionState> {
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

// useActionState compatible — Add Class
export async function addClassFormAction(
  _prevState: ClassActionState,
  formData: FormData,
): Promise<ClassActionState> {
  const className = formData.get("className") as string;
  const classSerialNo = Number(formData.get("classSerialNo"));
  return safeAction(() => addClass({ className, classSerialNo }));
}

// useActionState compatible — Edit Class
export async function editClassFormAction(
  _prevState: ClassActionState,
  formData: FormData,
): Promise<ClassActionState> {
  const id = Number(formData.get("classId"));
  const className = formData.get("className") as string;
  const classSerialNo = Number(formData.get("classSerialNo"));
  return safeAction(() => updateClass(id, { className, classSerialNo }));
}

// useActionState compatible — Add Class User
export async function addClassUserFormAction(
  _prevState: ClassActionState,
  formData: FormData,
): Promise<ClassActionState> {
  const userId = formData.get("userId") as string;
  const classId = Number(formData.get("classId"));
  return safeAction(() => addClassUser({ userId, classId }));
}

// Regular actions (not form-based)
export const deleteClassAction = async (id: number) =>
  safeAction(() => deleteClass(id));

export const deleteClassUserAction = async (userId: string, classId: number) =>
  safeAction(() => deleteClassUser({ userId, classId }));