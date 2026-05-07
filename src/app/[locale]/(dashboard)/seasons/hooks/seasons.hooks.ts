import { useQuery } from "@tanstack/react-query";
import { getAllSeasons, getActivatedSeason } from "../service/seasons.services";

export function useAllSeasons() {
  return useQuery({
    queryKey: ["seasons", "all"],
    queryFn: getAllSeasons,
    staleTime: 30 * 1000,
  });
}

export function useActivatedSeason() {
  return useQuery({
    queryKey: ["seasons", "active"],
    queryFn: getActivatedSeason,
    staleTime: 30 * 1000,
  });
}