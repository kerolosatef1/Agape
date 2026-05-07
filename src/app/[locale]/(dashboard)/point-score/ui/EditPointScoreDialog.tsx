"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FormField from "@/src/shared/ui/FormField";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { editPointScoreAction } from "../action/point-score.action";
import { pointScoreSchema, TPointScoreInput } from "../validation/point-score.validation";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/src/shared/ui/Spinner";
import { IPointScore } from "../types/types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pointScore: IPointScore | null;
}

const EditPointScoreDialog: React.FC<Props> = ({ open, onOpenChange, pointScore }) => {
  const t = useTranslations("pages.pointScore");
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<TPointScoreInput>({
    resolver: zodResolver(pointScoreSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open && pointScore) {
      reset({
        name: pointScore.name,
        topicScore: pointScore.topicScore,
        preparationScore: pointScore.preparationScore,
        visitScore: pointScore.visitScore,
        attendClassScore: pointScore.attendClassScore,
        attendVolunteersMeetingScore: pointScore.attendVolunteersMeetingScore,
        festivalwinScore: pointScore.festivalwinScore,
        functionScore: pointScore.functionScore,
        festivalwinIsLeadScore: pointScore.festivalwinIsLeadScore,
      });
    }
  }, [open, pointScore, reset]);

  const handleOpenChange = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const onSubmit: SubmitHandler<TPointScoreInput> = async (data) => {
    if (!pointScore) return;
    setIsPending(true);
    try {
      const result = await editPointScoreAction(pointScore.setPointScoreId, data);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["pointScores"] });
        handleOpenChange(false);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsPending(false);
    }
  };

  const scoreFields = [
    { key: "topicScore" as const, label: t("fields.topic") },
    { key: "preparationScore" as const, label: t("fields.preparation") },
    { key: "visitScore" as const, label: t("fields.visit") },
    { key: "attendClassScore" as const, label: t("fields.classAttend") },
    { key: "attendVolunteersMeetingScore" as const, label: t("fields.meeting") },
    { key: "festivalwinScore" as const, label: t("fields.festivalWin") },
    { key: "functionScore" as const, label: t("fields.function") },
    { key: "festivalwinIsLeadScore" as const, label: t("fields.leadWin") },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">{t("edit.title")}</DialogTitle>
        <div className="px-6 pt-6 pb-4">
          <p className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: "#c4943d" }}>
            — {pointScore?.name} —
          </p>
          <h2 className="text-2xl font-bold mt-1" style={{ color: "#1a1a6e" }}>
            {t("edit.title")}
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 flex flex-col gap-4">
          <FormField
            type="text"
            id="editName"
            label={t("fields.name")}
            placeholder={t("fields.namePlaceholder")}
            hasError={!!errors.name}
            errorMessage={errors.name?.message}
            {...register("name")}
          />
          <div className="grid grid-cols-2 gap-3">
            {scoreFields.map(({ key, label }) => (
              <FormField
                key={key}
                type="number"
                id={`edit_${key}`}
                label={label}
                placeholder="0"
                hasError={!!errors[key]}
                errorMessage={errors[key]?.message}
                {...register(key, { valueAsNumber: true })}
                min="0"
              />
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} style={{ color: "#1a1a6e" }}>
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              className="rounded-xl px-6"
              style={{ backgroundColor: "#1a1a6e" }}
              disabled={!isValid || isPending}
            >
              {isPending ? <Spinner /> : t("edit.submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPointScoreDialog;