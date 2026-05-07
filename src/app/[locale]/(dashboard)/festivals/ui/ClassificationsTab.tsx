"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FormField from "@/src/shared/ui/FormField";
import SearchInput from "@/src/shared/ui/SearchInput";
import DeleteConfirmDialog from "@/src/shared/ui/DeleteConfirmDialog";
import Spinner from "@/src/shared/ui/Spinner";
import Loader from "@/src/shared/ui/Loader";
import { useClassifications } from "../hooks/festivals.hooks";
import {
  addClassificationAction,
  editClassificationAction,
  deleteClassificationAction,
} from "../action/festivals.action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IClassification } from "../types/types";

const ClassificationsTab: React.FC = () => {
  const t = useTranslations("pages.festivalModule");
  const queryClient = useQueryClient();
  const { data: items, isLoading } = useClassifications();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<IClassification | null>(null);
  const [deleting, setDeleting] = useState<IClassification | null>(null);
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered =
    items?.filter((c) =>
      c.classificationName.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsPending(true);
    try {
      const result = editing
        ? await editClassificationAction(
            editing.classificationFestivalFamilyId,
            name.trim(),
          )
        : await addClassificationAction(name.trim());
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["classifications"] });
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
      const result = await deleteClassificationAction(
        deleting.classificationFestivalFamilyId,
      );
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["classifications"] });
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
          placeholder={t("classifications.search")}
          className="max-w-md"
        />
        <Button
          onClick={() => {
            setEditing(null);
            setName("");
            setDialogOpen(true);
          }}
          className="gap-2 rounded-xl"
          style={{ backgroundColor: "#1a1a6e" }}
        >
          <Plus size={16} /> {t("classifications.add")}
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          {t("classifications.empty")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Card
              key={c.classificationFestivalFamilyId}
              className="border-0 shadow-sm group"
            >
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{ backgroundColor: "rgba(26, 26, 110, 0.08)" }}
                  >
                    <Tag className="h-5 w-5" style={{ color: "#1a1a6e" }} />
                  </div>
                  <h3 className="font-semibold">{c.classificationName}</h3>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => {
                      setEditing(c);
                      setName(c.classificationName);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-destructive"
                    onClick={() => {
                      setDeleting(c);
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

      <Dialog
        open={dialogOpen}
        onOpenChange={(v) => {
          if (!v) setName("");
          setDialogOpen(v);
        }}
      >
        <DialogContent className="sm:max-w-md p-0">
          <DialogTitle className="sr-only">
            {editing ? t("classifications.edit") : t("classifications.add")}
          </DialogTitle>
          <div className="px-6 pt-6 pb-4">
            <p
              className="text-xs font-medium tracking-[0.25em] uppercase"
              style={{ color: "#c4943d" }}
            >
              — {t("classifications.label")} —
            </p>
            <h2
              className="text-2xl font-bold mt-1"
              style={{ color: "#1a1a6e" }}
            >
              {editing ? t("classifications.edit") : t("classifications.add")}
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="px-6 pb-6 flex flex-col gap-4"
          >
            <FormField
              type="text"
              id="classificationName"
              label={t("classifications.name")}
              placeholder={t("classifications.namePlaceholder")}
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
                {isPending ? <Spinner /> : t("common.save")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={deleting?.classificationName ?? ""}
        description={t("classifications.deleteDesc", {
          name: deleting?.classificationName ?? "",
        })}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </div>
  );
};

export default ClassificationsTab;
