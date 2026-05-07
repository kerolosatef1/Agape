import { api } from "@/src/shared/lib/axios/axios.instance";
import { IManagedUser, IAddRolePayload, IRemoveRolePayload } from "../types/types";

// GET /ManagementUser/UserNotApproved
export const getPendingUsers = async (): Promise<IManagedUser[]> => {
  const { data } = await api.get("/ManagementUser/UserNotApproved");
  return Array.isArray(data) ? data : [data].filter(Boolean);
};

// GET /ManagementUser/UserApproved
export const getApprovedUsers = async (): Promise<IManagedUser[]> => {
  const { data } = await api.get("/ManagementUser/UserApproved");
  return Array.isArray(data) ? data : [data].filter(Boolean);
};

// GET /ManagementUser/Roles
export const getAvailableRoles = async (): Promise<string[]> => {
  const { data } = await api.get("/ManagementUser/Roles");
  return data;
};

// POST /ManagementUser/approve/:id
export const approveUser = async (userId: string) => {
  const { data } = await api.post(`/ManagementUser/approve/${userId}`);
  return data;
};

// POST /ManagementUser/removeApproved/:id
export const removeApproval = async (userId: string) => {
  const { data } = await api.post(`/ManagementUser/removeApproved/${userId}`);
  return data;
};

// POST /ManagementUser/addrole
export const addRoleToUser = async (payload: IAddRolePayload) => {
  const { data } = await api.post("/ManagementUser/addrole", payload);
  return data;
};

// POST /ManagementUser/removerole
export const removeRoleFromUser = async (payload: IRemoveRolePayload) => {
  const { data } = await api.post("/ManagementUser/removerole", payload);
  return data;
};

// PUT /ManagementUser/withdrawFromOrganization
export const withdrawFromOrganization = async () => {
  const { data } = await api.put("/ManagementUser/withdrawFromOrganization");
  return data;
};

// PUT /ManagementUser/ChangeAdmin/:id
export const changeAdmin = async (userId: string) => {
  const { data } = await api.put(`/ManagementUser/ChangeAdmin/${userId}`);
  return data;
};