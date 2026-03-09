// Home/Pagination.jsx
// Pagination component with page navigation and direct page input
// Allows users to click through pages or jump to a specific page number
import React, { useState } from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [pageInput, setPageInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  // Handle direct page input submission
  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(pageInput);

    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
      setPageInput("");
      setShowInput(false);
    } else {
      alert(`Please enter a valid page number between 1 and ${totalPages}`);
    }
  };

  // Handle previous page navigation
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Handle next page navigation
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination">
      {/* Previous button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="page-nav"
      >
        ← Previous
      </button>

      {/* Page number buttons */}
      <div className="page-numbers">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            className={`page-btn ${currentPage === page ? "active" : ""} ${page === "..." ? "dots" : ""}`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="page-nav"
      >
        Next →
      </button>

      {/* Jump to page input */}
      <div className="page-jump">
        {!showInput ? (
          <button onClick={() => setShowInput(true)} className="jump-btn">
            Jump to page
          </button>
        ) : (
          <form onSubmit={handlePageInputSubmit} className="jump-form">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder="Page #"
              autoFocus
              className="jump-input"
            />
            <button type="submit" className="jump-submit">
              Go
            </button>
            <button
              type="button"
              onClick={() => setShowInput(false)}
              className="jump-cancel"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* Page info */}
      <span className="page-info">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
