// ReviewList.jsx
// Displays all reviews for a product with edit/delete capabilities
// Allows users to edit their own reviews with inline form
import React, { useState } from "react";
import StarRating from "./StarRating";
import { useAuth } from "../context/AuthContext";
import "./ReviewList.css";

const ReviewList = ({
  reviews,
  averageRating,
  totalReviews,
  onEdit,
  onDelete,
  currentUser,
}) => {
  // State for inline editing
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

  // Initialize edit form with review data
  const handleEditClick = (review) => {
    setEditingReview(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  // Submit edited review
  const handleEditSubmit = (reviewId) => {
    onEdit(reviewId, { rating: editRating, comment: editComment });
    setEditingReview(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="reviews-list">
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        <div className="average-rating">
          <StarRating rating={averageRating} readonly size="small" />
          <span>{averageRating.toFixed(1)} out of 5</span>
          <span className="total-reviews">({totalReviews} reviews)</span>
        </div>
      </div>

      {reviews.map((review) => (
        <div key={review._id} className="review-item">
          <div className="review-header">
            <span className="reviewer-name">{review.userName}</span>
            <span className="review-date">{formatDate(review.createdAt)}</span>
          </div>

          <StarRating rating={review.rating} readonly size="small" />

          {editingReview === review._id ? (
            // Edit mode - inline form
            <div className="edit-review">
              <StarRating
                rating={editRating}
                onRatingChange={setEditRating}
                size="small"
              />
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows="3"
              />
              <div className="edit-actions">
                <button onClick={() => setEditingReview(null)}>Cancel</button>
                <button onClick={() => handleEditSubmit(review._id)}>
                  Save
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <>
              <p className="review-comment">{review.comment}</p>
              {/* Show edit/delete buttons only for the review author */}
              {currentUser?._id === review.userId && (
                <div className="review-actions">
                  <button onClick={() => handleEditClick(review)}>Edit</button>
                  <button onClick={() => onDelete(review._id)}>Delete</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
