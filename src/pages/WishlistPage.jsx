import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist, addToCart } from "../services/api";
import "./WishlistPage.css";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await getWishlist();
      setWishlist(data);
    } catch (err) {
      setError("Failed to load wishlist");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    setUpdating(true);
    try {
      await removeFromWishlist(productId);
      await fetchWishlist(); // Refresh wishlist
    } catch (err) {
      console.error("Failed to remove item", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddToCart = async (productId) => {
    setUpdating(true);
    try {
      await addToCart(productId, 1);
      alert("Item added to cart!");
    } catch (err) {
      console.error("Failed to add to cart", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">Loading wishlist...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>

      {!wishlist?.items || wishlist.items.length === 0 ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty</p>
          <Link to="/" className="continue-shopping-btn">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="wishlist-count">
            {wishlist.items.length}{" "}
            {wishlist.items.length === 1 ? "item" : "items"} in your wishlist
          </div>

          <div className="wishlist-grid">
            {wishlist.items.map((item) => (
              <div key={item._id} className="wishlist-item">
                <button
                  onClick={() =>
                    handleRemove(item.productId._id || item.productId)
                  }
                  className="remove-btn"
                  disabled={updating}
                  title="Remove from wishlist"
                >
                  ×
                </button>

                <div
                  className="item-image"
                  onClick={() =>
                    navigate(`/product/${item.productId._id || item.productId}`)
                  }
                >
                  <img src={item.imageUrl} alt={item.name} />
                </div>

                <h3>{item.name}</h3>
                <p className="item-price">${item.price.toFixed(2)}</p>
                <p className="item-category">{item.category}</p>

                <button
                  onClick={() =>
                    handleAddToCart(item.productId._id || item.productId)
                  }
                  disabled={updating}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;
