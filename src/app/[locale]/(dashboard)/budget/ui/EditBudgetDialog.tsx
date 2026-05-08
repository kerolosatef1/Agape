"use client";

import React, { useActionState, useEffect, useTransition } from "react";
import { DialogShell } from "@/src/shared/ui/DialogShell";
import FormField from "@/src/shared/ui/FormField";
import { Button } from "@/components/ui/button";
import { HandCoins, FileText, DollarSign, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { editBudgetFormAction, BudgetActionState } from "../action/budget.action";
import { getBudgetSchema, TBudgetInput } from "../validation/budget.validation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/src/shared/ui/Spinner";
import { IBudgetAdd } from "../types/types";

const initialState: BudgetActionState = { success: false, message: "" };

interface EditBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: IBudgetAdd | null;
}

const EditBudgetDialog: React.FC<EditBudgetDialogProps> = ({
  open,
  onOpenChange,
  budget,
}) => {
  const t = useTranslations("pages.budget");
  const queryClient = useQueryClient();

  const [state, formAction] = useActionState(editBudgetFormAction, initialState);
  const [isTransitioning, startTransition] = useTransition();

  const budgetSchema = getBudgetSchema(t);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TBudgetInput>({
    resolver: zodResolver(budgetSchema),
    mode: "onChange",
  });

  // Reset form when budget changes
  useEffect(() => {
    if (budget) {
      reset({
        volunteerName: budget.volunteerName,
        description: budget.description,
        moneyAdd: budget.moneyAdd,
      });
    }
  }, [budget, reset]);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        queryClient.invalidateQueries({ queryKey: ["budget"] });
        onOpenChange(false);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const onSubmit: SubmitHandler<TBudgetInput> = (data) => {
    if (!budget) return;
    const fd = new FormData();
    fd.append("budgetAddId", String(budget.budgetAddId));
    fd.append("volunteerName", data.volunteerName);
    fd.append("description", data.description);
    fd.append("moneyAdd", String(data.moneyAdd));
    startTransition(() => formAction(fd));
  };

  return (
    <DialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={t("edit.title")}
      icon={<Pencil size={16} className="text-white" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-4">
        <FormField
          type="text"
          id="editVolunteerName"
          label={t("add.volunteerName")}
          placeholder={t("add.volunteerNamePlaceholder")}
          labelIcon={<HandCoins size={16} />}
          hasError={!!errors?.volunteerName?.message}
          errorMessage={errors?.volunteerName?.message || ""}
          {...register("volunteerName")}
        />

        <FormField
          fieldType="textarea"
          id="editDescription"
          label={t("add.description")}
          placeholder={t("add.descriptionPlaceholder")}
          labelIcon={<FileText size={16} />}
          hasError={!!errors?.description?.message}
          errorMessage={errors?.description?.message || ""}
          {...register("description")}
        />

        <FormField
          type="number"
          id="editMoneyAdd"
          label={t("add.moneyAdd")}
          placeholder={t("add.moneyAddPlaceholder")}
          labelIcon={<DollarSign size={16} />}
          hasError={!!errors?.moneyAdd?.message}
          errorMessage={errors?.moneyAdd?.message || ""}
          {...register("moneyAdd", { valueAsNumber: true })}
          min="1"
        />

        <Button type="submit" className="w-full" disabled={!isValid || isTransitioning}>
          {isTransitioning ? <Spinner /> : t("edit.submit")}
        </Button>
      </form>
    </DialogShell>
  );
};

export default EditBudgetDialog;