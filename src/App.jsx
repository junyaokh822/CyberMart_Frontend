import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<h1>Login Page</h1>} />
          <Route path="/register" element={<h1>Register Page</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
