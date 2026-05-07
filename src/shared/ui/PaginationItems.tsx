"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface IProps {
  totalPages: number;
  currentPage: number;
  totalCount: number;
  onPageChange: (p: number) => void;
}

const PaginationItems: React.FC<IProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  //   handlers
  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault();
    onPageChange(page);
  };

  if (totalPages <= 1) return;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrev}
            className={
              currentPage === 1
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
        {getPages().map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={currentPage === p}
              onClick={(e) => handlePageClick(e, p)}
              className="cursor-pointer"
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNext}
            className={
              currentPage === totalPages
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationItems;
