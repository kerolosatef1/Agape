"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FormField from "@/src/shared/ui/FormField";
import SearchInput from "@/src/shared/ui/SearchInput";
import DeleteConfirmDialog from "@/src/shared/ui/DeleteConfirmDialog";
import Spinner from "@/src/shared/ui/Spinner";
import Loader from "@/src/shared/ui/Loader";
import { useFestivals } from "../hooks/festivals.hooks";
import {
  addFestivalAction,
  editFestivalAction,
  deleteFestivalAction,
} from "../action/festivals.action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IChurchFestival } from "../types/types";

const FestivalsTab: React.FC = () => {
  const t = useTranslations("pages.festivalModule");
  const queryClient = useQueryClient();
  const { data: festivals, isLoading } = useFestivals();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<IChurchFestival | null>(null);
  const [deleting, setDeleting] = useState<IChurchFestival | null>(null);
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered =
    festivals?.filter((f) =>
      f.churchFestivalName.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const openAdd = () => {
    setEditing(null);
    setName("");
    setDialogOpen(true);
  };
  const openEdit = (f: IChurchFestival) => {
    setEditing(f);
    setName(f.churchFestivalName);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsPending(true);
    try {
      const result = editing
        ? await editFestivalAction(editing.churchFestivalId, name.trim())
        : await addFestivalAction(name.trim());
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["festivals"] });
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
      const result = await deleteFestivalAction(deleting.churchFestivalId);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["festivals"] });
        setDeleteOpen(false);
      } else toast.error(result.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("festivals.search")}
          className="max-w-md"
        />
        <Button
          onClick={openAdd}
          className="gap-2 rounded-xl"
          style={{ backgroundColor: "#1a1a6e" }}
        >
          <Plus size={16} /> {t("festivals.add")}
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          {t("festivals.empty")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((f) => (
            <Card
              key={f.churchFestivalId}
              className="border-0 shadow-sm hover:shadow-md transition-shadow group"
            >
              <CardContent className="pt-6 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50">
                    <PartyPopper className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold">{f.churchFestivalName}</h3>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => openEdit(f)}
                  >
                    <Pencil size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-destructive"
                    onClick={() => {
                      setDeleting(f);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(v) => {
          if (!v) setName("");
          setDialogOpen(v);
        }}
      >
        <DialogContent className="sm:max-w-md p-0">
          <DialogTitle className="sr-only">
            {editing ? t("festivals.edit") : t("festivals.add")}
          </DialogTitle>
          <div className="px-6 pt-6 pb-4">
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase"
              style={{ color: "#c4943d" }}
            >
              — {t("festivals.label")} —
            </p>
            <h2
              className="text-2xl font-bold mt-1"
              style={{ color: "#1a1a6e" }}
            >
              {editing ? t("festivals.edit") : t("festivals.add")}
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="px-6 pb-6 flex flex-col gap-4"
          >
            <FormField
              type="text"
              id="festivalName"
              label={t("festivals.name")}
              placeholder={t("festivals.namePlaceholder")}
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
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
                disabled={!name.trim() || isPending}
              >
                {isPending ? (
                  <Spinner />
                ) : editing ? (
                  t("common.save")
                ) : (
                  t("festivals.add")
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={deleting?.churchFestivalName ?? ""}
        description={t("festivals.deleteDesc", {
          name: deleting?.churchFestivalName ?? "",
        })}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </div>
  );
};

export default FestivalsTab;
