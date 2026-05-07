"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import Spinner from "@/src/shared/ui/Spinner";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  isPending: boolean;
  variant?: "danger" | "success";
}

export function ConfirmDialog({
  open, onOpenChange, title, description,
  confirmLabel, cancelLabel, onConfirm, isPending,
  variant = "danger",
}: ConfirmDialogProps) {
  const colorClass = variant === "danger"
    ? "bg-red-600 hover:bg-red-700"
    : "bg-green-600 hover:bg-green-700";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto cursor-pointer">{cancelLabel}</Button>
          </DialogClose>
          <Button onClick={onConfirm} disabled={isPending} className={`w-full sm:w-auto text-white cursor-pointer ${colorClass}`}>
            {isPending ? <Spinner /> : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}