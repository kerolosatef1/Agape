"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus, Search, TrendingDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import PageHeader from "@/src/shared/ui/PageHeader";
import Loader from "@/src/shared/ui/Loader";
import { useAllWithdraws } from "../hooks/budget-withdraw.hooks";
import { useAllClasses } from "../../classes/hooks/classes.hooks";
import AddWithdrawDialog from "./AddWithdrawDialog";
import EditWithdrawDialog from "./EditWithdrawDialog";
import DeleteWithdrawDialog from "./DeleteWithdrawDialog";
import { IBudgetWithdraw } from "../types/types";

const BudgetWithdrawPage: React.FC = () => {
  const t = useTranslations("pages.budgetWithdraw");
  const { data: withdraws, isLoading } = useAllWithdraws();
  const { data: classes } = useAllClasses();

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<IBudgetWithdraw | null>(null);

  // Filter
  const filteredWithdraws = useMemo(() => {
    if (!withdraws) return [];
    if (!search.trim()) return withdraws;
    const term = search.trim().toLowerCase();
    return withdraws.filter(
      (b) =>
        b.volunteerName.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term),
    );
  }, [withdraws, search]);

  // Total
  const totalWithdraw = useMemo(() => {
    return filteredWithdraws.reduce((sum, b) => sum + b.withdraw, 0);
  }, [filteredWithdraws]);

  // Get class name
  const getClassName = (classId: number) => {
    return classes?.find((c) => c.classId === classId)?.className || "—";
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <PageHeader title={t("title")} description={t("desc")} />
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus size={16} />
          {t("addBtn")}
        </Button>
      </div>

      {/* Total Card */}
      <Card className="py-4">
        <CardContent className="flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("totalExpenses")}</p>
              <p className="text-2xl font-bold text-red-600">
                {totalWithdraw.toLocaleString()} {t("currency")}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredWithdraws.length} {t("entries")}
          </Badge>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/60 focus:border-transparent focus-within:outline-black"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-4 px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="ps-4">{t("table.volunteerName")}</TableHead>
                <TableHead>{t("table.description")}</TableHead>
                <TableHead>{t("table.amount")}</TableHead>
                <TableHead>{t("table.class")}</TableHead>
                <TableHead>{t("table.admin")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
                <TableHead className="text-center">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWithdraws.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {search ? t("noResults") : t("empty")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredWithdraws.map((budget) => (
                  <TableRow key={budget.budgetWithdrawId}>
                    <TableCell className="ps-4 font-medium">{budget.volunteerName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {budget.description}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-700 border-0">
                        {budget.withdraw.toLocaleString()} {t("currency")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {getClassName(budget.classId)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {budget.adminName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {budget.date ? new Date(budget.date).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setSelectedBudget(budget);
                            setEditOpen(true);
                          }}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive"
                          onClick={() => {
                            setSelectedBudget(budget);
                            setDeleteOpen(true);
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddWithdrawDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditWithdrawDialog open={editOpen} onOpenChange={setEditOpen} budget={selectedBudget} />
      <DeleteWithdrawDialog open={deleteOpen} onOpenChange={setDeleteOpen} budget={selectedBudget} />
    </div>
  );
};

export default BudgetWithdrawPage;