"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FormField from "@/src/shared/ui/FormField";
import SearchInput from "@/src/shared/ui/SearchInput";
import DeleteConfirmDialog from "@/src/shared/ui/DeleteConfirmDialog";
import Spinner from "@/src/shared/ui/Spinner";
import Loader from "@/src/shared/ui/Loader";
import {
  useFamilies,
  useFestivals,
  useClassifications,
} from "../hooks/festivals.hooks";
import {
  addFamilyAction,
  editFamilyAction,
  deleteFamilyAction,
  toggleWinAction,
} from "../action/festivals.action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IFestivalFamily } from "../types/types";

const TeamsTab: React.FC = () => {
  const t = useTranslations("pages.festivalModule");
  const queryClient = useQueryClient();
  const { data: teams, isLoading } = useFamilies();
  const { data: festivals } = useFestivals();
  const { data: classifications } = useClassifications();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<IFestivalFamily | null>(null);
  const [deleting, setDeleting] = useState<IFestivalFamily | null>(null);
  const [name, setName] = useState("");
  const [festivalId, setFestivalId] = useState("");
  const [classificationId, setClassificationId] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingWin, setTogglingWin] = useState<number | null>(null);

  const filtered =
    teams?.filter((t) =>
      t.festivalFamilyName.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const openAdd = () => {
    setEditing(null);
    setName("");
    setFestivalId("");
    setClassificationId("");
    setDialogOpen(true);
  };
 const openEdit = (team: IFestivalFamily) => {
    setEditing(team); setName(team.festivalFamilyName);
    setFestivalId(String(team.churchFestivalId)); 
    setClassificationId(String(team.classificationId)); // NOT classificationFestivalFamilyId
    setDialogOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !festivalId || !classificationId) return;
    setIsPending(true);
    try {
      const result = editing
        ? await editFamilyAction(
            editing.festivalFamilyId,
            name.trim(),
            Number(festivalId),
            Number(classificationId),
          )
        : await addFamilyAction(
            name.trim(),
            Number(festivalId),
            Number(classificationId),
          );
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["families"] });
        setDialogOpen(false);
      } else toast.error(result.message);
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      const result = await deleteFamilyAction(deleting.festivalFamilyId);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["families"] });
        setDeleteOpen(false);
      } else toast.error(result.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleWin = async (team: IFestivalFamily) => {
    setTogglingWin(team.festivalFamilyId);
    try {
      const result = await toggleWinAction(team.festivalFamilyId, team.winStatus);
      if (result.success) { toast.success(result.message); queryClient.invalidateQueries({ queryKey: ["families"] }); }
      else toast.error(result.message);
    } finally { setTogglingWin(null); }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("teams.search")}
          className="max-w-md"
        />
        <Button
          onClick={openAdd}
          className="gap-2 rounded-xl"
          style={{ backgroundColor: "#1a1a6e" }}
        >
          <Plus size={16} /> {t("teams.add")}
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          {t("teams.empty")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((team) => {
            const festival = festivals?.find(
              (f) => f.churchFestivalId === team.churchFestivalId,
            );
            // Classification lookup
  const classification = classifications?.find((c) => c.classificationFestivalFamilyId === team.classificationId);

            return (
              <Card key={team.festivalFamilyId} className={`border-0 shadow-sm group ${team.winStatus === 1 ? "ring-2 ring-amber-400" : ""}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2.5 rounded-xl"
                        style={{
                          backgroundColor: team.winStatus
                            ? "rgba(196, 148, 61, 0.15)"
                            : "rgba(26, 26, 110, 0.08)",
                        }}
                      >
                        {team.winStatus ? (
                          <Trophy className="h-5 w-5 text-amber-600" />
                        ) : (
                          <Users
                            className="h-5 w-5"
                            style={{ color: "#1a1a6e" }}
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {team.festivalFamilyName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {festival?.churchFestivalName}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => openEdit(team)}
                      >
                        <Pencil size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-destructive"
                        onClick={() => {
                          setDeleting(team);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {classification?.classificationName}
                    </Badge>
                    <Button
    variant="outline" size="xs"
    onClick={() => handleToggleWin(team)}
    disabled={togglingWin === team.festivalFamilyId}
    className={`gap-1 ${team.winStatus === 1 ? "border-amber-400 text-amber-700" : ""}`}
  >
    {togglingWin === team.festivalFamilyId ? <Spinner className="size-3!" /> : <Trophy size={12} />}
    {team.winStatus === 1 ? t("teams.winner") : t("teams.markWinner")}
  </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(v) => {
          if (!v) {
            setName("");
            setFestivalId("");
            setClassificationId("");
          }
          setDialogOpen(v);
        }}
      >
        <DialogContent className="sm:max-w-md p-0">
          <DialogTitle className="sr-only">
            {editing ? t("teams.edit") : t("teams.add")}
          </DialogTitle>
          <div className="px-6 pt-6 pb-4">
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase"
              style={{ color: "#c4943d" }}
            >
              — {t("teams.label")} —
            </p>
            <h2
              className="text-2xl font-bold mt-1"
              style={{ color: "#1a1a6e" }}
            >
              {editing ? t("teams.edit") : t("teams.add")}
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="px-6 pb-6 flex flex-col gap-4"
          >
            <FormField
              type="text"
              id="teamName"
              label={t("teams.name")}
              placeholder={t("teams.namePlaceholder")}
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">
                {t("teams.festival")}
              </label>
              <select
                value={festivalId}
                onChange={(e) => setFestivalId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a6e]/20 focus-within:outline-none"
              >
                <option value="">{t("teams.selectFestival")}</option>
                {festivals?.map((f) => (
                  <option key={f.churchFestivalId} value={f.churchFestivalId}>
                    {f.churchFestivalName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">
                {t("teams.classification")}
              </label>
              <select
                value={classificationId}
                onChange={(e) => setClassificationId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a6e]/20 focus-within:outline-none"
              >
                <option value="">{t("teams.selectClassification")}</option>
                {classifications?.map((c) => (
                  <option
                    key={c.classificationFestivalFamilyId}
                    value={c.classificationFestivalFamilyId}
                  >
                    {c.classificationName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                style={{ color: "#1a1a6e" }}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className="rounded-xl px-6"
                style={{ backgroundColor: "#1a1a6e" }}
                disabled={
                  !name.trim() || !festivalId || !classificationId || isPending
                }
              >
                {isPending ? <Spinner /> : t("common.save")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={deleting?.festivalFamilyName ?? ""}
        description={t("teams.deleteDesc", {
          name: deleting?.festivalFamilyName ?? "",
        })}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </div>
  );
};

export default TeamsTab;
