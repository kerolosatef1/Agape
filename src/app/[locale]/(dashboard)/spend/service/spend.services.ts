import { api } from "@/src/shared/lib/axios/axios.instance";
import { ISpend } from "../types/types";

export const getAllSpends = async (): Promise<ISpend[]> => {
  const { data } = await api.get("/Spend/spends");
  return data;
};

export const addSpend = async (payload: { classId: number; moneyAmount: number; sendTo: string; description: string }) => {
  const { data } = await api.post("/Spend/addSpend", payload);
  return data;
};

export const editSpend = async (id: number, payload: { classId: number; moneyAmount: number; sendTo: string; description: string }) => {
  const { data } = await api.put(`/Spend/editSpend/${id}`, payload);
  return data;
};

export const deleteSpend = async (id: number) => {
  const { data } = await api.delete(`/Spend/deleteSpend/${id}`);
  return data;
};