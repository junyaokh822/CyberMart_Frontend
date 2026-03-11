// Admin/ProductManagement/index.jsx
// Admin product management dashboard
// CRUD operations for products with pagination
import React, { useState, useEffect } from "react";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../services/api";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import Pagination from "../../HomePage/Pagination";
import "./ProductManagement.css";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Show 10 products per page in admin
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    inStock: true,
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset to page 1 when products change (after CRUD operations)
  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  // Get all products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getProducts();
      setProducts(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get current page products
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table when page changes
    document.querySelector(".products-table")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Reset form to initial state
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

  // Handle form submission (create or update)
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
      await fetchProducts(); // Refresh the list
    } catch (err) {
      alert("Failed to save product");
      console.error(err);
    }
  };

  // Populate form for editing
  const handleEdit = async (product) => {
    try {
      // Fetch the full product details including description
      const { data: fullProduct } = await getProduct(product._id);
      console.log("Full product details:", fullProduct);

      setEditingProduct(fullProduct);
      setFormData({
        name: fullProduct.name || "",
        description: fullProduct.description || "",
        price: fullProduct.price || "",
        category: fullProduct.category || "",
        imageUrl: fullProduct.imageUrl || "",
        inStock: fullProduct.inStock !== undefined ? fullProduct.inStock : true,
      });
      setShowForm(true);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      alert("Failed to load product details for editing");
    }
  };

  // Delete product with confirmation
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await deleteProduct(productId);
      alert("Product deleted successfully!");

      // After deletion, check if current page becomes empty and adjust
      const newTotalPages = Math.ceil((products.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

      await fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
      console.error(err);
    }
  };

  // Show form for new product
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  const currentProducts = getCurrentPageProducts();

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

      {/* Results count */}
      <div className="admin-results-count">
        {products.length === 0
          ? "No products found"
          : `Showing ${(currentPage - 1) * itemsPerPage + 1} – ${Math.min(currentPage * itemsPerPage, products.length)} of ${products.length} products`}
      </div>

      <ProductTable
        products={currentProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination-container">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
