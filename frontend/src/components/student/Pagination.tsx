import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const pages = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  // Calculate visible page numbers
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (currentPage <= 2) {
    endPage = Math.min(3, totalPages);
  }
  if (currentPage >= totalPages - 1) {
    startPage = Math.max(1, totalPages - 2);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {/* First page */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        title="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>

      {/* Previous page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        title="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1 mx-2">
        {showEllipsisStart && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={cn(
                "w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                currentPage === 1
                  ? "bg-primary-600 text-white"
                  : "text-surface-600 hover:bg-surface-100"
              )}
            >
              1
            </button>
            <span className="px-1 text-surface-400">...</span>
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer",
              currentPage === page
                ? "bg-primary-600 text-white shadow-sm"
                : "text-surface-600 hover:bg-surface-100"
            )}
          >
            {page}
          </button>
        ))}

        {showEllipsisEnd && (
          <>
            <span className="px-1 text-surface-400">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className={cn(
                "w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                currentPage === totalPages
                  ? "bg-primary-600 text-white"
                  : "text-surface-600 hover:bg-surface-100"
              )}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        title="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Last page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        title="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
}
