import { useQuery } from "@tanstack/react-query";
import { getAllPointScores, getActivatedPointScore } from "../service/point-score.services";

export const usePointScores = () => useQuery({ queryKey: ["pointScores"], queryFn: getAllPointScores, staleTime: 30000 });
export const useActivatedPointScore = () => useQuery({ queryKey: ["pointScores", "active"], queryFn: getActivatedPointScore, staleTime: 30000 });