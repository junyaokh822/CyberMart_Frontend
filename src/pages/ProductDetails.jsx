// ProductDetails.jsx
// Detailed product view with:
// - Product info and image
// - Quantity selector and add to cart/buy now actions
// - Customer reviews section with CRUD operations
// - Review eligibility checking based on purchase history
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProduct, addToCart } from "../services/api";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  checkCanReview,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import ReviewModal from "../components/ReviewModal";
import ReviewList from "../components/ReviewList";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");

  // Review states
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Fetch product and reviews on mount or when product ID changes
  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  // Check if user can review this product
  useEffect(() => {
    if (isAuthenticated) {
      checkReviewEligibility();
    }
  }, [id, isAuthenticated]);

  // Fetch product details from API
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await getProduct(id);
      setProduct(data);
    } catch (err) {
      setError("Failed to load product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch product reviews
  const fetchReviews = async () => {
    try {
      const { data } = await getProductReviews(id);
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  // Check if user can review (purchased and not already reviewed)
  const checkReviewEligibility = async () => {
    if (!isAuthenticated) return;

    try {
      const { data } = await checkCanReview(id);
      setCanReview(data.canReview);
      setHasPurchased(data.hasPurchased);
      setHasReviewed(data.hasReviewed);
    } catch (err) {
      console.error("Failed to check review eligibility", err);
    }
  };

  // Add product to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      setAddedMessage("Added to cart!");
      setTimeout(() => setAddedMessage(""), 3000);
    } catch (err) {
      console.error("Failed to add to cart", err);
    } finally {
      setAddingToCart(false);
    }
  };

  // Buy now - add to cart and go to cart page
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setBuyingNow(true);
    try {
      await addToCart(product._id, quantity);
      navigate("/cart");
    } catch (err) {
      console.error("Failed to process buy now", err);
      setBuyingNow(false);
    }
  };

  // Submit a new review
  const handleSubmitReview = async (reviewData) => {
    await createReview({
      productId: id,
      ...reviewData,
    });
    await fetchReviews();
    await checkReviewEligibility();
  };

  // Edit an existing review
  const handleEditReview = async (reviewId, reviewData) => {
    await updateReview(reviewId, reviewData);
    await fetchReviews();
  };

  // Delete a review
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(reviewId);
      await fetchReviews();
      await checkReviewEligibility();
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-details-page">
      <div className="back-link">
        <Link to="/">← Back to Products</Link>
      </div>

      <div className="product-details-container">
        <div className="product-image-section">
          <img src={product.imageUrl} alt={product.name} />
        </div>

        <div className="product-info-section">
          <h1>{product.name}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>

          <div className="product-description">
            <h3>Description</h3>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
              {product.description}
            </p>
          </div>

          <div className="product-stock">
            {product.inStock ? (
              <span className="in-stock">✓ In Stock</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>

          {product.inStock && (
            <>
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="quantity-btn"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || buyingNow}
                  className="add-to-cart-btn"
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={buyingNow || addingToCart}
                  className="buy-now-btn"
                >
                  {buyingNow ? "Processing..." : "Buy Now"}
                </button>
              </div>

              {addedMessage && (
                <div className="success-message">{addedMessage}</div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          {isAuthenticated && (
            <div className="review-eligibility">
              {!hasPurchased && (
                <p className="review-message">
                  You can only review products you have purchased and received
                </p>
              )}
              {hasReviewed && (
                <p className="review-message">
                  You have already reviewed this product
                </p>
              )}
              {canReview && (
                <button
                  className="write-review-btn"
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  Write a Review
                </button>
              )}
            </div>
          )}
        </div>

        <ReviewList
          reviews={reviews}
          averageRating={averageRating}
          totalReviews={totalReviews}
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
          currentUser={user}
        />
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
        productName={product?.name}
      />
    </div>
  );
};

export default ProductDetails;
