"use client";

import { use } from "react";
import ChildAttendanceDetail from "../ui/ChildAttendanceDetail";

export default function ChildAttendancePage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = use(params);
  return <ChildAttendanceDetail childId={Number(childId)} />;
}