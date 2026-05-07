"use client";

import React, { useState } from "react";
import DeleteConfirmDialog from "@/src/shared/ui/DeleteConfirmDialog";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { deleteReceiveAction } from "../action/receive.action";
import { useQueryClient } from "@tanstack/react-query";
import { IReceive } from "../types/types";

interface DeleteReceiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receive: IReceive | null;
}

const DeleteReceiveDialog: React.FC<DeleteReceiveDialogProps> = ({ open, onOpenChange, receive }) => {
  const t = useTranslations("pages.receive");
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    if (!receive) return;
    setIsPending(true);
    try {
      const result = await deleteReceiveAction(receive.recieveId);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["receive"] });
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
      itemName={receive?.recieveFrom ?? ""}
      description={t("delete.desc", { name: receive?.recieveFrom ?? "" })}
      onConfirm={handleConfirm}
      isPending={isPending}
    />
  );
};

export default DeleteReceiveDialog;