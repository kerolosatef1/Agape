import { useQuery } from "@tanstack/react-query";
import { getAllChildren, getChildById } from "../service/children.services";

export function useAllChildren() {
  return useQuery({
    queryKey: ["children", "all"],
    queryFn: getAllChildren,
    staleTime: 30 * 1000,
  });
}

export function useChildById(id: number | null) {
  return useQuery({
    queryKey: ["children", "single", id],
    queryFn: () => getChildById(id!),
    enabled: id !== null,
    staleTime: 30 * 1000,
  });
}