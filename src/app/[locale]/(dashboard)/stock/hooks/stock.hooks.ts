import { useQuery } from "@tanstack/react-query";
import { getAllStocks } from "../service/stock.services";

export const useAllStocks = () => useQuery({ queryKey: ["stock"], queryFn: getAllStocks, staleTime: 30000 });