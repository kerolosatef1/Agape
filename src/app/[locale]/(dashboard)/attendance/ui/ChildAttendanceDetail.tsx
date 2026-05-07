"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Check, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AvatarCircle from "@/src/shared/ui/AvatarCircle";
import Loader from "@/src/shared/ui/Loader";
import { useChildAttendance } from "../hooks/attendance.hooks";
import { useAllChildren } from "../../children/hooks/children.hooks";
import { useAllClasses } from "../../classes/hooks/classes.hooks";
import { useRouter } from "@/src/i18n/navigation";

interface ChildAttendanceDetailProps {
  childId: number;
}

const ChildAttendanceDetail: React.FC<ChildAttendanceDetailProps> = ({ childId }) => {
  const t = useTranslations("pages.attendance");
  const router = useRouter();

  const { data: records, isLoading: recordsLoading } = useChildAttendance(childId);
  const { data: children } = useAllChildren();
  const { data: classes } = useAllClasses();

  const child = children?.find((c) => c.chiledId === childId);
  const classLabel = classes?.find((c) => c.classId === child?.classId)?.className || "—";

  // ═══ ALL hooks MUST be above any return ═══

  const uniqueByDate = useMemo(() => {
    if (!records) return [];
    const dateMap = new Map<string, (typeof records)[0]>();
    const sorted = [...records].sort(
      (a, b) => a.attendanceChiledId - b.attendanceChiledId,
    );
    sorted.forEach((record) => {
      dateMap.set(record.date, record);
    });
    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [records]);

  const totalSessions = uniqueByDate.length;
  const presentSessions = uniqueByDate.filter((r) => r.attend).length;
  const absentSessions = totalSessions - presentSessions;
  const attendanceRate = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0;

  // ═══ NOW the early returns ═══

  if (recordsLoading || !children) return <Loader />;
  if (!child) return <p className="text-center py-10 text-muted-foreground">{t("childNotFound")}</p>;

  // ... rest of the JSX


  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/attendance")}
        className="gap-2"
        style={{ color: "#1a1a6e" }}
      >
        <ArrowLeft size={16} />
        {t("backToAttendance")}
      </Button>

      {/* Child Info Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <AvatarCircle name={child.chiledName} gender={child.gender} size="lg" />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#1a1a6e" }}>{child.chiledName}</h1>
              <p className="text-muted-foreground">{classLabel}</p>
              {child.typeNeedy && (
                <Badge className="mt-1 text-xs" style={{ backgroundColor: "rgba(139, 26, 58, 0.1)", color: "#8b1a3a", border: "none" }}>
                  {t("needsSupport")}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{totalSessions}</p>
            <p className="text-xs text-muted-foreground">{t("detail.totalSessions")}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-green-600">{presentSessions}</p>
            <p className="text-xs text-muted-foreground">{t("detail.present")}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold text-red-600">{absentSessions}</p>
            <p className="text-xs text-muted-foreground">{t("detail.absent")}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold" style={{ color: "#1a1a6e" }}>{attendanceRate}%</p>
            <p className="text-xs text-muted-foreground">{t("detail.rate")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      {/* Attendance History */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#1a1a6e" }}>
            {t("detail.history")}
          </h3>

          {uniqueByDate.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">{t("detail.noRecords")}</p>
          ) : (
            <div className="space-y-3">
              {uniqueByDate.map((record) => (
                <div
                  key={record.attendanceChiledId}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <Badge
                    className={`text-xs gap-1 ${
                      record.attend
                        ? "bg-green-100 text-green-700 border-0"
                        : "bg-red-100 text-red-700 border-0"
                    }`}
                  >
                    {record.attend ? <Check size={10} /> : <X size={10} />}
                    {record.attend ? t("presentLabel") : t("absentLabel")}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildAttendanceDetail;