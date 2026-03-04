import React from "react";
import ProductTableRow from "./ProductTableRow";

const ProductTable = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="no-products">
        <p>No products found. Click "Add New Product" to create one.</p>
      </div>
    );
  }

  return (
    <div className="products-table">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductTableRow
              key={product._id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
