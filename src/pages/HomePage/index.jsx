// Home/index.jsx
// Main product listing page with:
// - Search by product name
// - Category filtering
// - Sorting options
// - Responsive product grid
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../services/api";
import SearchBar from "./SearchBar";
import FilterControls from "./FilterControls";
import ProductGrid from "./ProductGrid";
import NoResults from "./NoResults";
import "./HomePage.css";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const navigate = useNavigate();

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedCategory, sortBy, products]);

  // Get all products from API
  const fetchProducts = async () => {
    try {
      const { data } = await getProducts();
      setProducts(data);
      setFilteredProducts(data);

      // Extract unique categories for filter dropdown
      const uniqueCategories = [...new Set(data.map((p) => p.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products based on current criteria
  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search term (ONLY in product name)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchLower),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sort (keep original order)
        break;
    }

    setFilteredProducts(filtered);
  };

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // Clear search term
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle sort option change
  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  // Clear all filters and reset to default
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("default");
  };

  // Navigate to product details page
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Check if any filters are active
  const showClearFilters =
    searchTerm || selectedCategory !== "all" || sortBy !== "default";

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-page">
      <h1>Products</h1>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClear={handleClearSearch}
        />

        <FilterControls
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          showClear={showClearFilters}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Results count */}
      <div className="results-count">
        {filteredProducts.length} product
        {filteredProducts.length !== 1 ? "s" : ""} found
      </div>

      {/* Products Grid or No Results */}
      {filteredProducts.length === 0 ? (
        <NoResults onClearFilters={handleClearFilters} />
      ) : (
        <ProductGrid
          products={filteredProducts}
          onProductClick={handleProductClick}
        />
      )}
    </div>
  );
};

export default HomePage;
