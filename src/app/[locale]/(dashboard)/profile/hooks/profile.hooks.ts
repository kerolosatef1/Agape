import { useQuery } from "@tanstack/react-query";
import { getMyOrganization, getUserProfile } from "../services/profile.services";

export function useMyOrganization() {
  return useQuery({
    queryKey: ["organization", "profile"],
    queryFn: getMyOrganization,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
  });
}