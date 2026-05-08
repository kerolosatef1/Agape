import { api } from "@/src/shared/lib/axios/axios.instance";
import { IChild, IAddChildPayload, IEditChildPayload } from "../types/types";

// GET /Child/children
export const getAllChildren = async (): Promise<IChild[]> => {
  const { data } = await api.get("/Child/children");
  return data;
};

// GET /Child/child/:id
export const getChildById = async (id: number): Promise<IChild> => {
  const { data } = await api.get(`/Child/child/${id}`);
  return data;
};

// POST /Child/addChild
export const addChild = async (payload: IAddChildPayload) => {
  const { data } = await api.post("/Child/addChild", payload);
  return data;
};

// PUT /Child/editChild/:id
export const editChild = async (id: number, payload: IEditChildPayload) => {
  const { data } = await api.put(`/Child/editChild/${id}`, payload);
  return data;
};

// DELETE /Child/deleteChild/:id
export const deleteChild = async (id: number) => {
  const { data } = await api.delete(`/Child/deleteChild/${id}`);
  return data;
};