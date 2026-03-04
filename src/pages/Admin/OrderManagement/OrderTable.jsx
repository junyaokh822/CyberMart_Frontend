import React from "react";
import OrderTableRow from "./OrderTableRow";

const OrderTable = ({
  orders,
  expandedOrder,
  onToggleOrder,
  onStatusChange,
  updating,
}) => {
  if (orders.length === 0) {
    return (
      <div className="no-orders">
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="orders-table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th></th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderTableRow
              key={order._id}
              order={order}
              isExpanded={expandedOrder === order._id}
              onToggle={onToggleOrder}
              onStatusChange={onStatusChange}
              updating={updating}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
