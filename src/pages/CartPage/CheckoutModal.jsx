import React from "react";
import "./CheckoutModal.css";

const CheckoutModal = ({
  show,
  onClose,
  checkoutData,
  onInputChange,
  onSubmit,
  loading,
  subtotal,
  itemCount,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Checkout</h2>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <form onSubmit={onSubmit}>
          <h3>Shipping Address</h3>

          <div className="form-group">
            <label>Street Address *</label>
            <input
              type="text"
              name="street"
              value={checkoutData.street}
              onChange={onInputChange}
              required
              placeholder="street"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={checkoutData.city}
                onChange={onInputChange}
                required
                placeholder="city"
              />
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={checkoutData.state}
                onChange={onInputChange}
                required
                placeholder="state"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Zip Code *</label>
              <input
                type="text"
                name="zipCode"
                value={checkoutData.zipCode}
                onChange={onInputChange}
                required
                placeholder="zipcode"
              />
            </div>

            <div className="form-group">
              <label>Country *</label>
              <select
                name="country"
                value={checkoutData.country}
                onChange={onInputChange}
                required
              >
                <option value="USA">United States</option>
                <option value="Canada">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>

          <h3>Payment Method</h3>

          <div className="payment-options">
            {["credit_card", "debit_card", "paypal", "cash_on_delivery"].map(
              (method) => (
                <label key={method} className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={checkoutData.paymentMethod === method}
                    onChange={onInputChange}
                  />
                  <span>{method.replace("_", " ").toUpperCase()}</span>
                </label>
              ),
            )}
          </div>

          <div className="order-summary-modal">
            <h3>Order Summary</h3>
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
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
