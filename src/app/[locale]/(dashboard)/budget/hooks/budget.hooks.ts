import { useQuery } from "@tanstack/react-query";
import { getAllBudgets } from "../service/budget.services";

export function useAllBudgets() {
  return useQuery({
    queryKey: ["budget", "all"],
    queryFn: getAllBudgets,
    staleTime: 30 * 1000,
  });
}