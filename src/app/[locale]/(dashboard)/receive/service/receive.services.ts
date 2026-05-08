import { api } from "@/src/shared/lib/axios/axios.instance";
import { IReceive, IAddReceivePayload, IEditReceivePayload } from "../types/types";

export const getAllReceives = async (): Promise<IReceive[]> => {
  const { data } = await api.get("/Recieve/allRecievs");
  return data;
};

export const getReceiveById = async (id: number): Promise<IReceive> => {
  const { data } = await api.get(`/Recieve/recieve/${id}`);
  return data;
};

export const addReceive = async (payload: IAddReceivePayload) => {
  const { data } = await api.post("/Recieve/addRecieve", payload);
  return data;
};

export const editReceive = async (id: number, payload: IEditReceivePayload) => {
  const { data } = await api.put(`/Recieve/editRecieve/${id}`, payload);
  return data;
};

export const deleteReceive = async (id: number) => {
  const { data } = await api.delete(`/Recieve/delete/${id}`);
  return data;
};