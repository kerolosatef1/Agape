"use client";

import React, { useState } from "react";
import DeleteConfirmDialog from "@/src/shared/ui/DeleteConfirmDialog";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { deleteChildAction } from "../action/children.action";
import { useQueryClient } from "@tanstack/react-query";
import { IChild } from "../types/types";

interface DeleteChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  child: IChild | null;
}

const DeleteChildDialog: React.FC<DeleteChildDialogProps> = ({ open, onOpenChange, child }) => {
  const t = useTranslations("pages.children");
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    if (!child) return;
    setIsPending(true);
    try {
      const result = await deleteChildAction(child.chiledId);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["children"] });
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <DeleteConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      itemName={child?.chiledName ?? ""}
      description={t("delete.descDetailed", { name: child?.chiledName ?? "" })}
      onConfirm={handleConfirm}
      isPending={isPending}
    />
  );
};

export default DeleteChildDialog;