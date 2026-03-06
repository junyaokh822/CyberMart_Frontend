// OrderManagement/OrderTableRow.jsx
// Individual order row with expandable details
// Shows customer info, order summary, and status update dropdown
import React from "react";
import OrderItemsDetail from "./OrderItemsDetail";

const OrderTableRow = ({
  order,
  isExpanded,
  onToggle,
  onStatusChange,
  updating,
}) => {
  // Get CSS class based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "shipped":
        return "status-shipped";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <tr className={`order-main-row ${isExpanded ? "expanded" : ""}`}>
        <td>
          <button className="expand-btn" onClick={() => onToggle(order._id)}>
            {isExpanded ? "▼" : "▶"}
          </button>
        </td>
        <td className="order-id">{order._id.slice(-8)}</td>
        <td>
          <div className="customer-info">
            <div>
              {order.userId?.firstName} {order.userId?.lastName}
            </div>
            <div className="customer-email">{order.userId?.email}</div>
          </div>
        </td>
        <td>{formatDate(order.createdAt)}</td>
        <td className="items-count">{order.items?.length || 0}</td>
        <td className="order-total">${order.totalAmount?.toFixed(2)}</td>
        <td>
          <span className={`status-badge ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </td>
        <td className="payment-method">
          {order.paymentMethod?.replace("_", " ").toUpperCase()}
        </td>
        <td>
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            disabled={updating}
            className="status-select"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </td>
      </tr>

      {isExpanded && (
        <tr className="order-items-row">
          <td colSpan="9">
            <OrderItemsDetail
              items={order.items}
              shippingAddress={order.shippingAddress}
            />
          </td>
        </tr>
      )}
    </>
  );
};

export default OrderTableRow;
