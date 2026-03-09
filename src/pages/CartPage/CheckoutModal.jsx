// Cart/CheckoutModal.jsx
// Checkout modal component for collecting shipping and payment information
import React, { useState, useEffect } from "react";
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
  const [paymentStep, setPaymentStep] = useState("method");
  const [paymentDetails, setPaymentDetails] = useState({
    // Card details
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    // PayPal details
    paypalEmail: "",
  });

  // Reset to method step when modal opens or payment method is cleared
  useEffect(() => {
    if (show) {
      if (!checkoutData.paymentMethod) {
        setPaymentStep("method");
      } else {
        setPaymentStep("details");
      }
    }
  }, [show, checkoutData.paymentMethod]);

  if (!show) return null;

  const handlePaymentMethodChange = (method) => {
    onInputChange({
      target: {
        name: "paymentMethod",
        value: method,
      },
    });
    setPaymentStep("details");
  };

  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;

    // Format card number (only digits, max 16)
    if (name === "cardNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 16);
      // Add space every 4 digits for better readability
      const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
      setPaymentDetails((prev) => ({ ...prev, [name]: formatted }));
    }
    // Format expiry date (MM/YY)
    else if (name === "expiryDate") {
      let formatted = value.replace(/\D/g, "");
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2, 4);
      }
      setPaymentDetails((prev) => ({ ...prev, [name]: formatted }));
    }
    // Format CVV (only digits, max 4)
    else if (name === "cvv") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      setPaymentDetails((prev) => ({ ...prev, [name]: digits }));
    } else {
      setPaymentDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitWithPayment = (e) => {
    e.preventDefault();

    // Validate that a payment method is selected
    if (!checkoutData.paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    // Validate payment details based on method
    if (
      checkoutData.paymentMethod === "credit_card" ||
      checkoutData.paymentMethod === "debit_card"
    ) {
      if (
        !paymentDetails.cardNumber ||
        !paymentDetails.cardHolder ||
        !paymentDetails.expiryDate ||
        !paymentDetails.cvv
      ) {
        alert("Please fill in all card details");
        return;
      }
    } else if (checkoutData.paymentMethod === "paypal") {
      if (!paymentDetails.paypalEmail) {
        alert("Please enter your PayPal email");
        return;
      }
    }

    // Prepare payment details based on payment method
    let processedPaymentDetails = {};

    if (
      checkoutData.paymentMethod === "credit_card" ||
      checkoutData.paymentMethod === "debit_card"
    ) {
      // Only send last 4 digits and a transaction reference
      const cleanCardNumber = paymentDetails.cardNumber.replace(/\s/g, "");
      processedPaymentDetails = {
        cardLastFour: cleanCardNumber.slice(-4),
        transactionId: `TXN_${Date.now()}`, // Simulated transaction ID
      };
    } else if (checkoutData.paymentMethod === "paypal") {
      processedPaymentDetails = {
        payerEmail: paymentDetails.paypalEmail,
        transactionId: `PAYPAL_${Date.now()}`, // Simulated transaction ID
      };
    } else if (checkoutData.paymentMethod === "cash_on_delivery") {
      processedPaymentDetails = {
        paymentStatus: "pending",
      };
    }

    // Call the original onSubmit with enhanced data
    onSubmit(e, processedPaymentDetails);
  };

  const goBackToMethods = () => {
    setPaymentStep("method");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Checkout</h2>

        {/* Order Summary */}
        <div className="order-summary-modal">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items ({itemCount}):</span>
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

        <form onSubmit={handleSubmitWithPayment}>
          {/* Shipping Address Form */}
          <h3>Shipping Address</h3>
          <div className="form-group">
            <label htmlFor="street">Street Address</label>
            <input
              type="text"
              id="street"
              name="street"
              value={checkoutData.street}
              onChange={onInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={checkoutData.city}
                onChange={onInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={checkoutData.state}
                onChange={onInputChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={checkoutData.zipCode}
                onChange={onInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={checkoutData.country}
                onChange={onInputChange}
                required
                disabled={loading}
              >
                <option value="USA">United States</option>
                <option value="Canada">Canada</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
          </div>

          {/* Payment Section */}
          <h3>Payment Information</h3>

          {/* Payment Method Selection - Always visible */}
          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="credit_card"
                checked={checkoutData.paymentMethod === "credit_card"}
                onChange={() => handlePaymentMethodChange("credit_card")}
                disabled={loading}
              />
              Credit Card
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="debit_card"
                checked={checkoutData.paymentMethod === "debit_card"}
                onChange={() => handlePaymentMethodChange("debit_card")}
                disabled={loading}
              />
              Debit Card
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={checkoutData.paymentMethod === "paypal"}
                onChange={() => handlePaymentMethodChange("paypal")}
                disabled={loading}
              />
              PayPal
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="cash_on_delivery"
                checked={checkoutData.paymentMethod === "cash_on_delivery"}
                onChange={() => handlePaymentMethodChange("cash_on_delivery")}
                disabled={loading}
              />
              Cash on Delivery
            </label>
          </div>

          {/* Payment Details Form - Shown only when a method is selected */}
          {checkoutData.paymentMethod && paymentStep === "details" && (
            <div className="payment-details">
              <button
                type="button"
                onClick={goBackToMethods}
                className="back-to-methods-btn"
                style={{
                  background: "none",
                  border: "none",
                  color: "#667eea",
                  cursor: "pointer",
                  marginBottom: "15px",
                  padding: "5px 0",
                  fontSize: "0.95rem",
                }}
              >
                ← Change Payment Method
              </button>

              {/* Credit/Debit Card Form */}
              {(checkoutData.paymentMethod === "credit_card" ||
                checkoutData.paymentMethod === "debit_card") && (
                <>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentDetails.cardNumber}
                      onChange={handlePaymentDetailsChange}
                      required
                      disabled={loading}
                      maxLength="19"
                    />
                  </div>

                  <div className="form-group">
                    <label>Card Holder Name</label>
                    <input
                      type="text"
                      name="cardHolder"
                      placeholder="John Doe"
                      value={paymentDetails.cardHolder}
                      onChange={handlePaymentDetailsChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={paymentDetails.expiryDate}
                        onChange={handlePaymentDetailsChange}
                        required
                        disabled={loading}
                        maxLength="5"
                      />
                    </div>

                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        placeholder="123"
                        value={paymentDetails.cvv}
                        onChange={handlePaymentDetailsChange}
                        required
                        disabled={loading}
                        maxLength="4"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* PayPal Form */}
              {checkoutData.paymentMethod === "paypal" && (
                <div className="form-group">
                  <label>PayPal Email</label>
                  <input
                    type="email"
                    name="paypalEmail"
                    placeholder="your-email@example.com"
                    value={paymentDetails.paypalEmail}
                    onChange={handlePaymentDetailsChange}
                    required
                    disabled={loading}
                  />
                </div>
              )}

              {/* Cash on Delivery - No additional details needed */}
              {checkoutData.paymentMethod === "cash_on_delivery" && (
                <div className="form-group">
                  <p
                    style={{
                      color: "#666",
                      fontStyle: "italic",
                      margin: "10px 0",
                    }}
                  >
                    You'll pay when you receive your order.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>

            {/* Show Place Order button only when payment details are shown */}
            {checkoutData.paymentMethod && paymentStep === "details" && (
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Processing..." : "Place Order"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
