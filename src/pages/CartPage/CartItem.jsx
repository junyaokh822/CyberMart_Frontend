import React from "react";
import { Link } from "react-router-dom";

const CartItem = ({ item, onQuantityChange, onRemove, updating }) => {
  return (
    <div className="cart-item">
      <div className="item-image">
        <Link to={`/product/${item.productId}`}>
          <img src={item.imageUrl} alt={item.name} />
        </Link>
      </div>

      <div className="item-details">
        <Link to={`/product/${item.productId}`} className="product-link">
          <h3>{item.name}</h3>
        </Link>
        <p className="item-price">${item.price.toFixed(2)}</p>
      </div>

      <div className="item-quantity">
        <div className="quantity-controls">
          <button
            onClick={() => onQuantityChange(item._id, item.quantity - 1)}
            disabled={updating || item.quantity <= 1}
            className="quantity-btn"
          >
            −
          </button>
          <span className="quantity-value">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item._id, item.quantity + 1)}
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
        onClick={() => onRemove(item._id)}
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
  );
};

export default CartItem;
