"use client";

import React, { useActionState, useEffect, useTransition, useState } from "react";
import { DialogShell } from "@/src/shared/ui/DialogShell";
import FormField from "@/src/shared/ui/FormField";
import { Button } from "@/components/ui/button";
import { BookOpen, Hash, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { addClassFormAction, ClassActionState } from "../action/classes.action";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/src/shared/ui/Spinner";

const initialState: ClassActionState = { success: false, message: "" };

interface AddClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddClassDialog: React.FC<AddClassDialogProps> = ({ open, onOpenChange }) => {
  const t = useTranslations("pages.classes");
  const queryClient = useQueryClient();

  const [state, formAction] = useActionState(addClassFormAction, initialState);
  const [isTransitioning, startTransition] = useTransition();

  const [className, setClassName] = useState("");
  const [serialNo, setSerialNo] = useState("");

  const isValid = className.trim().length > 0 && Number(serialNo) > 0;

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        onOpenChange(false);
        setClassName("");
        setSerialNo("");
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const fd = new FormData();
    fd.append("className", className.trim());
    fd.append("classSerialNo", serialNo);
    startTransition(() => formAction(fd));
  };

  return (
    <DialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={t("add.title")}
      icon={<Plus size={16} className="text-white" />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
        <FormField
          type="text"
          id="className"
          label={t("add.name")}
          placeholder={t("add.namePlaceholder")}
          labelIcon={<BookOpen size={16} />}
          value={className}
          onChange={(e: any) => setClassName(e.target.value)}
        />

        <FormField
          type="number"
          id="classSerialNo"
          label={t("add.serialNo")}
          placeholder={t("add.serialNoPlaceholder")}
          labelIcon={<Hash size={16} />}
          value={serialNo}
          onChange={(e: any) => setSerialNo(e.target.value)}
          min="1"
        />

        <Button type="submit" className="w-full" disabled={!isValid || isTransitioning}>
          {isTransitioning ? <Spinner /> : t("add.submit")}
        </Button>
      </form>
    </DialogShell>
  );
};

export default AddClassDialog;