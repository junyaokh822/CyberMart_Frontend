import React from "react";

const OrderItemsDetail = ({ items, shippingAddress }) => {
  return (
    <div className="order-items-details">
      <h4>Order Items</h4>
      <div className="items-list">
        {items.map((item) => (
          <div key={item._id} className="order-item-detail">
            <div className="item-image">
              <img src={item.imageUrl} alt={item.name} />
            </div>
            <div className="item-info">
              <div className="item-name">{item.name}</div>
              <div className="item-meta">
                <span>Quantity: {item.quantity}</span>
                <span>Price: ${item.price.toFixed(2)}</span>
                <span className="item-subtotal">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="order-summary-details">
        <div className="summary-row">
          <strong>Shipping Address:</strong>
          <p>
            {shippingAddress?.street}
            <br />
            {shippingAddress?.city}, {shippingAddress?.state}{" "}
            {shippingAddress?.zipCode}
            <br />
            {shippingAddress?.country}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsDetail;
