"use client";

import React, { useActionState, useEffect, useTransition } from "react";
import { DialogShell } from "@/src/shared/ui/DialogShell";
import FormField from "@/src/shared/ui/FormField";
import { Button } from "@/components/ui/button";
import { HandCoins, FileText, DollarSign, Plus, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { addWithdrawFormAction, WithdrawActionState } from "../action/budget-withdraw.action";
import { getWithdrawSchema, TWithdrawInput } from "../validation/budget-withdraw.validation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAllClasses } from "../../classes/hooks/classes.hooks";
import Spinner from "@/src/shared/ui/Spinner";

const initialState: WithdrawActionState = { success: false, message: "" };

interface AddWithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddWithdrawDialog: React.FC<AddWithdrawDialogProps> = ({ open, onOpenChange }) => {
  const t = useTranslations("pages.budgetWithdraw");
  const queryClient = useQueryClient();
  const { data: classes } = useAllClasses();

  const [state, formAction] = useActionState(addWithdrawFormAction, initialState);
  const [isTransitioning, startTransition] = useTransition();

  const withdrawSchema = getWithdrawSchema(t);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<TWithdrawInput>({
    resolver: zodResolver(withdrawSchema),
    mode: "onChange",
    defaultValues: {
      volunteerName: "",
      description: "",
      withdraw: undefined,
      classId: undefined,
    },
  });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        queryClient.invalidateQueries({ queryKey: ["budget-withdraw"] });
        onOpenChange(false);
        reset();
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const onSubmit: SubmitHandler<TWithdrawInput> = (data) => {
    const fd = new FormData();
    fd.append("volunteerName", data.volunteerName);
    fd.append("description", data.description);
    fd.append("withdraw", String(data.withdraw));
    fd.append("classId", String(data.classId));
    startTransition(() => formAction(fd));
  };

  return (
    <DialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={t("add.title")}
      icon={<Plus size={16} className="text-white" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-4">
        <FormField
          type="text"
          id="volunteerName"
          label={t("add.volunteerName")}
          placeholder={t("add.volunteerNamePlaceholder")}
          labelIcon={<HandCoins size={16} />}
          hasError={!!errors?.volunteerName?.message}
          errorMessage={errors?.volunteerName?.message || ""}
          {...register("volunteerName")}
        />

        <FormField
          fieldType="textarea"
          id="description"
          label={t("add.description")}
          placeholder={t("add.descriptionPlaceholder")}
          labelIcon={<FileText size={16} />}
          hasError={!!errors?.description?.message}
          errorMessage={errors?.description?.message || ""}
          {...register("description")}
        />

        <FormField
          type="number"
          id="withdraw"
          label={t("add.withdraw")}
          placeholder={t("add.withdrawPlaceholder")}
          labelIcon={<DollarSign size={16} />}
          hasError={!!errors?.withdraw?.message}
          errorMessage={errors?.withdraw?.message || ""}
          {...register("withdraw", { valueAsNumber: true })}
          min="1"
        />

        {/* Class Select */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium flex gap-1 items-center">
            <BookOpen size={16} />
            {t("add.class")}
          </label>
          <Controller
            name="classId"
            control={control}
            render={({ field }) => (
              <select
                value={field.value || ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/60 focus:border-transparent focus-within:outline-black"
              >
                <option value="">{t("add.classPlaceholder")}</option>
                {classes?.map((cls) => (
                  <option key={cls.classId} value={cls.classId}>
                    {cls.className}
                  </option>
                ))}
              </select>
            )}
          />
          {errors?.classId?.message && (
            <p className="text-xs text-destructive">{errors.classId.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={!isValid || isTransitioning}>
          {isTransitioning ? <Spinner /> : t("add.submit")}
        </Button>
      </form>
    </DialogShell>
  );
};

export default AddWithdrawDialog;