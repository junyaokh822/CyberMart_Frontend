// OrderManagement/index.jsx
// Admin order management dashboard
// Fetches all orders with filtering by status
// Allows updating order status and expanding to view details
import React, { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../../../services/api";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import "./OrderManagement.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Fetch all orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Get all orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await getAllOrders();
      const sortedOrders = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setOrders(sortedOrders);
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      alert("Failed to update order status");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // Toggle expanded order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Filter orders by status
  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-management">
      <div className="management-header">
        <h2>Order Management</h2>
        <OrderFilters filter={filter} onFilterChange={handleFilterChange} />
      </div>

      <OrderTable
        orders={filteredOrders}
        expandedOrder={expandedOrder}
        onToggleOrder={toggleOrderDetails}
        onStatusChange={handleStatusUpdate}
        updating={updating}
      />
    </div>
  );
};

export default OrderManagement;
