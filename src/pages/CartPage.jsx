import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./CartPage.css";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const { isAuthenticated } = useAuth();

  // Define fetchCart with useCallback so it can be used in multiple places
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getCart();
      setCart(data);
      setError(null);
    } catch (err) {
      setError("Failed to load cart");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cart when component mounts OR when page gains focus
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Add event listener for when page gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        fetchCart();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated, fetchCart]);

  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(true);
    try {
      await updateCartItem(itemId, newQuantity);

      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item,
        );
        return { ...prevCart, items: updatedItems };
      });
    } catch (err) {
      console.error("Failed to update quantity", err);
      fetchCart();
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdating(true);
    try {
      await removeCartItem(itemId);

      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter((item) => item._id !== itemId),
      }));
    } catch (err) {
      console.error("Failed to remove item", err);
      fetchCart();
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setUpdating(true);
      try {
        await clearCart();
        setCart((prevCart) => ({ ...prevCart, items: [] }));
      } catch (err) {
        console.error("Failed to clear cart", err);
        fetchCart();
      } finally {
        setUpdating(false);
      }
    }
  };

  if (loading) return <div className="loading">Loading cart...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!cart) return <div className="error">Cart not found</div>;

  const subtotal = calculateSubtotal(cart.items || []);

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      {!cart.items || cart.items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <Link to={`/product/${item.productId}`}>
                    <img src={item.imageUrl} alt={item.name} />
                  </Link>
                </div>

                <div className="item-details">
                  <Link
                    to={`/product/${item.productId}`}
                    className="product-link"
                  >
                    <h3>{item.name}</h3>
                  </Link>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>

                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity - 1)
                      }
                      disabled={updating || item.quantity <= 1}
                      className="quantity-btn"
                    >
                      −
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity + 1)
                      }
                      disabled={updating}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <button
                  onClick={() => handleRemoveItem(item._id)}
                  disabled={updating}
                  className="remove-btn"
                  title="Remove item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal ({cart.items.length} items):</span>{" "}
              {/* Show item count */}
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="cart-actions">
              <button
                onClick={handleClearCart}
                disabled={updating || cart.items.length === 0}
                className="clear-cart-btn"
              >
                Clear Cart
              </button>
              <button
                onClick={() => {
                  /* Checkout */
                }}
                disabled={updating || cart.items.length === 0}
                className="checkout-btn"
              >
                Proceed to Checkout
              </button>
            </div>

            <Link to="/" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
