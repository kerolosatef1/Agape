"use client";

import { ReactNode } from "react";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface DialogShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  icon: ReactNode;
  iconBgColor?: string;
  maxWidth?: string;
  children: ReactNode;
}

export function DialogShell({
  open, onOpenChange, title, icon,
  iconBgColor = "bg-[#1a1a6e]",
  maxWidth = "sm:max-w-lg",
  children,
}: DialogShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidth} max-h-[85vh] sm:max-h-[90vh] overflow-y-auto`}>
        <DialogClose className="absolute end-4 top-4 rounded-sm opacity-70 hover:opacity-100 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </DialogClose>
        <DialogHeader>
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <div className={`w-8 h-8 shrink-0 ${iconBgColor} rounded-lg flex items-center justify-center`}>
              {icon}
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
          </div>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}