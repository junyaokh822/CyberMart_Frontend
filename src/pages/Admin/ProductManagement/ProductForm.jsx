// ProductManagement/ProductForm.jsx
// Modal form for creating/editing products
// Handles all product fields with validation
import React from "react";

const ProductForm = ({
  show,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  isEditing,
}) => {
  if (!show) return null;

  return (
    <div className="product-form-modal">
      <div className="product-form">
        <h3>{isEditing ? "Edit Product" : "Add New Product"}</h3>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onInputChange}
              required
              rows="6"
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={onInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={onInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL *</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={onInputChange}
              />
              In Stock
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {isEditing ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
