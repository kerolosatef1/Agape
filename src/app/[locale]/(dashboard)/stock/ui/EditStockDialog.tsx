"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FormField from "@/src/shared/ui/FormField";
import { Button } from "@/components/ui/button";
import { Package, Hash, DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { editStockAction } from "../action/stock.action";
import { stockSchema, TStockInput } from "../validation/stock.validation";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/src/shared/ui/Spinner";
import { IStock } from "../types/types";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; stock: IStock | null; }

const EditStockDialog: React.FC<Props> = ({ open, onOpenChange, stock }) => {
  const t = useTranslations("pages.stock");
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<TStockInput>({
    resolver: zodResolver(stockSchema), mode: "onChange",
  });

  useEffect(() => { if (open && stock) reset({ itemName: stock.itemName, availableAmount: stock.availableAmount, price: stock.price }); }, [open, stock, reset]);
  const handleOpenChange = (v: boolean) => { if (!v) reset(); onOpenChange(v); };

  const onSubmit: SubmitHandler<TStockInput> = async (data) => {
    if (!stock) return;
    setIsPending(true);
    try {
      const result = await editStockAction(stock.stockId, data);
      if (result.success) { toast.success(result.message); queryClient.invalidateQueries({ queryKey: ["stock"] }); handleOpenChange(false); }
      else toast.error(result.message);
    } finally { setIsPending(false); }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">{t("edit.title")}</DialogTitle>
        <div className="px-6 pt-6 pb-4">
          <p className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: "#c4943d" }}>— {stock?.itemName} —</p>
          <h2 className="text-2xl font-bold mt-1" style={{ color: "#1a1a6e" }}>{t("edit.title")}</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 flex flex-col gap-4">
          <FormField type="text" id="editItemName" label={t("fields.itemName")} placeholder={t("fields.itemNamePlaceholder")} labelIcon={<Package size={16} className="text-[#1a1a6e]" />} hasError={!!errors.itemName} errorMessage={errors.itemName?.message} {...register("itemName")} />
          <FormField type="number" id="editAmount" label={t("fields.amount")} placeholder="0" labelIcon={<Hash size={16} className="text-[#1a1a6e]" />} hasError={!!errors.availableAmount} errorMessage={errors.availableAmount?.message} {...register("availableAmount", { valueAsNumber: true })} min="0" />
          <FormField type="number" id="editPrice" label={t("fields.price")} placeholder="0" labelIcon={<DollarSign size={16} className="text-[#1a1a6e]" />} hasError={!!errors.price} errorMessage={errors.price?.message} {...register("price", { valueAsNumber: true })} min="1" />
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} style={{ color: "#1a1a6e" }}>{t("common.cancel")}</Button>
            <Button type="submit" className="rounded-xl px-6" style={{ backgroundColor: "#1a1a6e" }} disabled={!isValid || isPending}>
              {isPending ? <Spinner /> : t("edit.submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStockDialog;