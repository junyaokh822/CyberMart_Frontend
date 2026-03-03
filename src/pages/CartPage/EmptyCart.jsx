import React from "react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="empty-cart">
      <p>Your cart is empty</p>
      <Link to="/" className="continue-shopping-btn">
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
