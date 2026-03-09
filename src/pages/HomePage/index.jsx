// Home/index.jsx
// Main product listing page with:
// - Search by product name
// - Category filtering
// - Sorting options
// - Pagination with page navigation
// - Responsive product grid
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../../services/api";
import SearchBar from "./SearchBar";
import FilterControls from "./FilterControls";
import ProductGrid from "./ProductGrid";
import NoResults from "./NoResults";
import Pagination from "./Pagination";
import "./HomePage.css";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "default");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1,
  );
  const [itemsPerPage] = useState(12); // Show 12 products per page
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters, sorting, and pagination whenever dependencies change
  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedCategory, sortBy, products]);

  // Update URL params when filters change
  useEffect(() => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory !== "all") params.category = selectedCategory;
    if (sortBy !== "default") params.sort = sortBy;
    if (currentPage > 1) params.page = currentPage;

    setSearchParams(params);
  }, [searchTerm, selectedCategory, sortBy, currentPage, setSearchParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

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
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  // Get current page products
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    setCurrentPage(1);
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

  const currentProducts = getCurrentPageProducts();

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
        Showing {currentProducts.length} of {filteredProducts.length} product
        {filteredProducts.length !== 1 ? "s" : ""}
      </div>

      {/* Products Grid or No Results */}
      {filteredProducts.length === 0 ? (
        <NoResults onClearFilters={handleClearFilters} />
      ) : (
        <>
          <ProductGrid
            products={currentProducts}
            onProductClick={handleProductClick}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
