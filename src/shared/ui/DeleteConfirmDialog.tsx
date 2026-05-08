"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import Spinner from "./Spinner";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  description: string;
  onConfirm: () => Promise<void>;
  isPending: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onOpenChange,
  itemName,
  description,
  onConfirm,
  isPending,
}) => {
  const t = useTranslations("common.deleteDialog");
  const [confirmText, setConfirmText] = useState("");

  const canDelete = confirmText.toLowerCase() === "delete";

  const handleOpenChange = (v: boolean) => {
    if (!v) setConfirmText("");
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogTitle className="sr-only">{t("title")}</DialogTitle>

        <div className="px-6 pt-6 pb-4">
          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(139, 26, 58, 0.1)" }}
            >
              <X size={18} style={{ color: "#8b1a3a" }} />
            </div>
            <div>
              <p className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: "#8b1a3a" }}>
                — {t("permanent")} —
              </p>
              <h2 className="text-xl font-bold" style={{ color: "#1a1a6e" }}>
                {t("title")}
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* Type "delete" */}
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              {t("type")}{" "}
              <span
                className="font-bold px-1.5 py-0.5 rounded text-xs"
                style={{ backgroundColor: "rgba(139, 26, 58, 0.1)", color: "#8b1a3a" }}
              >
                delete
              </span>{" "}
              {t("toConfirm")}
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="delete"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8b1a3a]/20 focus:border-[#8b1a3a]/40 focus-within:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 pb-6 pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            className="font-medium"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!canDelete || isPending}
            className="rounded-xl px-6"
            style={{
              backgroundColor: canDelete ? "#8b1a3a" : "#e5e7eb",
              color: canDelete ? "white" : "#9ca3af",
            }}
          >
            {isPending ? <Spinner /> : t("confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;