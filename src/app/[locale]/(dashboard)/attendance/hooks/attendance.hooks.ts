import { useQuery } from "@tanstack/react-query";
import { getAllAttendance, getAttendanceByChildId } from "../service/attendance.services";

export function useAllAttendance() {
  return useQuery({
    queryKey: ["attendance", "all"],
    queryFn: getAllAttendance,
    staleTime: 30 * 1000,
  });
}

export function useChildAttendance(chiledId: number | null) {
  return useQuery({
    queryKey: ["attendance", "child", chiledId],
    queryFn: () => getAttendanceByChildId(chiledId!),
    enabled: chiledId !== null,
    staleTime: 30 * 1000,
  });
}