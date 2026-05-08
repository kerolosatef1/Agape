import { useQuery } from "@tanstack/react-query";
import { getAllWithdraws } from "../service/budget-withdraw.services";

export function useAllWithdraws() {
  return useQuery({
    queryKey: ["budget-withdraw", "all"],
    queryFn: getAllWithdraws,
    staleTime: 30 * 1000,
  });
}