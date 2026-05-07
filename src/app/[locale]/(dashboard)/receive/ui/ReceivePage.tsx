"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus, TrendingUp, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import PageTitle from "@/src/shared/ui/PageTitle";
import SearchInput from "@/src/shared/ui/SearchInput";
import Pagination from "@/src/shared/ui/Pagination";
import Loader from "@/src/shared/ui/Loader";
import { useAllReceives } from "../hooks/receive.hooks";
import { useAllClasses } from "../../classes/hooks/classes.hooks";
import AddReceiveDialog from "./AddReceiveDialog";
import EditReceiveDialog from "./EditReceiveDialog";
import DeleteReceiveDialog from "./DeleteReceiveDialog";
import { IReceive } from "../types/types";

const PAGE_SIZE = 15;

const ReceivePage: React.FC = () => {
  const t = useTranslations("pages.receive");
  const { data: receives, isLoading } = useAllReceives();
  const { data: classes } = useAllClasses();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<IReceive | null>(null);

  const getClassName = (classId: number) =>
    classes?.find((c) => c.classId === classId)?.className || "—";

  const filtered = useMemo(() => {
    if (!receives) return [];
    if (!search.trim()) return receives;
    const term = search.trim().toLowerCase();
    return receives.filter(
      (r) => r.recieveFrom.toLowerCase().includes(term) || r.description.toLowerCase().includes(term),
    );
  }, [receives, search]);

  const totalMoney = useMemo(() => filtered.reduce((sum, r) => sum + r.moneyAmount, 0), [filtered]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  useMemo(() => setCurrentPage(1), [search]);

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageTitle
        title={t("title")}
        description={t("desc")}
        count={filtered.length}
        countLabel={t("entries")}
        action={
          <Button onClick={() => setAddOpen(true)} className="gap-2 rounded-xl h-11 px-5" style={{ backgroundColor: "#1a1a6e" }}>
            <Plus size={16} /> {t("addBtn")}
          </Button>
        }
      />

      {/* Total */}
      <Card className="border-0 shadow-sm py-4">
        <CardContent className="flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-50">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("totalReceived")}</p>
              <p className="text-2xl font-bold text-green-600">{totalMoney.toLocaleString()} {t("currency")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <SearchInput value={search} onChange={setSearch} placeholder={t("searchPlaceholder")} className="max-w-md" />

      {/* Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="ps-6 text-xs font-bold tracking-widest uppercase text-muted-foreground">{t("table.recieveFrom")}</TableHead>
                <TableHead className="text-xs font-bold tracking-widest uppercase text-muted-foreground">{t("table.description")}</TableHead>
                <TableHead className="text-xs font-bold tracking-widest uppercase text-muted-foreground">{t("table.amount")}</TableHead>
                <TableHead className="text-xs font-bold tracking-widest uppercase text-muted-foreground">{t("table.class")}</TableHead>
                <TableHead className="text-xs font-bold tracking-widest uppercase text-muted-foreground">{t("table.date")}</TableHead>
                <TableHead className="text-center text-xs font-bold tracking-widest uppercase text-muted-foreground">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {search ? t("noResults") : t("empty")}
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((item) => (
                  <TableRow key={item.recieveId}>
                    <TableCell className="ps-6 font-medium">{item.recieveFrom}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{item.description}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 border-0">{item.moneyAmount.toLocaleString()} {t("currency")}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{getClassName(item.classId)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.date ? new Date(item.date).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1 justify-center">
                        <Button variant="ghost" size="icon-sm" onClick={() => { setSelected(item); setEditOpen(true); }}>
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => { setSelected(item); setDeleteOpen(true); }}>
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

      <AddReceiveDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditReceiveDialog open={editOpen} onOpenChange={setEditOpen} receive={selected} />
      <DeleteReceiveDialog open={deleteOpen} onOpenChange={setDeleteOpen} receive={selected} />
    </div>
  );
};

export default ReceivePage;