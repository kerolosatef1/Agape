"use server";

import { addPointScore, editPointScore, deletePointScore, activatePointScore } from "../service/point-score.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";
import { IPointScorePayload } from "../types/types";

export type PointScoreActionState = { success: boolean; message: string };

async function safeAction(fn: () => Promise<any>): Promise<PointScoreActionState> {
  try {
    const res = await fn();
    return { success: true, message: typeof res === "string" ? res : res?.message || "Done!" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export const addPointScoreAction = async (payload: IPointScorePayload) =>
  safeAction(() => addPointScore(payload));

export const editPointScoreAction = async (id: number, payload: IPointScorePayload) =>
  safeAction(() => editPointScore(id, payload));

export const deletePointScoreAction = async (id: number) =>
  safeAction(() => deletePointScore(id));

export const activatePointScoreAction = async (id: number) =>
  safeAction(() => activatePointScore(id));