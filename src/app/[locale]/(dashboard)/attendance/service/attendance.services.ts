import { api } from "@/src/shared/lib/axios/axios.instance";
import {
  IAttendance,
  IAddAttendancePayload,
  IEditAttendancePayload,
} from "../types/types";

// GET /AttendanceChild/attendanceChildren
export const getAllAttendance = async (): Promise<IAttendance[]> => {
  const { data } = await api.get("/AttendanceChild/attendanceChildren");
  return Array.isArray(data) ? data : [data].filter(Boolean);
};

// GET /AttendanceChild/attendanceChild/:id
export const getAttendanceById = async (id: number): Promise<IAttendance> => {
  const { data } = await api.get(`/AttendanceChild/attendanceChild/${id}`);
  return data;
};

// GET attendance records for a specific child
export const getAttendanceByChildId = async (chiledId: number): Promise<IAttendance[]> => {
  const all = await getAllAttendance();
  return all.filter((a) => a.chiledId === chiledId);
};

// POST /AttendanceChild/addAttendanceChild
export const addAttendance = async (payload: IAddAttendancePayload) => {
  const { data } = await api.post("/AttendanceChild/addAttendanceChild", payload);
  return data;
};

// PUT /AttendanceChild/editAttendanceChild/:id
export const editAttendance = async (id: number, payload: IEditAttendancePayload) => {
  const { data } = await api.put(`/AttendanceChild/editAttendanceChild/${id}`, payload);
  return data;
};

// DELETE /AttendanceChild/deleteAttendanceChild/:id
export const deleteAttendance = async (id: number) => {
  const { data } = await api.delete(`/AttendanceChild/deleteAttendanceChild/${id}`);
  return data;
};

// Bulk
export const addBulkAttendance = async (items: IAddAttendancePayload[]) => {
  const results = await Promise.allSettled(
    items.map((item) => addAttendance(item)),
  );
  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  return { succeeded, failed, total: items.length };
};