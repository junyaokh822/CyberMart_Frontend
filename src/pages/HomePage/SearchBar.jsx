// Home/SearchBar.jsx
// Search input component with clear button
// Filters products by name
import React from "react";

const SearchBar = ({ searchTerm, onSearchChange, onClear }) => {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      {searchTerm && (
        <button className="clear-search" onClick={onClear}>
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;
