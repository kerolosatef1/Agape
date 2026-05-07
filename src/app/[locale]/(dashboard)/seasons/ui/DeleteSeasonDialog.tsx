"use client";

import React, { useState } from "react";
import { ConfirmDialog } from "@/src/shared/ui/ConfirmDialog";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { deleteSeasonAction } from "../action/seasons.action";
import { useQueryClient } from "@tanstack/react-query";
import { ISeason } from "../types/types";

interface DeleteSeasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: ISeason | null;
}

const DeleteSeasonDialog: React.FC<DeleteSeasonDialogProps> = ({
  open,
  onOpenChange,
  season,
}) => {
  const t = useTranslations("pages.seasons");
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    if (!season) return;
    setIsPending(true);
    try {
      const result = await deleteSeasonAction(season.seasonId);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["seasons"] });
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("delete.title")}
      description={t("delete.desc", { name: season?.seasonName ?? "" })}
      confirmLabel={t("delete.confirm")}
      cancelLabel={t("delete.cancel")}
      onConfirm={handleConfirm}
      isPending={isPending}
      variant="danger"
    />
  );
};

export default DeleteSeasonDialog;