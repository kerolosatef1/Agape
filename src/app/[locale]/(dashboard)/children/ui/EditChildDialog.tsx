"use client";

import React, { useActionState, useEffect, useTransition } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FormField from "@/src/shared/ui/FormField";
import GenderToggle from "@/src/shared/ui/GenderToggle";
import ClassSelect from "@/src/shared/ui/ClassSelect";
import NeedyCheckbox from "@/src/shared/ui/NeedyCheckBox";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { editChildFormAction, ChildActionState } from "../action/children.action";
import { childSchema, TChildInput } from "../validation/children.validation";
import { useQueryClient } from "@tanstack/react-query";
import { useAllClasses } from "../../classes/hooks/classes.hooks";
import Spinner from "@/src/shared/ui/Spinner";
import { IChild } from "../types/types";

const initialState: ChildActionState = { success: false, message: "" };

interface EditChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  child: IChild | null;
}

const EditChildDialog: React.FC<EditChildDialogProps> = ({ open, onOpenChange, child }) => {
  const t = useTranslations("pages.children");
  const queryClient = useQueryClient();
  const { data: classes } = useAllClasses();

  const [state, formAction] = useActionState(editChildFormAction, initialState);
  const [isTransitioning, startTransition] = useTransition();

  const {
    register, handleSubmit, reset, watch, setValue, control,
    formState: { errors, isValid },
  } = useForm<TChildInput>({
    resolver: zodResolver(childSchema),
    mode: "onChange",
  });

  const classLabel = classes?.find((c) => c.classId === child?.classId)?.className || "";

  useEffect(() => {
    if (open && child) {
      reset({
        chiledName: child.chiledName,
        gender: child.gender,
        description: child.description || "",
        typeNeedy: child.typeNeedy,
        classId: String(child.classId),
      });
    }
  }, [open, child, reset]);

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        queryClient.invalidateQueries({ queryKey: ["children"] });
        reset();
        onOpenChange(false);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const onSubmit: SubmitHandler<TChildInput> = (data) => {
    if (!child) return;
    const fd = new FormData();
    fd.append("chiledId", String(child.chiledId));
    fd.append("chiledName", data.chiledName);
    fd.append("gender", String(data.gender));
    fd.append("description", data.description || "");
    fd.append("typeNeedy", String(data.typeNeedy));
    fd.append("classId", data.classId);
    startTransition(() => formAction(fd));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">{t("edit.title")}</DialogTitle>

        <div className="px-6 pt-6 pb-4">
          <p className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: "#c4943d" }}>
            — {child?.chiledName} · {classLabel} —
          </p>
          <h2 className="text-2xl font-bold mt-1" style={{ color: "#1a1a6e" }}>{t("edit.title")}</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 flex flex-col gap-4">
          <FormField
            type="text"
            id="editChildName"
            label={t("add.name")}
            placeholder={t("add.namePlaceholder")}
            hasError={!!errors.chiledName}
            errorMessage={errors.chiledName?.message}
            {...register("chiledName")}
          />

          <GenderToggle
            value={watch("gender")}
            onChange={(v) => setValue("gender", v, { shouldValidate: true })}
          />

          <ClassSelect
            value={watch("classId")}
            onChange={(v) => setValue("classId", v, { shouldValidate: true })}
            error={errors.classId?.message}
          />

          <FormField
            fieldType="textarea"
            id="editDescription"
            label={t("add.description")}
            placeholder={t("add.descriptionPlaceholder")}
            {...register("description")}
          />

          <Controller
            name="typeNeedy"
            control={control}
            render={({ field }) => (
              <NeedyCheckbox id="editTypeNeedy" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} className="font-medium" style={{ color: "#1a1a6e" }}>
              {t("add.cancel")}
            </Button>
            <Button type="submit" className="rounded-xl px-6" style={{ backgroundColor: "#1a1a6e" }} disabled={!isValid || isTransitioning}>
              {isTransitioning ? <Spinner /> : t("edit.submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChildDialog;