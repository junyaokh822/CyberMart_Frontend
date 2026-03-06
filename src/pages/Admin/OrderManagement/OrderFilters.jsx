// OrderManagement/OrderFilters.jsx
// Filter dropdown for admin order management
// Allows filtering orders by status
import React from "react";

const OrderFilters = ({ filter, onFilterChange }) => {
  return (
    <div className="filter-controls">
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="filter-select"
      >
        <option value="all">All Orders</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );
};

export default OrderFilters;
