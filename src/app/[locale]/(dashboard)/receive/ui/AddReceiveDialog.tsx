"use client";

import React, { useActionState, useEffect, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FormField from "@/src/shared/ui/FormField";
import ClassSelect from "@/src/shared/ui/ClassSelect";
import { Button } from "@/components/ui/button";
import { HandCoins, FileText, DollarSign, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { addReceiveFormAction, ReceiveActionState } from "../action/receive.action";
import { receiveSchema, TReceiveInput } from "../validation/receive.validation";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/src/shared/ui/Spinner";

const initialState: ReceiveActionState = { success: false, message: "" };

interface AddReceiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddReceiveDialog: React.FC<AddReceiveDialogProps> = ({ open, onOpenChange }) => {
  const t = useTranslations("pages.receive");
  const queryClient = useQueryClient();

  const [state, formAction] = useActionState(addReceiveFormAction, initialState);
  const [isTransitioning, startTransition] = useTransition();

  const {
    register, handleSubmit, reset, watch, setValue,
    formState: { errors, isValid },
  } = useForm<TReceiveInput>({
    resolver: zodResolver(receiveSchema),
    mode: "onChange",
    defaultValues: { recieveFrom: "", description: "", moneyAmount: undefined, classId: "" },
  });

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        queryClient.invalidateQueries({ queryKey: ["receive"] });
        reset();
        onOpenChange(false);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const onSubmit: SubmitHandler<TReceiveInput> = (data) => {
    const fd = new FormData();
    fd.append("recieveFrom", data.recieveFrom);
    fd.append("description", data.description);
    fd.append("moneyAmount", String(data.moneyAmount));
    fd.append("classId", data.classId);
    startTransition(() => formAction(fd));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">{t("add.title")}</DialogTitle>

        <div className="px-6 pt-6 pb-4">
          <p className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: "#c4943d" }}>
            — {t("add.subtitle")} —
          </p>
          <h2 className="text-2xl font-bold mt-1" style={{ color: "#1a1a6e" }}>{t("add.title")}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 flex flex-col gap-4">
          <FormField
            type="text"
            id="recieveFrom"
            label={t("add.recieveFrom")}
            placeholder={t("add.recieveFromPlaceholder")}
            labelIcon={<HandCoins size={16} className="text-[#1a1a6e]" />}
            hasError={!!errors.recieveFrom}
            errorMessage={errors.recieveFrom?.message}
            {...register("recieveFrom")}
          />

          <FormField
            fieldType="textarea"
            id="description"
            label={t("add.description")}
            placeholder={t("add.descriptionPlaceholder")}
            labelIcon={<FileText size={16} className="text-[#1a1a6e]" />}
            hasError={!!errors.description}
            errorMessage={errors.description?.message}
            {...register("description")}
          />

          <FormField
            type="number"
            id="moneyAmount"
            label={t("add.moneyAmount")}
            placeholder={t("add.moneyAmountPlaceholder")}
            labelIcon={<DollarSign size={16} className="text-[#1a1a6e]" />}
            hasError={!!errors.moneyAmount}
            errorMessage={errors.moneyAmount?.message}
            {...register("moneyAmount", { valueAsNumber: true })}
            min="1"
          />

          <ClassSelect
            value={watch("classId")}
            onChange={(v) => setValue("classId", v, { shouldValidate: true })}
            error={errors.classId?.message}
          />

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} className="font-medium" style={{ color: "#1a1a6e" }}>
              {t("add.cancel")}
            </Button>
            <Button type="submit" className="gap-2 rounded-xl px-6" style={{ backgroundColor: "#1a1a6e" }} disabled={!isValid || isTransitioning}>
              {isTransitioning ? <Spinner /> : <><Plus size={16} /> {t("add.submit")}</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReceiveDialog;