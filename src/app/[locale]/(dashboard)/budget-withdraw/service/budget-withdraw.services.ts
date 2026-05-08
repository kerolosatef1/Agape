import { api } from "@/src/shared/lib/axios/axios.instance";
import {
  IBudgetWithdraw,
  IAddBudgetWithdrawPayload,
  IEditBudgetWithdrawPayload,
} from "../types/types";

// GET /BudgetWithdraw/budgetWithdraws
export const getAllWithdraws = async (): Promise<IBudgetWithdraw[]> => {
  const { data } = await api.get("/BudgetWithdraw/budgetWithdraws");
  return data;
};

// GET /BudgetWithdraw/budgetWithdraws/:id
export const getWithdrawById = async (id: number): Promise<IBudgetWithdraw> => {
  const { data } = await api.get(`/BudgetWithdraw/budgetWithdraws/${id}`);
  return data;
};

// POST /BudgetWithdraw/addBudgetWithdraws
export const addWithdraw = async (payload: IAddBudgetWithdrawPayload) => {
  const { data } = await api.post("/BudgetWithdraw/addBudgetWithdraws", payload);
  return data;
};

// PUT /BudgetWithdraw/editBudgetWithdraws/:id
export const editWithdraw = async (id: number, payload: IEditBudgetWithdrawPayload) => {
  const { data } = await api.put(`/BudgetWithdraw/editBudgetWithdraws/${id}`, payload);
  return data;
};

// DELETE /BudgetWithdraw/deleteBudgetWithdraws/:id
export const deleteWithdraw = async (id: number) => {
  const { data } = await api.delete(`/BudgetWithdraw/deleteBudgetWithdraws/${id}`);
  return data;
};