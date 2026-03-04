import React from "react";
import { Link } from "react-router-dom";

const ProductTableRow = ({ product, onEdit, onDelete }) => {
  return (
    <tr>
      <td>
        <Link to={`/product/${product._id}`} className="product-link">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-thumb"
          />
        </Link>
      </td>
      <td>
        <Link to={`/product/${product._id}`} className="product-link">
          {product.name}
        </Link>
      </td>
      <td>${product.price.toFixed(2)}</td>
      <td>{product.category}</td>
      <td>
        <span
          className={`stock-badge ${product.inStock ? "in-stock" : "out-of-stock"}`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </td>
      <td>
        <div className="admin-action-buttons">
          <button onClick={() => onEdit(product)} className="edit-btn">
            Edit
          </button>
          <button onClick={() => onDelete(product._id)} className="delete-btn">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableRow;
