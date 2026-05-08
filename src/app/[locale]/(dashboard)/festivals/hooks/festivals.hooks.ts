import { useQuery } from "@tanstack/react-query";
import {
  getAllFestivals,
  getAllClassifications,
  getAllFamilies,
  getAllFestivalUsers,
  getAllPointScores,
  getActivatedPointScore,
} from "../service/festivals.services";

export const useFestivals = () =>
  useQuery({
    queryKey: ["festivals"],
    queryFn: getAllFestivals,
    staleTime: 30000,
  });
export const useClassifications = () =>
  useQuery({
    queryKey: ["classifications"],
    queryFn: getAllClassifications,
    staleTime: 30000,
  });
export const useFamilies = () =>
  useQuery({
    queryKey: ["families"],
    queryFn: getAllFamilies,
    staleTime: 30000,
  });
export const useFestivalUsers = () =>
  useQuery({
    queryKey: ["festivalUsers"],
    queryFn: getAllFestivalUsers,
    staleTime: 30000,
  });
export const usePointScores = () =>
  useQuery({
    queryKey: ["pointScores"],
    queryFn: getAllPointScores,
    staleTime: 30000,
  });
export const useActivatedPointScore = () =>
  useQuery({
    queryKey: ["pointScores", "active"],
    queryFn: getActivatedPointScore,
    staleTime: 30000,
  });
