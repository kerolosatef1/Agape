import { api } from "@/src/shared/lib/axios/axios.instance";
import { IPointScore, IPointScorePayload } from "../types/types";

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

export const addPointScore = async (payload: IPointScorePayload) => {
  const { data } = await api.post("/SetPointScore/addPointScore", payload);
  return data;
};

export const editPointScore = async (id: number, payload: IPointScorePayload) => {
  const { data } = await api.put(`/SetPointScore/editPointScore/${id}`, payload);
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