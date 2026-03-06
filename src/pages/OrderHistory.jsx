// OrderHistory.jsx
// User's personal order history page
// Displays all orders with expandable details and cancel functionality for pending orders
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders, cancelOrder } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const { user } = useAuth();

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Get user's order history from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getOrders();
      // Sort orders by date (newest first)
      const sortedOrders = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setOrders(sortedOrders);
      setError(null);
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle order cancellation with confirmation
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    setCancellingId(orderId);
    try {
      await cancelOrder(orderId);

      // Update the local state to reflect cancelled status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order,
        ),
      );

      alert("Order cancelled successfully!");
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert(
        err.response?.data?.error ||
          "Failed to cancel order. Please try again.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Toggle expanded view for order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet</p>
          <Link to="/" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              {/* Order header - click to expand */}
              <div
                className="order-header"
                onClick={() => toggleOrderDetails(order._id)}
              >
                <div className="order-info">
                  <span className="order-date">
                    Ordered: {formatDate(order.createdAt)}
                  </span>
                  <span
                    className={`order-status ${getStatusColor(order.status)}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                <div className="order-summary">
                  <span className="order-total">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                  <span className="order-items-count">
                    {order.items?.length || 0} items
                  </span>
                  <span className="expand-icon">
                    {expandedOrder === order._id ? "▼" : "▶"}
                  </span>
                </div>
              </div>

              {/* Expanded order details */}
              {expandedOrder === order._id && (
                <div className="order-details">
                  <div className="order-items">
                    {order.items.map((item) => (
                      <div key={item._id} className="order-item">
                        <div className="item-image">
                          <img src={item.imageUrl} alt={item.name} />
                        </div>
                        <div className="item-info">
                          <Link
                            to={`/product/${item.productId}`}
                            className="item-name"
                          >
                            {item.name}
                          </Link>
                          <div className="item-meta">
                            <span>Quantity: {item.quantity}</span>
                            <span>Price: ${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="item-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-address">
                      <strong>Shipping Address:</strong>
                      <p>
                        {order.shippingAddress?.street}
                        <br />
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state}{" "}
                        {order.shippingAddress?.zipCode}
                        <br />
                        {order.shippingAddress?.country}
                      </p>
                    </div>
                    <div className="order-payment">
                      <strong>Payment Method:</strong>
                      <p>
                        {order.paymentMethod?.replace("_", " ").toUpperCase()}
                      </p>
                    </div>
                    <div className="order-total-large">
                      <strong>Total:</strong>
                      <span>${order.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Cancel button only for pending orders */}
                  {order.status === "pending" && (
                    <div className="order-actions">
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                        className="cancel-order-btn"
                      >
                        {cancellingId === order._id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
