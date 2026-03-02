import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Protected Routes */}
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
                <div>Orders Page (in progress)</div>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <div>Admin Dashboard (in progress)</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
