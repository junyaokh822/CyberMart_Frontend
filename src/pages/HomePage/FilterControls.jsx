import React from "react";

const FilterControls = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  showClear,
  onClearFilters,
}) => {
  return (
    <div className="filter-controls">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="filter-select"
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="filter-select"
      >
        <option value="default">Sort By</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
      </select>

      {showClear && (
        <button onClick={onClearFilters} className="clear-filters-btn">
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterControls;
