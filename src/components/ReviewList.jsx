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
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

  const handleEditClick = (review) => {
    setEditingReview(review._id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  const handleEditSubmit = (reviewId) => {
    onEdit(reviewId, { rating: editRating, comment: editComment });
    setEditingReview(null);
  };

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
            <>
              <p className="review-comment">{review.comment}</p>
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
