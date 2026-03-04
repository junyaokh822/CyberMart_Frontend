import React, { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../services/api";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import "./ProductManagement.css";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    inStock: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
      inStock: true,
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
        alert("Product updated successfully!");
      } else {
        await createProduct(formData);
        alert("Product created successfully!");
      }

      setShowForm(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      alert("Failed to save product");
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      inStock: product.inStock,
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(productId);
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
      console.error(err);
    }
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-management">
      <div className="management-header">
        <h2>Product Management</h2>
        <button className="add-product-btn" onClick={handleAddNew}>
          + Add New Product
        </button>
      </div>

      <ProductForm
        show={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
        formData={formData}
        onInputChange={handleInputChange}
        isEditing={!!editingProduct}
      />

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProductManagement;
