"use client";

import React, { useState } from "react";
import { ConfirmDialog } from "@/src/shared/ui/ConfirmDialog";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { deleteClassAction } from "../action/classes.action";
import { useQueryClient } from "@tanstack/react-query";
import { IClass } from "../types/types";

interface DeleteClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: IClass | null;
}

const DeleteClassDialog: React.FC<DeleteClassDialogProps> = ({
  open,
  onOpenChange,
  classData,
}) => {
  const t = useTranslations("pages.classes");
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    if (!classData) return;
    setIsPending(true);
    try {
      const result = await deleteClassAction(classData.classId);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["classes"] });
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
      description={t("delete.desc", { name: classData?.className ?? "" })}
      confirmLabel={t("delete.confirm")}
      cancelLabel={t("delete.cancel")}
      onConfirm={handleConfirm}
      isPending={isPending}
      variant="danger"
    />
  );
};

export default DeleteClassDialog;