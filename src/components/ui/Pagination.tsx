// ============================================================
// src/components/ui/Pagination.tsx
// ============================================================
"use client";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page:        number;
  totalPages:  number;
  onPageChange:(p: number) => void;
  className?:  string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const btnBase = "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 font-[Tajawal]";

  return (
    <div className={cn("flex items-center gap-1 justify-center", className)} dir="rtl">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={cn(btnBase, "text-[#8A8480] hover:text-[#EDE8DF] hover:bg-[#1A1A1A] disabled:opacity-30")}
      >
        <ChevronRight size={16} />
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`d${idx}`} className="w-9 h-9 flex items-center justify-center text-[#484542]">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              btnBase,
              p === page
                ? "bg-[#C9A86E] text-[#060606]"
                : "text-[#8A8480] hover:text-[#EDE8DF] hover:bg-[#1A1A1A]"
            )}
          >
            {(p as number).toLocaleString("ar-EG")}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={cn(btnBase, "text-[#8A8480] hover:text-[#EDE8DF] hover:bg-[#1A1A1A] disabled:opacity-30")}
      >
        <ChevronLeft size={16} />
      </button>
    </div>
  );
}

export default Pagination;
