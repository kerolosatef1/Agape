"use client";

import React, { useState } from "react";
import { ConfirmDialog } from "@/src/shared/ui/ConfirmDialog";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { deleteWithdrawAction } from "../action/budget-withdraw.action";
import { useQueryClient } from "@tanstack/react-query";
import { IBudgetWithdraw } from "../types/types";

interface DeleteWithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: IBudgetWithdraw | null;
}

const DeleteWithdrawDialog: React.FC<DeleteWithdrawDialogProps> = ({
  open,
  onOpenChange,
  budget,
}) => {
  const t = useTranslations("pages.budgetWithdraw");
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    if (!budget) return;
    setIsPending(true);
    try {
      const result = await deleteWithdrawAction(budget.budgetWithdrawId);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["budget-withdraw"] });
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

export default DeleteWithdrawDialog;