"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { CheckCheck, Save, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import PageTitle from "@/src/shared/ui/PageTitle";
import SearchInput from "@/src/shared/ui/SearchInput";
import FilterTabs from "@/src/shared/ui/FilterTabs";
import Pagination from "@/src/shared/ui/Pagination";
import AvatarCircle from "@/src/shared/ui/AvatarCircle";
import Loader from "@/src/shared/ui/Loader";
import Spinner from "@/src/shared/ui/Spinner";
import { useAllChildren } from "../../children/hooks/children.hooks";
import { useAllClasses } from "../../classes/hooks/classes.hooks";
import { useAllAttendance } from "../hooks/attendance.hooks";
import { saveBulkAttendanceAction, addAttendanceAction } from "../action/attendance.action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "@/src/i18n/navigation";

const PAGE_SIZE = 15;

const AttendancePage: React.FC = () => {
  const t = useTranslations("pages.attendance");
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: children, isLoading: childrenLoading } = useAllChildren();
  const { data: classes } = useAllClasses();
  const { data: existingAttendance } = useAllAttendance();

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Today's date
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Class filter tabs
  const classTabs = useMemo(() => {
    const tabs = [{ key: "all", label: t("allClasses") }];
    classes?.forEach((cls) => {
      tabs.push({ key: String(cls.classId), label: cls.className });
    });
    return tabs;
  }, [classes, t]);

  // Filter
  const filteredChildren = useMemo(() => {
    if (!children) return [];
    let result = children;

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((c) => c.chiledName.toLowerCase().includes(term));
    }

    if (classFilter !== "all") {
      result = result.filter((c) => c.classId === Number(classFilter));
    }

    return result;
  }, [children, search, classFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredChildren.length / PAGE_SIZE);
  const paginatedChildren = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredChildren.slice(start, start + PAGE_SIZE);
  }, [filteredChildren, currentPage]);

  useMemo(() => setCurrentPage(1), [search, classFilter]);

  // Get today's attendance for a child
  const getAttendStatus = (chiledId: number): boolean | null => {
    if (attendanceMap[chiledId] !== undefined) return attendanceMap[chiledId];
    // Get latest record for this child
    const records = existingAttendance?.filter((a) => a.chiledId === chiledId) || [];
    if (records.length > 0) {
      const latest = records[records.length - 1];
      return latest.attend;
    }
    return null;
  };

  const setAttendForChild = (chiledId: number, attend: boolean) => {
    setAttendanceMap((prev) => ({ ...prev, [chiledId]: attend }));
  };

  const markAllPresent = () => {
    const newMap: Record<number, boolean> = { ...attendanceMap };
    filteredChildren.forEach((c) => { newMap[c.chiledId] = true; });
    setAttendanceMap(newMap);
  };

  const markAllAbsent = () => {
    const newMap: Record<number, boolean> = { ...attendanceMap };
    filteredChildren.forEach((c) => { newMap[c.chiledId] = false; });
    setAttendanceMap(newMap);
  };

  const handleSaveBulk = async () => {
    const items = Object.entries(attendanceMap).map(([id, attend]) => ({
      chiledId: Number(id),
      attend,
    }));
    if (items.length === 0) { toast.error(t("noChanges")); return; }

    setIsSaving(true);
    try {
      const result = await saveBulkAttendanceAction(items);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["attendance"] });
        setAttendanceMap({});
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Stats
  const presentCount = filteredChildren.filter((c) => getAttendStatus(c.chiledId) === true).length;
  const absentCount = filteredChildren.filter((c) => getAttendStatus(c.chiledId) === false).length;
  const unmarkedCount = filteredChildren.length - presentCount - absentCount;
  const hasChanges = Object.keys(attendanceMap).length > 0;
  const percentage = filteredChildren.length > 0 ? Math.round((presentCount / filteredChildren.length) * 100) : 0;

  if (childrenLoading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageTitle
        count={undefined}
        countLabel={today.toUpperCase()}
        title={t("title")}
        description={t("desc")}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-xs font-bold tracking-widest uppercase text-green-700">{t("present")}</p>
            </div>
            <p className="text-3xl font-bold">{presentCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{percentage}% {t("ofClass")}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-xs font-bold tracking-widest uppercase text-red-700">{t("absent")}</p>
            </div>
            <p className="text-3xl font-bold">{absentCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("followUp")}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <p className="text-xs font-bold tracking-widest uppercase text-gray-600">{t("unmarked")}</p>
            </div>
            <p className="text-3xl font-bold">{unmarkedCount}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("stillToRecord")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters + Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("searchPlaceholder")}
          className="flex-1 min-w-[200px] max-w-md"
        />
        <FilterTabs tabs={classTabs} activeTab={classFilter} onTabChange={setClassFilter} />
        <div className="flex gap-2 ms-auto">
          <Button variant="outline" size="sm" onClick={markAllPresent} className="gap-1">
            <CheckCheck size={14} />
            {t("markAllPresent")}
          </Button>
          <Button variant="outline" size="sm" onClick={markAllAbsent} className="gap-1 text-destructive">
            {t("markAllAbsent")}
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {/* Table header info */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold">
              {classFilter === "all" ? t("allClasses") : classTabs.find((c) => c.key === classFilter)?.label} · {filteredChildren.length} {t("students")}
            </p>
            <p className="text-xs text-muted-foreground">{t("sortedByName")}</p>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="ps-6 text-xs font-bold tracking-widest uppercase text-muted-foreground">{t("table.name")}</TableHead>
                <TableHead className="text-xs font-bold tracking-widest uppercase text-muted-foreground">{t("table.class")}</TableHead>
                <TableHead className="text-end pe-6 text-xs font-bold tracking-widest uppercase text-muted-foreground">{t("table.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedChildren.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    {search ? t("noResults") : t("empty")}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedChildren.map((child) => {
                  const status = getAttendStatus(child.chiledId);
                  const classLabel = classes?.find((c) => c.classId === child.classId)?.className || "—";

                  return (
                    <TableRow
                      key={child.chiledId}
                      className="cursor-pointer hover:bg-gray-50/50"
                      onClick={() => router.push(`/attendance/${child.chiledId}`)}
                    >
                      <TableCell className="ps-6">
                        <span className="font-medium">{child.chiledName}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{classLabel}</TableCell>
                      <TableCell className="text-end pe-6">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {/* Present Button */}
                          <button
                            onClick={() => setAttendForChild(child.chiledId, true)}
                            className={`
                              flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer border
                              ${status === true
                                ? "bg-green-600 text-white border-green-600"
                                : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                              }
                            `}
                          >
                            <Check size={14} />
                            {t("presentLabel")}
                          </button>

                          {/* Absent Button */}
                          <button
                            onClick={() => setAttendForChild(child.chiledId, false)}
                            className={`
                              flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer border
                              ${status === false
                                ? "bg-[#c4943d] text-white border-[#c4943d]"
                                : "bg-white text-gray-600 border-gray-200 hover:border-[#c4943d]/50"
                              }
                            `}
                          >
                            <X size={14} />
                            {t("absentLabel")}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Floating Save */}
      {hasChanges && (
        <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50">
          <Button
            onClick={handleSaveBulk}
            disabled={isSaving}
            className="gap-2 shadow-lg px-8 py-3 rounded-full"
            style={{ backgroundColor: "#1a1a6e" }}
            size="lg"
          >
            {isSaving ? <Spinner /> : <><Save size={18} />{t("saveAll")} ({Object.keys(attendanceMap).length})</>}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;