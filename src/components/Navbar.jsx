// Navbar.jsx
// Top navigation bar shown on all pages
// Shows different links based on auth state (guest vs user vs admin)
// Collapses into hamburger menu on small screens
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={handleLinkClick}>
          CyberMart
        </Link>

        <div className="nav-spacer"></div>

        {/* Hamburger button - only visible on small screens */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link" onClick={handleLinkClick}>
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="nav-link"
                onClick={handleLinkClick}
              >
                Profile
              </Link>
              <Link
                to="/wishlist"
                className="nav-link"
                onClick={handleLinkClick}
              >
                Wishlist
              </Link>
              <Link to="/cart" className="nav-link" onClick={handleLinkClick}>
                Cart
              </Link>
              <Link to="/orders" className="nav-link" onClick={handleLinkClick}>
                Orders
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="nav-link admin-link"
                  onClick={handleLinkClick}
                >
                  Admin
                </Link>
              )}
              <span className="nav-user">Hi, {user?.firstName}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={handleLinkClick}>
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link"
                onClick={handleLinkClick}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
