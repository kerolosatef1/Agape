import { useQuery } from "@tanstack/react-query";
import { getAllReceives } from "../service/receive.services";

export function useAllReceives() {
  return useQuery({
    queryKey: ["receive", "all"],
    queryFn: getAllReceives,
    staleTime: 30 * 1000,
  });
}