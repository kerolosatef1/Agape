"use server";

import {
  addAttendance,
  editAttendance,
  deleteAttendance,
  addBulkAttendance,
} from "../service/attendance.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";
import { IAddAttendancePayload } from "../types/types";

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

export const addAttendanceAction = async (chiledId: number, attend: boolean) =>
  safeAction(() => addAttendance({ chiledId, attend }));

export const editAttendanceAction = async (
  id: number,
  chiledId: number,
  attend: boolean,
) => safeAction(() => editAttendance(id, { chiledId, attend }));

export const deleteAttendanceAction = async (id: number) =>
  safeAction(() => deleteAttendance(id));

export const saveBulkAttendanceAction = async (
  items: IAddAttendancePayload[],
): Promise<ActionResult> => {
  try {
    const result = await addBulkAttendance(items);
    if (result.failed === 0) {
      return {
        success: true,
        message: `Attendance saved for ${result.succeeded} children!`,
      };
    }
    return {
      success: true,
      message: `${result.succeeded} saved, ${result.failed} failed out of ${result.total}.`,
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
};