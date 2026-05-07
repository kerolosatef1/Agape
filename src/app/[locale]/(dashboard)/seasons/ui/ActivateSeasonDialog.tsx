"use client";

import React, { useActionState, useEffect, useTransition, useState } from "react";
import { DialogShell } from "@/src/shared/ui/DialogShell";
import PasswordField from "@/src/shared/ui/PasswordField";
import PasswordStrength from "@/src/shared/ui/PasswordStrength";
import { Button } from "@/components/ui/button";
import { Lock, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { activateSeasonFormAction, SeasonActionState } from "../action/seasons.action";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/src/shared/ui/Spinner";
import { ISeason } from "../types/types";

const initialState: SeasonActionState = { success: false, message: "" };

interface ActivateSeasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: ISeason | null;
}

const ActivateSeasonDialog: React.FC<ActivateSeasonDialogProps> = ({
  open,
  onOpenChange,
  season,
}) => {
  const t = useTranslations("pages.seasons");
  const queryClient = useQueryClient();

  const [state, formAction] = useActionState(activateSeasonFormAction, initialState);
  const [isTransitioning, startTransition] = useTransition();

  const [password, setPassword] = useState("");

  const isValid = password.length >= 8;

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        queryClient.invalidateQueries({ queryKey: ["seasons"] });
        onOpenChange(false);
        setPassword("");
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !season) return;
    const fd = new FormData();
    fd.append("seasonId", String(season.seasonId));
    fd.append("password", password);
    startTransition(() => formAction(fd));
  };

  return (
    <DialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={t("activate.title")}
      icon={<Zap size={16} className="text-white" />}
      iconBgColor="bg-green-600"
    >
      <div className="pt-4 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          {t("activate.desc", { name: season?.seasonName ?? "" })}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PasswordField
            label={t("activate.password")}
            placeholder={t("activate.passwordPlaceholder")}
            labelIcon={<Lock size={16} />}
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />

          <PasswordStrength password={password} />

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={!isValid || isTransitioning}
          >
            {isTransitioning ? <Spinner /> : t("activate.submit")}
          </Button>
        </form>
      </div>
    </DialogShell>
  );
};

export default ActivateSeasonDialog;