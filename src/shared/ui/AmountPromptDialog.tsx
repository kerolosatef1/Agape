"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Spinner from "./Spinner";

interface AmountPromptDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: "increase" | "decrease";
  itemName?: string;
  onConfirm: (amount: number) => Promise<void>;
  isPending: boolean;
}

const AmountPromptDialog: React.FC<AmountPromptDialogProps> = ({
  open,
  onOpenChange,
  type,
  itemName,
  onConfirm,
  isPending,
}) => {
  const t = useTranslations("common.amountDialog");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!open) setAmount("");
  }, [open]);

  const isValid = amount && !isNaN(Number(amount)) && Number(amount) > 0;
  const isIncrease = type === "increase";

  const handleConfirm = async () => {
    if (!isValid) return;
    await onConfirm(Number(amount));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid) handleConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogTitle className="sr-only">
          {isIncrease ? t("increaseTitle") : t("decreaseTitle")}
        </DialogTitle>

        <div className="px-6 pt-6 pb-4">
          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: isIncrease
                  ? "rgba(34, 197, 94, 0.1)"
                  : "rgba(196, 148, 61, 0.15)",
              }}
            >
              {isIncrease ? (
                <ArrowUp size={18} className="text-green-600" />
              ) : (
                <ArrowDown size={18} style={{ color: "#c4943d" }} />
              )}
            </div>
            <div>
              <p
                className="text-xs font-medium tracking-[0.25em] uppercase"
                style={{ color: isIncrease ? "#16a34a" : "#c4943d" }}
              >
                — {isIncrease ? t("addStock") : t("removeStock")} —
              </p>
              <h2 className="text-xl font-bold" style={{ color: "#1a1a6e" }}>
                {itemName || (isIncrease ? t("increaseTitle") : t("decreaseTitle"))}
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3">
            {isIncrease ? t("increaseDesc") : t("decreaseDesc")}
          </p>

          {/* Input */}
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("placeholder")}
            autoFocus
            className="w-full px-4 py-3 text-lg font-semibold border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a1a6e]/20 focus:border-[#1a1a6e]/40 focus-within:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 pb-6 pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="font-medium"
            style={{ color: "#1a1a6e" }}
            disabled={isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid || isPending}
            className="rounded-xl px-6 gap-2"
            style={{
              backgroundColor: isValid ? (isIncrease ? "#16a34a" : "#c4943d") : "#e5e7eb",
              color: isValid ? "white" : "#9ca3af",
            }}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <>
                {isIncrease ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {isIncrease ? t("confirmAdd") : t("confirmRemove")}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AmountPromptDialog;