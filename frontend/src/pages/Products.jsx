



import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { products as productsApi, categories } from '../api';
import { getImageUrl, handleImageError, productPlaceholder } from '../utils/imageUtils';
import toast from 'react-hot-toast';
import './Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productsData, setProductsData] = useState({ 
    products: [], 
    total: 0, 
    page: 1, 
    limit: 12 
  });
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [currentCategory, setCurrentCategory] = useState(null);

  // Get filter params from URL
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [category, search, sort, page]);

  useEffect(() => {
    if (category && categoriesList.length > 0) {
      const found = categoriesList.find(c => c.id === parseInt(category));
      setCurrentCategory(found);
    } else {
      setCurrentCategory(null);
    }
  }, [category, categoriesList]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (category) params.category_id = category;
      if (search) params.search = search;
      if (sort) params.sort = sort;
      if (page) params.page = page;
      
      const data = await productsApi.getAll(params);
      console.log('Products loaded:', data);
      setProductsData(data);
    } catch (error) {
      console.error('Load products error:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categories.getAll();
      setCategoriesList(data || []);
    } catch (error) {
      console.error('Load categories error:', error);
    }
  };

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (categoryId) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId) {
      newParams.set('category', categoryId);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const totalPages = Math.ceil(productsData.total / productsData.limit);

  // Helper function to get product image
  const getProductImage = (product) => {
    // If product has images array
    if (product.images && product.images.length > 0) {
      const img = product.images[0];
      // Check if it's an object with url property or just a string
      return typeof img === 'object' ? img.url : img;
    }
    
    // If product has image property directly
    if (product.image) {
      return product.image;
    }
    
    // If product has primary_image
    if (product.primary_image) {
      return product.primary_image;
    }
    
    return null;
  };

  // Loading skeleton
  if (loading && productsData.products.length === 0) {
    return (
      <div className="products-page">
        <div className="container">
          <div className="products-layout">
            <aside className="products-sidebar">
              <h3>Categories</h3>
              <div className="category-filters">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="category-filter skeleton" style={{ height: '40px' }}></div>
                ))}
              </div>
              <h3>Sort By</h3>
              <div className="sort-select skeleton" style={{ height: '45px' }}></div>
            </aside>
            
            <main className="products-main">
              <div className="loading-grid">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="product-skeleton"></div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-layout">
          {/* Sidebar with filters */}
          <aside className="products-sidebar">
            <h3>Categories</h3>
            <div className="category-filters">
              <button 
                className={`category-filter ${!category ? 'active' : ''}`}
                onClick={() => handleCategoryChange('')}
              >
                All Products
              </button>
              
              {categoriesList.map(cat => (
                <button
                  key={cat.id}
                  className={`category-filter ${category === String(cat.id) ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.name}
                  {cat.product_count > 0 && ` (${cat.product_count})`}
                </button>
              ))}
            </div>

            <h3>Sort By</h3>
            <select 
              value={sort} 
              onChange={handleSortChange} 
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="popular">Most Popular</option>
            </select>
          </aside>

          {/* Main content */}
          <main className="products-main">
            {/* Search info */}
            {search && (
              <div className="search-info">
                <p>Search results for: "{search}"</p>
                <p>{productsData.total} products found</p>
              </div>
            )}

            {/* Category info */}
            {currentCategory && !search && (
              <div className="category-info">
                <h2>
                  {currentCategory.name}
                  <span>{productsData.total} products</span>
                </h2>
                {currentCategory.description && (
                  <p>{currentCategory.description}</p>
                )}
              </div>
            )}

            {/* Products grid */}
            {productsData.products.length === 0 ? (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {productsData.products.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      imageUrl={getProductImage(product)}
                      hasImageError={imageErrors[product.id]}
                      onImageError={handleImageError}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      className="btn btn-outline"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    
                    <span className="page-info">
                      Page {page} of {totalPages}
                    </span>
                    
                    <button 
                      className="btn btn-outline"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, imageUrl, hasImageError, onImageError }) {
  const [localImageError, setLocalImageError] = useState(false);
  const showError = hasImageError || localImageError;

  const handleImageError = () => {
    setLocalImageError(true);
    if (onImageError) {
      onImageError(product.id);
    }
  };

  const isOnSale = product.sale_price && product.sale_price < product.base_price;

  // Format price
  const displayPrice = product.sale_price || product.base_price || 0;

  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <div className="product-image-container">
        {imageUrl && !showError ? (
          <img 
            src={getImageUrl(imageUrl)} 
            alt={product.name}
            className="product-image"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="product-image-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15L16 10 5 21" />
            </svg>
            <span>No Image</span>
          </div>
        )}
        
        {isOnSale && (
          <span className="product-badge sale">SALE</span>
        )}
        
        {product.stock_quantity === 0 && (
          <span className="product-badge out-of-stock">Out of Stock</span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        
        {product.seller_name && (
          <p className="product-seller">{product.seller_name}</p>
        )}
        
        <div className="product-price-section">
          {isOnSale ? (
            <>
              <span className="current-price">
                ${Number(product.sale_price).toFixed(2)}
              </span>
              <span className="old-price">
                ${Number(product.base_price).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="current-price">
              ${Number(displayPrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}