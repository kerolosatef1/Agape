"use client";

import React, { useState, useMemo, useActionState, useEffect, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Plus, TrendingDown, Pencil, Trash2, Send, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import PageTitle from "@/src/shared/ui/PageTitle";
import SearchInput from "@/src/shared/ui/SearchInput";
import Pagination from "@/src/shared/ui/Pagination";
import ClassSelect from "@/src/shared/ui/ClassSelect";
import FormField from "@/src/shared/ui/FormField";
import DeleteConfirmDialog from "@/src/shared/ui/DeleteConfirmDialog";
import Loader from "@/src/shared/ui/Loader";
import Spinner from "@/src/shared/ui/Spinner";
import { useAllSpends } from "../hooks/spend.hooks";
import { useAllClasses } from "../../classes/hooks/classes.hooks";
import { addSpendFormAction, editSpendFormAction, deleteSpendAction, SpendActionState } from "../action/spend.action";
import { spendSchema, TSpendInput } from "../validation/spend.validation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ISpend } from "../types/types";

const PAGE_SIZE = 15;
const initialState: SpendActionState = { success: false, message: "" };

const SpendPage: React.FC = () => {
  const t = useTranslations("pages.spend");
  const queryClient = useQueryClient();
  const { data: spends, isLoading } = useAllSpends();
  const { data: classes } = useAllClasses();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<ISpend | null>(null);
  const [deleting, setDeleting] = useState<ISpend | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [state, formAction] = useActionState(editing ? editSpendFormAction : addSpendFormAction, initialState);
  const [isTransitioning, startTransition] = useTransition();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isValid } } = useForm<TSpendInput>({
    resolver: zodResolver(spendSchema), mode: "onChange",
    defaultValues: { sendTo: "", description: "", moneyAmount: undefined, classId: "" },
  });

  const handleOpenChange = (v: boolean) => { if (!v) { reset(); setEditing(null); } setDialogOpen(v); };
  const openAdd = () => { setEditing(null); reset(); setDialogOpen(true); };
  const openEdit = (item: ISpend) => { setEditing(item); reset({ sendTo: item.sendTo, description: item.description, moneyAmount: item.moneyAmount, classId: String(item.classId) }); setDialogOpen(true); };

  useEffect(() => {
    if (state.message) {
      if (state.success) { toast.success(state.message); queryClient.invalidateQueries({ queryKey: ["spend"] }); handleOpenChange(false); }
      else toast.error(state.message);
    }
  }, [state]);

  const onSubmit: SubmitHandler<TSpendInput> = (data) => {
    const fd = new FormData();
    if (editing) fd.append("spendId", String(editing.spendId));
    fd.append("sendTo", data.sendTo); fd.append("description", data.description);
    fd.append("moneyAmount", String(data.moneyAmount)); fd.append("classId", data.classId);
    startTransition(() => formAction(fd));
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      const result = await deleteSpendAction(deleting.spendId);
      if (result.success) { toast.success(result.message); queryClient.invalidateQueries({ queryKey: ["spend"] }); setDeleteOpen(false); }
      else toast.error(result.message);
    } finally { setIsDeleting(false); }
  };

  const getClassName = (classId: number) => classes?.find((c) => c.classId === classId)?.className || "—";
  const filtered = useMemo(() => {
    if (!spends) return [];
    if (!search.trim()) return spends;
    const term = search.toLowerCase();
    return spends.filter((s) => s.sendTo.toLowerCase().includes(term) || s.description.toLowerCase().includes(term));
  }, [spends, search]);

  const totalMoney = useMemo(() => filtered.reduce((s, r) => s + r.moneyAmount, 0), [filtered]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(() => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE), [filtered, currentPage]);
  useMemo(() => setCurrentPage(1), [search]);

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageTitle title={t("title")} description={t("desc")} count={filtered.length} countLabel={t("entries")}
        action={<Button onClick={openAdd} className="gap-2 rounded-xl h-11 px-5" style={{ backgroundColor: "#1a1a6e" }}><Plus size={16} /> {t("addBtn")}</Button>}
      />

      <Card className="border-0 shadow-sm py-4">
        <CardContent className="flex items-center gap-3 px-6">
          <div className="p-3 rounded-xl bg-red-50"><TrendingDown className="h-6 w-6 text-red-600" /></div>
          <div>
            <p className="text-sm text-muted-foreground">{t("totalSpent")}</p>
            <p className="text-2xl font-bold text-red-600">{totalMoney.toLocaleString()} {t("currency")}</p>
          </div>
        </CardContent>
      </Card>

      <SearchInput value={search} onChange={setSearch} placeholder={t("searchPlaceholder")} className="max-w-md" />

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="ps-6">{t("table.sendTo")}</TableHead>
                <TableHead>{t("table.description")}</TableHead>
                <TableHead>{t("table.amount")}</TableHead>
                <TableHead>{t("table.class")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
                <TableHead className="text-center">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{search ? t("noResults") : t("empty")}</TableCell></TableRow>
              ) : paginated.map((item) => (
                <TableRow key={item.spendId}>
                  <TableCell className="ps-6 font-medium">{item.sendTo}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{item.description}</TableCell>
                  <TableCell><Badge className="bg-red-100 text-red-700 border-0">{item.moneyAmount.toLocaleString()} {t("currency")}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{getClassName(item.classId)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.date ? new Date(item.date).toLocaleDateString() : "—"}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-1 justify-center">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(item)}><Pencil size={14} /></Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => { setDeleting(item); setDeleteOpen(true); }}><Trash2 size={14} /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">{editing ? t("edit.title") : t("add.title")}</DialogTitle>
          <div className="px-6 pt-6 pb-4">
            <p className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: "#c4943d" }}>— {editing ? t("edit.subtitle") : t("add.subtitle")} —</p>
            <h2 className="text-2xl font-bold mt-1" style={{ color: "#1a1a6e" }}>{editing ? t("edit.title") : t("add.title")}</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 flex flex-col gap-4">
            <FormField type="text" id="sendTo" label={t("form.sendTo")} placeholder={t("form.sendToPlaceholder")} labelIcon={<Send size={16} className="text-[#1a1a6e]" />} hasError={!!errors.sendTo} errorMessage={errors.sendTo?.message} {...register("sendTo")} />
            <FormField fieldType="textarea" id="description" label={t("form.description")} placeholder={t("form.descriptionPlaceholder")} labelIcon={<FileText size={16} className="text-[#1a1a6e]" />} hasError={!!errors.description} errorMessage={errors.description?.message} {...register("description")} />
            <FormField type="number" id="moneyAmount" label={t("form.moneyAmount")} placeholder={t("form.moneyAmountPlaceholder")} labelIcon={<DollarSign size={16} className="text-[#1a1a6e]" />} hasError={!!errors.moneyAmount} errorMessage={errors.moneyAmount?.message} {...register("moneyAmount", { valueAsNumber: true })} min="1" />
            <ClassSelect value={watch("classId")} onChange={(v) => setValue("classId", v, { shouldValidate: true })} error={errors.classId?.message} />
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} style={{ color: "#1a1a6e" }}>{t("form.cancel")}</Button>
              <Button type="submit" className="gap-2 rounded-xl px-6" style={{ backgroundColor: "#1a1a6e" }} disabled={!isValid || isTransitioning}>
                {isTransitioning ? <Spinner /> : editing ? t("form.save") : <><Plus size={16} /> {t("form.submit")}</>}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} itemName={deleting?.sendTo ?? ""} description={t("delete.desc", { name: deleting?.sendTo ?? "" })} onConfirm={handleDelete} isPending={isDeleting} />
    </div>
  );
};

export default SpendPage;