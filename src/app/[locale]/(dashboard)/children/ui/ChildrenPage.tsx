"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTitle from "@/src/shared/ui/PageTitle";
import SearchInput from "@/src/shared/ui/SearchInput";
import FilterTabs from "@/src/shared/ui/FilterTabs";
import { useAllChildren } from "../hooks/children.hooks";
import { useAllClasses } from "../../classes/hooks/classes.hooks";
import ChildCard from "./ChildCard";
import AddChildDialog from "./AddChildDialog";
import EditChildDialog from "./EditChildDialog";
import DeleteChildDialog from "./DeleteChildDialog";
import Loader from "@/src/shared/ui/Loader";
import { IChild, CHILD_MANAGEMENT_ROLES } from "../types/types";

const PAGE_SIZE = 30;

const ChildrenPage: React.FC = () => {
  const t = useTranslations("pages.children");
  const { data: session } = useSession();

  const roles: string[] = (session?.user as any)?.roles || [];
  const canManage = roles.some((r) => CHILD_MANAGEMENT_ROLES.includes(r));

  const { data: children, isLoading } = useAllChildren();
  const { data: classes } = useAllClasses();

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<IChild | null>(null);

  const filterTabs = [
    { key: "all", label: t("filterAll") },
    { key: "boys", label: t("filterBoys") },
    { key: "girls", label: t("filterGirls") },
    { key: "needy", label: t("filterNeedy") },
  ];

  // Filter
  const filteredChildren = useMemo(() => {
    if (!children) return [];
    let result = children;

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((c) => c.chiledName.toLowerCase().includes(term));
    }

    if (genderFilter === "boys") result = result.filter((c) => c.gender === true);
    else if (genderFilter === "girls") result = result.filter((c) => c.gender === false);
    else if (genderFilter === "needy") result = result.filter((c) => c.typeNeedy === true);

    return result;
  }, [children, search, genderFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredChildren.length / PAGE_SIZE);
  const showPagination = filteredChildren.length > PAGE_SIZE;

  const paginatedChildren = useMemo(() => {
    if (!showPagination) return filteredChildren;
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredChildren.slice(start, start + PAGE_SIZE);
  }, [filteredChildren, currentPage, showPagination]);

  // Reset page on filter change
  useMemo(() => setCurrentPage(1), [search, genderFilter]);

  // Generate page numbers (show max 5 around current)
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    if (start > 1) pages.push(1);
    if (start > 2) pages.push(-1); // ellipsis

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push(-2); // ellipsis
    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageTitle
        count={filteredChildren.length}
        countLabel={t("countLabel")}
        title={t("title")}
        description={t("desc")}
        action={
          canManage ? (
            <Button
              onClick={() => setAddOpen(true)}
              className="gap-2 rounded-xl h-11 px-5"
              style={{ backgroundColor: "#1a1a6e" }}
            >
              <Plus size={16} />
              {t("addBtn")}
            </Button>
          ) : undefined
        }
      />

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("searchPlaceholder")}
          className="flex-1 min-w-[200px] max-w-lg"
        />
        <FilterTabs
          tabs={filterTabs}
          activeTab={genderFilter}
          onTabChange={setGenderFilter}
        />
      </div>

      {/* Children Grid */}
      {paginatedChildren.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          {search || genderFilter !== "all" ? t("noResults") : t("empty")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedChildren.map((child) => (
            <ChildCard
              key={child.chiledId}
              child={child}
              classes={classes || []}
              userRoles={roles}
              onEdit={(c) => {
                setSelectedChild(c);
                setEditOpen(true);
              }}
              onDelete={(c) => {
                setSelectedChild(c);
                setDeleteOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg"
          >
            {t("prev")}
          </Button>

          <div className="flex gap-1">
            {getPageNumbers().map((page, i) =>
              page < 0 ? (
                <span key={`ellipsis-${i}`} className="px-2 py-1 text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-9 rounded-lg"
                  style={currentPage === page ? { backgroundColor: "#1a1a6e" } : {}}
                >
                  {page}
                </Button>
              ),
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg"
          >
            {t("next")}
          </Button>
        </div>
      )}

      {/* Dialogs */}
      {canManage && (
        <>
          <AddChildDialog open={addOpen} onOpenChange={setAddOpen} />
          <EditChildDialog open={editOpen} onOpenChange={setEditOpen} child={selectedChild} />
          <DeleteChildDialog open={deleteOpen} onOpenChange={setDeleteOpen} child={selectedChild} />
        </>
      )}
    </div>
  );
};

export default ChildrenPage;