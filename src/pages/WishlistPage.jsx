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

  const handleRemove = async (id) => {
    setUpdating(true);
    try {
      await removeFromWishlist(id);
      await fetchWishlist();
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

  const availableItems =
    wishlist?.items?.filter(
      (item) =>
        item.productId?._id ||
        (item.productId && typeof item.productId === "string"),
    ) ?? [];
  const unavailableItems =
    wishlist?.items?.filter(
      (item) =>
        !item.productId?._id &&
        !(item.productId && typeof item.productId === "string"),
    ) ?? [];

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

          {/* Unavailable items notice */}
          {unavailableItems.length > 0 && (
            <div className="unavailable-notice">
              <span className="notice-icon">⚠️</span>
              <span>
                {unavailableItems.length}{" "}
                {unavailableItems.length === 1 ? "item" : "items"} in your
                wishlist {unavailableItems.length === 1 ? "is" : "are"} no
                longer available. You can remove{" "}
                {unavailableItems.length === 1 ? "it" : "them"} from your
                wishlist.
              </span>
            </div>
          )}

          <div className="wishlist-grid">
            {wishlist.items.map((item) => {
              const productId =
                item.productId?._id ||
                (typeof item.productId === "string" ? item.productId : null);
              const removeId = productId || item._id;
              const isUnavailable = !productId;

              return (
                <div
                  key={item._id}
                  className={`wishlist-item ${isUnavailable ? "unavailable" : ""}`}
                >
                  {/* Unavailable overlay banner */}
                  {isUnavailable && (
                    <div className="unavailable-banner">
                      <span>⚠ No Longer Available</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleRemove(removeId)}
                    className="remove-btn"
                    disabled={updating}
                    title="Remove from wishlist"
                  >
                    ×
                  </button>

                  <div
                    className="item-image"
                    onClick={() =>
                      !isUnavailable && navigate(`/product/${productId}`)
                    }
                    style={{ cursor: isUnavailable ? "default" : "pointer" }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{ opacity: isUnavailable ? 0.4 : 1 }}
                    />
                  </div>

                  <h3 style={{ opacity: isUnavailable ? 0.5 : 1 }}>
                    {item.name}
                  </h3>
                  <p
                    className="item-price"
                    style={{ opacity: isUnavailable ? 0.5 : 1 }}
                  >
                    ${item.price.toFixed(2)}
                  </p>
                  <p
                    className="item-category"
                    style={{ opacity: isUnavailable ? 0.5 : 1 }}
                  >
                    {item.category}
                  </p>

                  {isUnavailable ? (
                    <button
                      onClick={() => handleRemove(removeId)}
                      disabled={updating}
                      className="remove-from-wishlist-btn"
                    >
                      Remove from Wishlist
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(productId)}
                      disabled={updating}
                      className="add-to-cart-btn"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;
