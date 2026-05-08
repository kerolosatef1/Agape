"use client";

import React, { useActionState, useEffect, useTransition, useState } from "react";
import { DialogShell } from "@/src/shared/ui/DialogShell";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { addClassUserFormAction, ClassActionState } from "../action/classes.action";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/src/shared/ui/Spinner";
import { useApprovedUsers } from "../../users/hooks/user.hooks";

const initialState: ClassActionState = { success: false, message: "" };

interface AddClassUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: number | null;
}

const AddClassUserDialog: React.FC<AddClassUserDialogProps> = ({
  open,
  onOpenChange,
  classId,
}) => {
  const t = useTranslations("pages.classes");
  const queryClient = useQueryClient();

  const [state, formAction] = useActionState(addClassUserFormAction, initialState);
  const [isTransitioning, startTransition] = useTransition();

  const { data: approvedUsers } = useApprovedUsers();
  const [selectedUserId, setSelectedUserId] = useState("");

  const isValid = selectedUserId.length > 0 && classId !== null;

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        onOpenChange(false);
        setSelectedUserId("");
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const fd = new FormData();
    fd.append("userId", selectedUserId);
    fd.append("classId", String(classId));
    startTransition(() => formAction(fd));
  };

  return (
    <DialogShell
      open={open}
      onOpenChange={onOpenChange}
      title={t("classUsers.addTitle")}
      icon={<UserPlus size={16} className="text-white" />}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t("classUsers.selectUser")}</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/60 focus:border-transparent focus-within:outline-black"
          >
            <option value="">{t("classUsers.selectPlaceholder")}</option>
            {approvedUsers?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} (@{user.userName})
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" className="w-full" disabled={!isValid || isTransitioning}>
          {isTransitioning ? <Spinner /> : t("classUsers.addSubmit")}
        </Button>
      </form>
    </DialogShell>
  );
};

export default AddClassUserDialog;