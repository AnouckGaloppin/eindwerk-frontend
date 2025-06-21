"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ensure all values are numbers
  const currentPageNum = Number(currentPage);
  const totalPagesNum = Number(totalPages);
  const totalItemsNum = Number(totalItems);
  const perPageNum = Number(perPage);

  const handlePageChange = (page: number) => {
    console.log('handlePageChange called with:', {
      page,
      currentPage: currentPageNum,
      totalPages: totalPagesNum,
      isValid: page >= 1 && page <= totalPagesNum && page !== currentPageNum
    });
    
    if (page < 1 || page > totalPagesNum || page === currentPageNum) {
      console.log('Page change blocked:', { page, currentPage: currentPageNum, totalPages: totalPagesNum });
      return;
    }

    // Smooth scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    if (onPageChange) {
      onPageChange(page);
    } else {
      // Update URL with new page parameter
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      const newUrl = `${pathname}?${params.toString()}`;
      console.log('Navigating to:', newUrl);
      router.push(newUrl);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPagesNum <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPagesNum; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPageNum - 2);
      let end = Math.min(totalPagesNum, currentPageNum + 2);
      
      // Adjust if we're near the beginning
      if (currentPageNum <= 3) {
        end = Math.min(totalPagesNum, 5);
      }
      
      // Adjust if we're near the end
      if (currentPageNum >= totalPagesNum - 2) {
        start = Math.max(1, totalPagesNum - 4);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPagesNum <= 1) {
    return null;
  }

  const pageNumbers = generatePageNumbers();
  const startItem = (currentPageNum - 1) * perPageNum + 1;
  const endItem = Math.min(currentPageNum * perPageNum, totalItemsNum);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
      {/* Results info */}
      <div className="text-sm text-gray-700">
        {startItem} tot {endItem} van {totalItemsNum} resultaten weergegeven.
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPageNum - 1)}
          disabled={currentPageNum === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          aria-label="Ga naar vorige pagina"
        >
          <ChevronLeft className="w-4 h-4" />
          Vorige
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {/* Show first page and ellipsis if needed */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="px-2 text-gray-500">...</span>
              )}
            </>
          )}

          {/* Show page numbers */}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                page === currentPageNum
                  ? "bg-teal-600 text-white border border-teal-600"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              }`}
              aria-label={`Ga naar pagina ${page}`}
              aria-current={page === currentPageNum ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          {/* Show last page and ellipsis if needed */}
          {pageNumbers[pageNumbers.length - 1] < totalPagesNum && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPagesNum - 1 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPagesNum)}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                {totalPagesNum}
              </button>
            </>
          )}
        </div>

        {/* Next button */}
        <button
          onClick={() => {
            console.log('Next button clicked:', {
              currentPage: currentPageNum,
              totalPages: totalPagesNum,
              nextPage: currentPageNum + 1,
              isDisabled: currentPageNum === totalPagesNum
            });
            handlePageChange(currentPageNum + 1);
          }}
          disabled={currentPageNum === totalPagesNum}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          aria-label="Ga naar volgende pagina"
        >
          Volgende
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 