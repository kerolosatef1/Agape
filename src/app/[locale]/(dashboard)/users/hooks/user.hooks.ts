import { useQuery } from "@tanstack/react-query";
import {
  getPendingUsers,
  getApprovedUsers,
  getAvailableRoles,
} from "../service/users.services";

export function usePendingUsers() {
  return useQuery({
    queryKey: ["users", "pending"],
    queryFn: getPendingUsers,
    staleTime: 30 * 1000,
  });
}

export function useApprovedUsers() {
  return useQuery({
    queryKey: ["users", "approved"],
    queryFn: getApprovedUsers,
    staleTime: 30 * 1000,
  });
}

export function useAvailableRoles() {
  return useQuery({
    queryKey: ["users", "roles"],
    queryFn: getAvailableRoles,
    staleTime: 5 * 60 * 1000,
  });
}