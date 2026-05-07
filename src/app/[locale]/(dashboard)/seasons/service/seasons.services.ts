import { api } from "@/src/shared/lib/axios/axios.instance";
import {
  ISeason,
  IAddSeasonPayload,
  IEditSeasonPayload,
  IActivateSeasonPayload,
} from "../types/types";

// GET /Season/seasons
export const getAllSeasons = async (): Promise<ISeason[]> => {
  const { data } = await api.get("/Season/seasons");
  return data;
};

// GET /Season/season/:id
export const getSeasonById = async (id: number): Promise<ISeason> => {
  const { data } = await api.get(`/Season/season/${id}`);
  return data;
};

// GET /Season/activatedSeason
export const getActivatedSeason = async (): Promise<ISeason | null> => {
  try {
    const { data } = await api.get("/Season/activatedSeason");
    return data;
  } catch {
    return null;
  }
};

// POST /Season/addSeason
export const addSeason = async (payload: IAddSeasonPayload) => {
  const { data } = await api.post("/Season/addSeason", payload);
  return data;
};

// PUT /Season/editSeason/:id
export const editSeason = async (id: number, payload: IEditSeasonPayload) => {
  const { data } = await api.put(`/Season/editSeason/${id}`, payload);
  return data;
};

// DELETE /Season/deleteSeason/:id
export const deleteSeason = async (id: number) => {
  const { data } = await api.delete(`/Season/deleteSeason/${id}`);
  return data;
};

// PUT /Season/activateSeason
export const activateSeason = async (payload: IActivateSeasonPayload) => {
  const { data } = await api.put("/Season/activateSeason", payload);
  return data;
};