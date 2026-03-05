import React from "react";

const NoResults = ({ onClearFilters }) => {
  return (
    <div className="no-results">
      <p>No products found matching your criteria</p>
      <button onClick={onClearFilters} className="clear-filters-btn">
        Clear Filters
      </button>
    </div>
  );
};

export default NoResults;
