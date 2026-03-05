import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} from "../../services/api";

const ProductCard = ({ product, onClick }) => {
  const { isAuthenticated } = useAuth();
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, product._id]);

  const checkWishlistStatus = async () => {
    try {
      const { data } = await checkWishlist(product._id);
      setInWishlist(data.inWishlist);
    } catch (err) {
      console.error("Failed to check wishlist", err);
    }
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      // redirect to login or show a message
      alert("Please login to add items to wishlist");
      return;
    }

    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
        setInWishlist(false);
      } else {
        await addToWishlist(product._id);
        setInWishlist(true);
      }
    } catch (err) {
      console.error("Failed to update wishlist", err);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="product-card" onClick={() => onClick(product._id)}>
      <button
        className={`wishlist-btn ${inWishlist ? "active" : ""}`}
        onClick={handleWishlistClick}
        disabled={wishlistLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={inWishlist ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <Link
        to={`/product/${product._id}`}
        className="view-btn"
        onClick={(e) => e.stopPropagation()}
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
