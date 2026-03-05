import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onClick }) => {
  return (
    <div className="product-card" onClick={() => onClick(product._id)}>
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <Link
        to={`/product/${product._id}`}
        className="view-btn"
        onClick={(e) => e.stopPropagation()}
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
