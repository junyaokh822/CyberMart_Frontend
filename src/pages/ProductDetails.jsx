import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProduct, addToCart } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

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

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setBuyingNow(true);
    try {
      await addToCart(product._id, quantity);
      // Navigate directly to cart page
      navigate("/cart");
    } catch (err) {
      console.error("Failed to process buy now", err);
      setBuyingNow(false);
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
    </div>
  );
};

export default ProductDetails;
