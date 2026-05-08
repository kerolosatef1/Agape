"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    if (start > 1) pages.push(1);
    if (start > 2) pages.push(-1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push(-2);
    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 pt-4">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-lg"
      >
        <ChevronLeft size={16} />
      </Button>

      {getPageNumbers().map((page, i) =>
        page < 0 ? (
          <span key={`e-${i}`} className="px-1 text-muted-foreground text-sm">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="w-9 rounded-lg"
            style={currentPage === page ? { backgroundColor: "#1a1a6e" } : {}}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-lg"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default Pagination;