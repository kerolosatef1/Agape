import { api } from "@/src/shared/lib/axios/axios.instance";
import { IBudgetAdd, IAddBudgetPayload, IEditBudgetPayload } from "../types/types";

// GET /BudgetAdd/budgetAdds
export const getAllBudgets = async (): Promise<IBudgetAdd[]> => {
  const { data } = await api.get("/BudgetAdd/budgetAdds");
  return data;
};

// GET /BudgetAdd/budgetAdd/:id
export const getBudgetById = async (id: number): Promise<IBudgetAdd> => {
  const { data } = await api.get(`/BudgetAdd/budgetAdd/${id}`);
  return data;
};

// POST /BudgetAdd/addBudget
export const addBudget = async (payload: IAddBudgetPayload) => {
  const { data } = await api.post("/BudgetAdd/addBudget", payload);
  return data;
};

// PUT /BudgetAdd/editBudgetAdd/:id
export const editBudget = async (id: number, payload: IEditBudgetPayload) => {
  const { data } = await api.put(`/BudgetAdd/editBudgetAdd/${id}`, payload);
  return data;
};

// DELETE /BudgetAdd/deleteBudgetAdd/:id
export const deleteBudget = async (id: number) => {
  const { data } = await api.delete(`/BudgetAdd/deleteBudgetAdd/${id}`);
  return data;
};