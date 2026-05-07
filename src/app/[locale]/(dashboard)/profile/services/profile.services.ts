import { api } from "@/src/shared/lib/axios/axios.instance";
import { IOrganizationProfile, IUserProfile } from "../types/types";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

// ═══════════════ Organization Profile (Admin) ═══════════════

export const getMyOrganization = async (): Promise<IOrganizationProfile> => {
  const { data } = await api.get("/OrganizationProfileEdit/myOrganization");
  if (data.organizationImagePath) {
    data.organizationImagePath = `${IMAGE_BASE_URL}${data.organizationImagePath}`;
  }
  return data;
};

export const editOrganizationName = async (organizationName: string) => {
  const { data } = await api.put(
    "/OrganizationProfileEdit/editOrganizationName",
    { organizationName },
  );
  return data;
};

export const editOrganizationImage = async (file: File) => {
  const formData = new FormData();
  formData.append("OrgImage", file);
  const { data } = await api.put(
    "/OrganizationProfileEdit/editOrganizationImage",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
};

export const deleteOrganizationImage = async () => {
  const { data } = await api.delete(
    "/OrganizationProfileEdit/deleteOrganizationImage",
  );
  return data;
};

// ═══════════════ User Profile ═══════════════

export const getUserProfile = async (): Promise<IUserProfile> => {
  const { data } = await api.get("/UserProfile/userProfile");
  if (data.pathImg) {
    data.pathImg = `${IMAGE_BASE_URL}${data.pathImg}`;
  }
  return data;
};

export const changeUserEmail = async (email: string) => {
  const { data } = await api.put("/UserProfile/changeEmailAdress", { email });
  return data;
};

export const changeUserName = async (name: string) => {
  const { data } = await api.put("/UserProfile/changeName", { name });
  return data;
};

export const editUserImage = async (file: File) => {
  const formData = new FormData();
  formData.append("Image", file);
  const { data } = await api.put("/UserProfile/editUserImage", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteUserImage = async () => {
  const { data } = await api.delete("/UserProfile/deleteUserImage");
  return data;
};