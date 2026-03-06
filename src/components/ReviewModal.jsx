import React, { useState } from "react";
import StarRating from "./StarRating";
import "./ReviewModal.css";

const ReviewModal = ({ isOpen, onClose, onSubmit, productName }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError("Please enter a review comment");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit({ rating, comment });
      setRating(5);
      setComment("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay">
      <div className="review-modal-content">
        <h2>Write a Review</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <p className="product-name">Reviewing: {productName}</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="rating-section">
            <label>Your Rating:</label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="large"
            />
          </div>

          <div className="form-group">
            <label htmlFor="comment">Your Review:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows="5"
              maxLength="500"
              required
              disabled={loading}
            />
            <small>{comment.length}/500 characters</small>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
