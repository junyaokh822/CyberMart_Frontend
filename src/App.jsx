// App.jsx
// Main application component with routing configuration
// Sets up public, protected, and admin routes with appropriate guards
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import OrderHistory from "./pages/OrderHistory";
import ProfilePage from "./pages/ProfilePage";
import WishlistPage from "./pages/WishlistPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import GoToTop from "./components/GoToTop";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* Global navigation bar */}
      <Navbar />

      {/* Go to top button - appears on all pages */}
      <GoToTop />

      {/* Main content area with routing */}
      <main className="main-content">
        <Routes>
          {/* Public routes - accessible to everyone */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Protected Routes - require authentication */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <WishlistPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrderHistory />
              </PrivateRoute>
            }
          />

          {/* Admin Routes - require authentication AND admin role */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
