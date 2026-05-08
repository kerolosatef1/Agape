import { useQuery } from "@tanstack/react-query";
import { getAllClasses, getClassUsers } from "../service/classes.services";

export function useAllClasses() {
  return useQuery({
    queryKey: ["classes", "all"],
    queryFn: getAllClasses,
    staleTime: 30 * 1000,
  });
}

export function useClassUsers() {
  return useQuery({
    queryKey: ["classes", "users"],
    queryFn: getClassUsers,
    staleTime: 30 * 1000,
  });
}