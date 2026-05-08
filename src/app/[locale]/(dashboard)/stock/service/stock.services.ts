import { api } from "@/src/shared/lib/axios/axios.instance";
import { IStock } from "../types/types";

export const getAllStocks = async (): Promise<IStock[]> => {
  const { data } = await api.get("/Stock/stocks");
  return data;
};
export const addStock = async (payload: { itemName: string; availableAmount: number; price: number }) => {
  const { data } = await api.post("/Stock/addStock", payload);
  return data;
};
export const editStock = async (id: number, payload: { itemName: string; availableAmount: number; price: number }) => {
  const { data } = await api.put(`/Stock/editStock?id=${id}`, payload);
  return data;
};
export const deleteStock = async (id: number) => {
  const { data } = await api.delete(`/Stock/deleteStock?id=${id}`);
  return data;
};
export const increaseStock = async (id: number, amount: number) => {
  const { data } = await api.put(`/Stock/increaseStock/${id}/${amount}`);
  return data;
};
export const decreaseStock = async (id: number, amount: number) => {
  const { data } = await api.put(`/Stock/decreaseStock/${id}/${amount}`);
  return data;
};