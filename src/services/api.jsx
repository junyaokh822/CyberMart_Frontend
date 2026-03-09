// api.jsx
// Centralized API service using axios
// Handles all HTTP requests to the backend with automatic token injection
import axios from "axios";

// Create axios instance with base URL from environment variables
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor to add authentication token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ==================== AUTHENTICATION ENDPOINTS ====================
export const login = (formData) => API.post("/auth/login", formData);
export const register = (formData) => API.post("/auth/register", formData);
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (userData) => API.put("/auth/profile", userData);
export const changePassword = (passwordData) =>
  API.put("/auth/password", passwordData);

// ==================== PRODUCT ENDPOINTS ====================
export const getProducts = () => API.get("/products");
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (formData) => API.post("/products", formData);
export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ==================== CART ENDPOINTS ====================
export const getCart = () => API.get("/cart");
export const addToCart = (productId, quantity = 1) =>
  API.post("/cart/items", { productId, quantity });
export const updateCartItem = (itemId, quantity) =>
  API.put(`/cart/items/${itemId}`, { quantity });
export const removeCartItem = (itemId) => API.delete(`/cart/items/${itemId}`);
export const clearCart = () => API.delete("/cart");

// ==================== ORDER ENDPOINTS ====================
export const createOrder = (orderData) => API.post("/orders", orderData);
export const getOrders = () => API.get("/orders");
export const getOrder = (id) => API.get(`/orders/${id}`);
export const cancelOrder = (id) => API.put(`/orders/${id}/cancel`);

// ==================== ADMIN ORDER ENDPOINTS ====================
export const getAllOrders = () => API.get("/orders/admin/all");
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/admin/${id}/status`, { status });

// ==================== WISHLIST ENDPOINTS ====================
export const getWishlist = () => API.get("/wishlist");
export const addToWishlist = (productId) =>
  API.post("/wishlist", { productId });
export const removeFromWishlist = (productId) =>
  API.delete(`/wishlist/${productId}`);
export const checkWishlist = (productId) =>
  API.get(`/wishlist/check/${productId}`);

// ==================== REVIEW ENDPOINTS ====================
export const getProductReviews = (productId) =>
  API.get(`/reviews/product/${productId}`);
export const createReview = (reviewData) => API.post("/reviews", reviewData);
export const updateReview = (reviewId, reviewData) =>
  API.put(`/reviews/${reviewId}`, reviewData);
export const deleteReview = (reviewId) => API.delete(`/reviews/${reviewId}`);
export const checkCanReview = (productId) =>
  API.get(`/reviews/check-purchase/${productId}`);

export default API;
