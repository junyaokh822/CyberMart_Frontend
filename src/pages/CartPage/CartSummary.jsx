// Cart/CartSummary.jsx
// Cart summary component displaying totals and checkout actions
// Shows subtotal, shipping (free), and total
import React from "react";
import { Link } from "react-router-dom";

const CartSummary = ({
  itemCount,
  subtotal,
  onClearCart,
  onCheckout,
  updating,
}) => {
  return (
    <div className="cart-summary">
      <div className="summary-row">
        <span>Subtotal ({itemCount} items):</span>
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
          onClick={onClearCart}
          disabled={updating || itemCount === 0}
          className="clear-cart-btn"
        >
          Clear Cart
        </button>
        <button
          onClick={onCheckout}
          disabled={updating || itemCount === 0}
          className="checkout-btn"
        >
          Proceed to Checkout
        </button>
      </div>

      <Link to="/" className="continue-shopping">
        ← Continue Shopping
      </Link>
    </div>
  );
};

export default CartSummary;
