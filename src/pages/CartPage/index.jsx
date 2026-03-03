import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  createOrder,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";
import CheckoutModal from "./CheckoutModal";
import "./CartPage.css";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Checkout form state
  const [checkoutData, setCheckoutData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    paymentMethod: "credit_card",
  });

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        fetchCart();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isAuthenticated, fetchCart]);

  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(true);
    try {
      await updateCartItem(itemId, newQuantity);
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item,
        ),
      }));
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    setCheckoutLoading(true);
    try {
      await createOrder({
        shippingAddress: {
          street: checkoutData.street,
          city: checkoutData.city,
          state: checkoutData.state,
          zipCode: checkoutData.zipCode,
          country: checkoutData.country,
        },
        paymentMethod: checkoutData.paymentMethod,
      });

      setCart((prevCart) => ({ ...prevCart, items: [] }));
      setShowCheckoutForm(false);
      setCheckoutData({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
        paymentMethod: "credit_card",
      });

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading cart...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!cart) return <div className="error">Cart not found</div>;

  const subtotal = calculateSubtotal(cart.items || []);

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      {!cart?.items || cart.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                updating={updating}
              />
            ))}
          </div>

          <CartSummary
            itemCount={cart.items.length}
            subtotal={subtotal}
            onClearCart={handleClearCart}
            onCheckout={() => setShowCheckoutForm(true)}
            updating={updating}
          />
        </>
      )}

      <CheckoutModal
        show={showCheckoutForm}
        onClose={() => setShowCheckoutForm(false)}
        checkoutData={checkoutData}
        onInputChange={handleInputChange}
        onSubmit={handleCheckoutSubmit}
        loading={checkoutLoading}
        subtotal={subtotal}
        itemCount={cart?.items?.length || 0}
      />
    </div>
  );
};

export default CartPage;
