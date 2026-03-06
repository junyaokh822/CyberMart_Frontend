// AdminDashboard.jsx
// Admin panel with tabbed interface for product and order management
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "products" && <ProductManagement />}
        {activeTab === "orders" && <OrderManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
