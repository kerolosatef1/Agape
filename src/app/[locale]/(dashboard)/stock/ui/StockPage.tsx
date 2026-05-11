"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus, Pencil, Trash2, Package, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageTitle from "@/src/shared/ui/PageTitle";
import SearchInput from "@/src/shared/ui/SearchInput";
import Pagination from "@/src/shared/ui/Pagination";
import DeleteConfirmDialog from "@/src/shared/ui/DeleteConfirmDialog";
import AmountPromptDialog from "@/src/shared/ui/AmountPromptDialog";
import Loader from "@/src/shared/ui/Loader";
import Spinner from "@/src/shared/ui/Spinner";
import AddStockDialog from "./AddStockDialog";
import EditStockDialog from "./EditStockDialog";
import { useAllStocks } from "../hooks/stock.hooks";
import { deleteStockAction, increaseStockAction, decreaseStockAction } from "../action/stock.action";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { IStock } from "../types/types";

const PAGE_SIZE = 15;

const StockPage: React.FC = () => {
  const t = useTranslations("pages.stock");
  const queryClient = useQueryClient();
  const { data: stocks, isLoading } = useAllStocks();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<IStock | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Adjust amount dialog
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustType, setAdjustType] = useState<"increase" | "decrease">("increase");
  const [adjustingItem, setAdjustingItem] = useState<IStock | null>(null);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const filtered = useMemo(() => {
    if (!stocks) return [];
    if (!search.trim()) return stocks;
    return stocks.filter((s) => s.itemName.toLowerCase().includes(search.toLowerCase()));
  }, [stocks, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );
  useMemo(() => setCurrentPage(1), [search]);

  const handleDelete = async () => {
    if (!selected) return;
    setIsDeleting(true);
    try {
      const result = await deleteStockAction(selected.stockId);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["stock"] });
        setDeleteOpen(false);
      } else toast.error(result.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Open adjust dialog
  const openAdjust = (item: IStock, type: "increase" | "decrease") => {
    setAdjustingItem(item);
    setAdjustType(type);
    setAdjustOpen(true);
  };

  // Submit adjust
  const handleAdjustConfirm = async (amount: number) => {
    if (!adjustingItem) return;
    setIsAdjusting(true);
    try {
      const result =
        adjustType === "increase"
          ? await increaseStockAction(adjustingItem.stockId, amount)
          : await decreaseStockAction(adjustingItem.stockId, amount);
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["stock"] });
        setAdjustOpen(false);
      } else toast.error(result.message);
    } finally {
      setIsAdjusting(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageTitle
        title={t("title")}
        description={t("desc")}
        count={filtered.length}
        countLabel={t("items")}
        action={
          <Button
            onClick={() => setAddOpen(true)}
            className="gap-2 rounded-xl h-11 px-5"
            style={{ backgroundColor: "#1a1a6e" }}
          >
            <Plus size={16} /> {t("addBtn")}
          </Button>
        }
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={t("searchPlaceholder")}
        className="max-w-md"
      />

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="ps-6">{t("table.item")}</TableHead>
                <TableHead>{t("table.amount")}</TableHead>
                <TableHead>{t("table.price")}</TableHead>
                <TableHead className="text-center">{t("table.adjust")}</TableHead>
                <TableHead className="text-center">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {search ? t("noResults") : t("empty")}
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((item) => (
                  <TableRow key={item.stockId}>
                    <TableCell className="ps-6">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-muted-foreground" />
                        <span className="font-medium">{item.itemName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${
                          item.availableAmount <= 5
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        } border-0`}
                      >
                        {item.availableAmount}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.price.toLocaleString()} {t("currency")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="outline"
                          size="icon-xs"
                          className="text-green-600 hover:bg-green-50"
                          onClick={() => openAdjust(item, "increase")}
                        >
                          <ArrowUp size={12} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => openAdjust(item, "decrease")}
                        >
                          <ArrowDown size={12} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => {
                            setSelected(item);
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
                            setSelected(item);
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

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <AddStockDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditStockDialog open={editOpen} onOpenChange={setEditOpen} stock={selected} />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={selected?.itemName ?? ""}
        description={t("deleteDesc", { name: selected?.itemName ?? "" })}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />

      {/* Adjust Amount Dialog */}
      <AmountPromptDialog
        open={adjustOpen}
        onOpenChange={setAdjustOpen}
        type={adjustType}
        itemName={adjustingItem?.itemName}
        onConfirm={handleAdjustConfirm}
        isPending={isAdjusting}
      />
    </div>
  );
};

export default StockPage;