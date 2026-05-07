"use client";

import React, { useState } from "react";
import { ConfirmDialog } from "@/src/shared/ui/ConfirmDialog";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { deleteBudgetAction } from "../action/budget.action";
import { useQueryClient } from "@tanstack/react-query";
import { IBudgetAdd } from "../types/types";

interface DeleteBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: IBudgetAdd | null;
}

const DeleteBudgetDialog: React.FC<DeleteBudgetDialogProps> = ({
  open,
  onOpenChange,
  budget,
}) => {
  const t = useTranslations("pages.budget");
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    if (!budget) return;
    setIsPending(true);
    try {
      const result = await deleteBudgetAction(budget.budgetAddId);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["budget"] });
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
      description={t("delete.desc", { name: budget?.volunteerName ?? "" })}
      confirmLabel={t("delete.confirm")}
      cancelLabel={t("delete.cancel")}
      onConfirm={handleConfirm}
      isPending={isPending}
      variant="danger"
    />
  );
};

export default DeleteBudgetDialog;