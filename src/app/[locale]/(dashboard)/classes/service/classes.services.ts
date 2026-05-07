import { api } from "@/src/shared/lib/axios/axios.instance";
import {
  IClass,
  IAddClassPayload,
  IUpdateClassPayload,
  IClassUser,
  IAddClassUserPayload,
  IDeleteClassUserPayload,
} from "../types/types";

// ═══════════════ Class ═══════════════

// GET /Class/Classes
export const getAllClasses = async (): Promise<IClass[]> => {
  const { data } = await api.get("/Class/Classes");
  return data;
};

// POST /Class/AddClass (Admin only)
export const addClass = async (payload: IAddClassPayload) => {
  const { data } = await api.post("/Class/AddClass", payload);
  return data;
};

// PUT /Class/updateClass/:id (Admin only)
export const updateClass = async (id: number, payload: IUpdateClassPayload) => {
  const { data } = await api.put(`/Class/updateClass/${id}`, payload);
  return data;
};

// DELETE /Class/DeleteClass/:id (Admin only)
export const deleteClass = async (id: number) => {
  const { data } = await api.delete(`/Class/DeleteClass/${id}`);
  return data;
};

// ═══════════════ Class Users ═══════════════

// GET /ClassUser/classUser
export const getClassUsers = async (): Promise<IClassUser[]> => {
  const { data } = await api.get("/ClassUser/classUser");
  return Array.isArray(data) ? data : [data].filter(Boolean);
};

// POST /ClassUser/addClassUser
export const addClassUser = async (payload: IAddClassUserPayload) => {
  const { data } = await api.post("/ClassUser/addClassUser", payload);
  return data;
};

// DELETE /ClassUser/deleteClassUser
export const deleteClassUser = async (payload: IDeleteClassUserPayload) => {
  const { data } = await api.delete("/ClassUser/deleteClassUser", {
    data: payload,
  });
  return data;
};