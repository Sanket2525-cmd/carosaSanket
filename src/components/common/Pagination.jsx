"use client";
import React from "react";
import { Button } from "react-bootstrap";

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Always show pagination, even if there's only 1 page

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Calculate which page numbers to show (show up to 7 page numbers)
  const getPageNumbers = () => {
    const maxVisible = 7;
    const pages = [];
    
    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than maxVisible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 4) {
        // Show first pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show last pages
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="d-flex justify-content-center align-items-center mt-4 gap-2 flex-wrap">
      <Button
        variant="outline-secondary"
        disabled={currentPage === 1}
        onClick={handlePrev}
        style={{ minWidth: '80px' }}
      >
        Previous
      </Button>

      {pageNumbers.map((pageNum, index) => {
        if (pageNum === 'ellipsis') {
          return (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          );
        }
        
        return (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "primary" : "outline-primary"}
            onClick={() => onPageChange(pageNum)}
            style={{ minWidth: '40px' }}
          >
            {pageNum}
          </Button>
        );
      })}

      <Button
        variant="outline-secondary"
        disabled={currentPage === totalPages}
        onClick={handleNext}
        style={{ minWidth: '80px' }}
      >
        Next
      </Button>
      
      {/* Show page info */}
      <span className="ms-3 text-muted">
        Page {currentPage} of {totalPages} ({totalItems} items)
      </span>
    </div>
  );
};

export default Pagination;
