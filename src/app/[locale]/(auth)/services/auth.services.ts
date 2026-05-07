import { api } from "@/src/shared/lib/axios/axios.instance";
import {
  ILoginFormData,
  IRegisterUserFormData,
  IChangeOrgFormData,
} from "../types/types";

// POST /Auth/token
export const userLogin = async (data: ILoginFormData) => {
  const { data: res } = await api.post("/Auth/token", data);
  return res;
};

// POST /Auth/registerUser/:organizationId
export const registerUser = async (
  organizationId: string,
  data: IRegisterUserFormData,
) => {
  const { data: res } = await api.post(
    `/Auth/registerUser/${organizationId}`,
    data,
  );
  return res;
};

// GET /Auth/Organizations
export const getOrganizations = async () => {
  const { data: res } = await api.get("/Auth/Organizations");
  return res;
};

// POST /Auth/changeOrganization
export const changeOrganization = async (data: IChangeOrgFormData) => {
  const { data: res } = await api.post("/Auth/changeOrganization", data);
  return res;
};