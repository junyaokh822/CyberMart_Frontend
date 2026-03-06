// Home/ProductGrid.jsx
// Grid wrapper for displaying product cards
// Renders responsive grid of products
import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, onProductClick }) => {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
