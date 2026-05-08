"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import PageHeader from "@/src/shared/ui/PageHeader";
import Loader from "@/src/shared/ui/Loader";
import { useAllBudgets } from "../hooks/budget.hooks";
import AddBudgetDialog from "./AddBudgetDialog";
import EditBudgetDialog from "./EditBudgetDialog";
import DeleteBudgetDialog from "./DeleteBudgetDialog";
import { IBudgetAdd } from "../types/types";
import { Pencil, Trash2 } from "lucide-react";

const BudgetPage: React.FC = () => {
  const t = useTranslations("pages.budget");
  const { data: budgets, isLoading } = useAllBudgets();

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<IBudgetAdd | null>(null);

  // Filter
  const filteredBudgets = useMemo(() => {
    if (!budgets) return [];
    if (!search.trim()) return budgets;
    const term = search.trim().toLowerCase();
    return budgets.filter(
      (b) =>
        b.volunteerName.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term),
    );
  }, [budgets, search]);

  // Total
  const totalMoney = useMemo(() => {
    return filteredBudgets.reduce((sum, b) => sum + b.moneyAdd, 0);
  }, [filteredBudgets]);

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
            <div className="p-3 rounded-xl bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("totalIncome")}</p>
              <p className="text-2xl font-bold text-green-600">
                {totalMoney.toLocaleString()} {t("currency")}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredBudgets.length} {t("entries")}
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
                <TableHead>{t("table.admin")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
                <TableHead className="text-center">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {search ? t("noResults") : t("empty")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBudgets.map((budget) => (
                  <TableRow key={budget.budgetAddId}>
                    <TableCell className="ps-4 font-medium">{budget.volunteerName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {budget.description}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 border-0">
                        {budget.moneyAdd.toLocaleString()} {t("currency")}
                      </Badge>
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
      <AddBudgetDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditBudgetDialog open={editOpen} onOpenChange={setEditOpen} budget={selectedBudget} />
      <DeleteBudgetDialog open={deleteOpen} onOpenChange={setDeleteOpen} budget={selectedBudget} />
    </div>
  );
};

export default BudgetPage;