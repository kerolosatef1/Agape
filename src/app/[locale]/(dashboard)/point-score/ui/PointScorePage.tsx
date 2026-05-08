"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2, Zap, Check, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageTitle from "@/src/shared/ui/PageTitle";
import SearchInput from "@/src/shared/ui/SearchInput";
import DeleteConfirmDialog from "@/src/shared/ui/DeleteConfirmDialog";
import Loader from "@/src/shared/ui/Loader";
import Spinner from "@/src/shared/ui/Spinner";
import AddPointScoreDialog from "./AddPointScoreDialog";
import EditPointScoreDialog from "./EditPointScoreDialog";
import { usePointScores } from "../hooks/point-score.hooks";
import { deletePointScoreAction, activatePointScoreAction } from "../action/point-score.action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IPointScore } from "../types/types";

const PointScorePage: React.FC = () => {
  const t = useTranslations("pages.pointScore");
  const queryClient = useQueryClient();
  const { data: scores, isLoading } = usePointScores();

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<IPointScore | null>(null);
  const [activatingId, setActivatingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search filter
  const filtered = useMemo(() => {
    if (!scores) return [];
    if (!search.trim()) return scores;
    return scores.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  }, [scores, search]);

  const handleActivate = async (id: number) => {
    setActivatingId(id);
    try {
      const result = await activatePointScoreAction(id);
      if (result.success) { toast.success(result.message); queryClient.invalidateQueries({ queryKey: ["pointScores"] }); }
      else toast.error(result.message);
    } finally { setActivatingId(null); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setIsDeleting(true);
    try {
      const result = await deletePointScoreAction(selected.setPointScoreId);
      if (result.success) { toast.success(result.message); queryClient.invalidateQueries({ queryKey: ["pointScores"] }); setDeleteOpen(false); }
      else toast.error(result.message);
    } finally { setIsDeleting(false); }
  };

  const scoreLabels = [
    { key: "topicScore", label: t("fields.topic") },
    { key: "preparationScore", label: t("fields.preparation") },
    { key: "visitScore", label: t("fields.visit") },
    { key: "attendClassScore", label: t("fields.classAttend") },
    { key: "attendVolunteersMeetingScore", label: t("fields.meeting") },
    { key: "festivalwinScore", label: t("fields.festivalWin") },
    { key: "functionScore", label: t("fields.function") },
    { key: "festivalwinIsLeadScore", label: t("fields.leadWin") },
  ];

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageTitle title={t("title")} description={t("desc")} count={filtered.length} countLabel={t("configs")}
        action={<Button onClick={() => setAddOpen(true)} className="gap-2 rounded-xl h-11 px-5" style={{ backgroundColor: "#1a1a6e" }}><Plus size={16} /> {t("addBtn")}</Button>}
      />

      {/* Search */}
      <SearchInput value={search} onChange={setSearch} placeholder={t("searchPlaceholder")} className="max-w-md" />

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">{search ? t("noResults") : t("empty")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((score) => (
            <Card key={score.setPointScoreId} className={`border-0 shadow-sm ${score.isActive ? "ring-2 ring-green-400" : ""}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl" style={{ backgroundColor: score.isActive ? "rgba(34,197,94,0.1)" : "rgba(26,26,110,0.08)" }}>
                      <Award className="h-5 w-5" style={{ color: score.isActive ? "#16a34a" : "#1a1a6e" }} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{score.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {score.date ? new Date(score.date).toLocaleDateString() : ""}
                      </p>
                      {score.isActive && (
                        <Badge className="bg-green-100 text-green-700 border-0 text-[10px] gap-1 mt-1">
                          <Check size={10} />{t("active")}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-xs" onClick={() => { setSelected(score); setEditOpen(true); }}>
                      <Pencil size={12} />
                    </Button>
                    <Button variant="ghost" size="icon-xs" className="text-destructive" onClick={() => { setSelected(score); setDeleteOpen(true); }}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {scoreLabels.map(({ key, label }) => (
                    <div key={key} className="text-center p-2 rounded-lg bg-gray-50">
                      <p className="text-lg font-bold" style={{ color: "#1a1a6e" }}>
                        {(score as any)[key]}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Activate Button */}
                {!score.isActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1"
                    onClick={() => handleActivate(score.setPointScoreId)}
                    disabled={activatingId === score.setPointScoreId}
                  >
                    {activatingId === score.setPointScoreId ? <Spinner className="size-3!" /> : <Zap size={14} />}
                    {t("activate")}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddPointScoreDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditPointScoreDialog open={editOpen} onOpenChange={setEditOpen} pointScore={selected} />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={selected?.name ?? ""}
        description={t("deleteDesc", { name: selected?.name ?? "" })}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </div>
  );
};

export default PointScorePage;