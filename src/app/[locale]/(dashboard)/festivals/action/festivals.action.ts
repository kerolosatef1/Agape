"use server";

import {
  addFestival, editFestival, deleteFestival,
  addClassification, editClassification, deleteClassification,
  addFamily, editFamily, deleteFamily, editWinStatus,
  addFestivalUser, editFestivalUser, deleteFestivalUser,
  addPointScore, editPointScore, deletePointScore, activatePointScore,
} from "../service/festivals.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";

export type FestivalActionState = { success: boolean; message: string };

async function safeAction(fn: () => Promise<any>): Promise<FestivalActionState> {
  try {
    const res = await fn();
    return { success: true, message: typeof res === "string" ? res : res?.message || "Done!" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

// Festival
export const addFestivalAction = async (name: string) => safeAction(() => addFestival({ churchFestivalName: name }));
export const editFestivalAction = async (id: number, name: string) => safeAction(() => editFestival(id, { churchFestivalName: name }));
export const deleteFestivalAction = async (id: number) => safeAction(() => deleteFestival(id));

// Classification
export const addClassificationAction = async (name: string) => safeAction(() => addClassification({ classificationName: name }));
export const editClassificationAction = async (id: number, name: string) => safeAction(() => editClassification(id, { classificationName: name }));
export const deleteClassificationAction = async (id: number) => safeAction(() => deleteClassification(id));

// Family
// Family — classificationId NOT classificationFestivalFamilyId
export const addFamilyAction = async (name: string, festivalId: number, classificationId: number) =>
  safeAction(() => addFamily({ festivalFamilyName: name, churchFestivalId: festivalId, classificationId }));

export const editFamilyAction = async (id: number, name: string, festivalId: number, classificationId: number) =>
  safeAction(() => editFamily(id, { festivalFamilyName: name, churchFestivalId: festivalId, classificationId }));

export const deleteFamilyAction = async (id: number) => safeAction(() => deleteFamily(id));

// winStatus: 0 or 1 (not boolean)
export const toggleWinAction = async (id: number, currentStatus: number) =>
  safeAction(() => editWinStatus(id, currentStatus === 1 ? 0 : 1));

// Users — NO isLead on add
export const addFestivalUserAction = async (userId: string, familyId: number) =>
  safeAction(() => addFestivalUser({ festivalFamilyId: familyId, userId }));

export const editFestivalUserAction = async (userId: string, familyId: number, isLead: boolean) =>
  safeAction(() => editFestivalUser({ festivalFamilyId: familyId, userId, isLead }));

export const deleteFestivalUserAction = async (userId: string, familyId: number) =>
  safeAction(() => deleteFestivalUser({ festivalFamilyId: familyId, userId }));
// Points
export const addPointScoreAction = async (payload: any) => safeAction(() => addPointScore(payload));
export const editPointScoreAction = async (id: number, payload: any) => safeAction(() => editPointScore(id, payload));
export const deletePointScoreAction = async (id: number) => safeAction(() => deletePointScore(id));
export const activatePointScoreAction = async (id: number) => safeAction(() => activatePointScore(id));