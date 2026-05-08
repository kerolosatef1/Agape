import { useQuery } from "@tanstack/react-query";
import { getAllSpends } from "../service/spend.services";

export function useAllSpends() {
  return useQuery({ queryKey: ["spend", "all"], queryFn: getAllSpends, staleTime: 2000 });
}