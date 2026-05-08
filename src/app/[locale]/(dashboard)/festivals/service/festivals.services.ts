import { api } from "@/src/shared/lib/axios/axios.instance";
import {
  IChurchFestival,
  IClassification,
  IFestivalFamily,
  IFestivalUser,
  IPointScore,
  IAddFestivalPayload,
  IAddClassificationPayload,
  IAddFamilyPayload,
  IAddFestivalUserPayload,
  IEditFestivalUserPayload,
  IAddPointScorePayload,
} from "../types/types";

// ═══ Church Festival ═══
export const getAllFestivals = async (): Promise<IChurchFestival[]> => {
  const { data } = await api.get("/ChurchFestival/ChurchFestivals");
  return data;
};
export const addFestival = async (payload: IAddFestivalPayload) => {
  const { data } = await api.post("/ChurchFestival/addChurchFestival", payload);
  return data;
};
export const editFestival = async (
  id: number,
  payload: IAddFestivalPayload,
) => {
  const { data } = await api.put(
    `/ChurchFestival/editChurchFestival/${id}`,
    payload,
  );
  return data;
};
export const deleteFestival = async (id: number) => {
  const { data } = await api.delete(
    `/ChurchFestival/deleteChurchFestival/${id}`,
  );
  return data;
};

// ═══ Classification ═══
export const getAllClassifications = async (): Promise<IClassification[]> => {
  const { data } = await api.get(
    "/ClassificationFestivalFamily/classificationFestivalFamilies",
  );
  return data;
};
export const addClassification = async (payload: IAddClassificationPayload) => {
  const { data } = await api.post(
    "/ClassificationFestivalFamily/addClassificationFestivalFamily",
    payload,
  );
  return data;
};
export const editClassification = async (
  id: number,
  payload: IAddClassificationPayload,
) => {
  const { data } = await api.put(
    `/ClassificationFestivalFamily/editClassificationFestivalFamily/${id}`,
    payload,
  );
  return data;
};
export const deleteClassification = async (id: number) => {
  const { data } = await api.delete(
    `/ClassificationFestivalFamily/deleteClassificationFestivalFamily/${id}`,
  );
  return data;
};

// ═══ Festival Family (Team) ═══
export const getAllFamilies = async (): Promise<IFestivalFamily[]> => {
  const { data } = await api.get("/FestivalFamily/festivalFamilies");
  return data;
};
export const addFamily = async (payload: { churchFestivalId: number; classificationId: number; festivalFamilyName: string }) => {
  const { data } = await api.post("/FestivalFamily/addFestivalFamily", payload);
  return data;
};
export const editFamily = async (id: number, payload: { churchFestivalId: number; classificationId: number; festivalFamilyName: string }) => {
  const { data } = await api.put(`/FestivalFamily/editFestivalFamily/${id}`, payload);
  return data;
};
export const deleteFamily = async (id: number) => {
  const { data } = await api.delete(`/FestivalFamily/deleteFestivalFamily/${id}`);
  return data;
};
export const editWinStatus = async (id: number, winStatus: number) => {
  const { data } = await api.put(`/FestivalFamily/editWinStatusFestivalFamily/${id}`, { winStatus });
  return data;
};

// ═══ Festival Users ═══
export const getAllFestivalUsers = async (): Promise<IFestivalUser[]> => {
  const { data } = await api.get("/FestivalUser/festivalUsers");
  return data;
};
export const addFestivalUser = async (payload: { festivalFamilyId: number; userId: string }) => {
  const { data } = await api.post("/FestivalUser/addFestivalUser", payload);
  return data;
};
export const editFestivalUser = async (payload: { festivalFamilyId: number; userId: string; isLead: boolean }) => {
  const { data } = await api.put("/FestivalUser/editFestivalUser", payload);
  return data;
};
export const deleteFestivalUser = async (payload: { festivalFamilyId: number; userId: string }) => {
  const { data } = await api.delete("/FestivalUser/deleteFestivalUser", { data: payload });
  return data;
};

// ═══ Point Score ═══
export const getAllPointScores = async (): Promise<IPointScore[]> => {
  const { data } = await api.get("/SetPointScore/PointScores");
  return data;
};
export const getActivatedPointScore = async (): Promise<IPointScore | null> => {
  try {
    const { data } = await api.get("/SetPointScore/getActivatedPointScore");
    return data;
  } catch {
    return null;
  }
};
export const addPointScore = async (payload: IAddPointScorePayload) => {
  const { data } = await api.post("/SetPointScore/addPointScore", payload);
  return data;
};
export const editPointScore = async (
  id: number,
  payload: IAddPointScorePayload,
) => {
  const { data } = await api.put(
    `/SetPointScore/editPointScore/${id}`,
    payload,
  );
  return data;
};
export const deletePointScore = async (id: number) => {
  const { data } = await api.delete(`/SetPointScore/deletePointScore/${id}`);
  return data;
};
export const activatePointScore = async (id: number) => {
  const { data } = await api.put(`/SetPointScore/activatePointScore/${id}`);
  return data;
};
