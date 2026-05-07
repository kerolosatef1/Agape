"use server";

import { addStock, editStock, deleteStock, increaseStock, decreaseStock } from "../service/stock.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";

export type StockActionState = { success: boolean; message: string };

async function safeAction(fn: () => Promise<any>): Promise<StockActionState> {
  try {
    const res = await fn();
    return { success: true, message: typeof res === "string" ? res : res?.message || "Done!" };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export const addStockAction = async (payload: { itemName: string; availableAmount: number; price: number }) => safeAction(() => addStock(payload));
export const editStockAction = async (id: number, payload: { itemName: string; availableAmount: number; price: number }) => safeAction(() => editStock(id, payload));
export const deleteStockAction = async (id: number) => safeAction(() => deleteStock(id));
export const increaseStockAction = async (id: number, amount: number) => safeAction(() => increaseStock(id, amount));
export const decreaseStockAction = async (id: number, amount: number) => safeAction(() => decreaseStock(id, amount));
