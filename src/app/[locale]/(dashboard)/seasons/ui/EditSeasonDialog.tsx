"use client";

import React, { useActionState, useEffect, useTransition, useState } from "react";
import { DialogShell } from "@/src/shared/ui/DialogShell";
import FormField from "@/src/shared/ui/FormField";
import PasswordField from "@/src/shared/ui/PasswordField";
import PasswordStrength from "@/src/shared/ui/PasswordStrength";
import { Button } from "@/components/ui/button";
import { Calendar, Lock, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { editSeasonFormAction, SeasonActionState } from "../action/seasons.action";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/src/shared/ui/Spinner";
import { ISeason } from "../types/types";

const initialState: SeasonActionState = { success: false, message: "" };

interface EditSeasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: ISeason | null;
}

const EditSeasonDialog: React.FC<EditSeasonDialogProps> = ({
  open,
  onOpenChange,
  season,
}) => {
  const t = useTranslations("pages.seasons");
  const queryClient = useQueryClient();

  const [state, formAction] = useActionState(editSeasonFormAction, initialState);
  const [isTransitioning, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (season) {
      setName(season.seasonName);
      setPassword("");
    }
  }, [season]);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        queryClient.invalidateQueries({ queryKey: ["seasons"] });
        onOpenChange(false);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const isValid = name.trim().length > 0 && password.length >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !season) return;
    const fd = new FormData();
    fd.append("seasonId", String(season.seasonId));
    fd.append("name", name.trim());
    fd.append("password", password);
    startTransition(() => formAction(fd));
  };

  return (
    <DialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={t("edit.title")}
      icon={<Pencil size={16} className="text-white" />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
        <FormField
          type="text"
          id="editSeasonName"
          label={t("add.name")}
          placeholder={t("add.namePlaceholder")}
          labelIcon={<Calendar size={16} />}
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />

        <PasswordField
          label={t("edit.password")}
          placeholder={t("edit.passwordPlaceholder")}
          labelIcon={<Lock size={16} />}
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />

        <PasswordStrength password={password} />

        <Button type="submit" className="w-full" disabled={!isValid || isTransitioning}>
          {isTransitioning ? <Spinner /> : t("edit.submit")}
        </Button>
      </form>
    </DialogShell>
  );
};

export default EditSeasonDialog;