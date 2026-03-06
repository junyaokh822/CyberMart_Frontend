import React from "react";
import "./StarRating.css";

const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  size = "medium",
}) => {
  const stars = [1, 2, 3, 4, 5];

  // Function to determine if star should be full, half, or empty
  const getStarClass = (star) => {
    if (rating >= star) {
      return "filled";
    } else if (rating >= star - 0.5) {
      return "half-filled";
    }
    return "";
  };

  return (
    <div className={`star-rating ${size}`}>
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${getStarClass(star)} ${readonly ? "readonly" : ""}`}
          onClick={() => !readonly && onRatingChange?.(star)}
        >
          ★
        </span>
      ))}
      {!readonly && <span className="rating-value">{rating.toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;
