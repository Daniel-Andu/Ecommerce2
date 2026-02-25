import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { categories } from '../api';
import './AdvancedSearch.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function AdvancedSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({});

    const [filters, setFilters] = useState({
        q: searchParams.get('q') || '',
        category_id: searchParams.get('category_id') || '',
        min_price: searchParams.get('min_price') || '',
        max_price: searchParams.get('max_price') || '',
        rating: searchParams.get('rating') || '',
        in_stock: searchParams.get('in_stock') || '',
        sort: searchParams.get('sort') || 'relevance',
        page: searchParams.get('page') || 1
    });

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        searchProducts();
    }, [filters]);

    const loadCategories = async () => {
        try {
            const response = await categories.getAll();
            setCategories(response || []);
        } catch (error) {
            console.error('Load categories error:', error);
        }
    };

    const searchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/search?${params}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            if (!response.ok) throw new Error('Search failed');

            const data = await response.json();
            setProducts(data.products || []);
            setPagination(data.pagination || {});
        } catch (error) {
            console.error('Search error:', error);
            setProducts([]);
            setPagination({});
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        setFilters(newFilters);

        const params = new URLSearchParams();
        Object.keys(newFilters).forEach(k => {
            if (newFilters[k]) params.set(k, newFilters[k]);
        });
        setSearchParams(params);
    };

    const clearFilters = () => {
        const newFilters = {
            q: '',
            category_id: '',
            min_price: '',
            max_price: '',
            rating: '',
            in_stock: '',
            sort: 'relevance',
            page: 1
        };
        setFilters(newFilters);
        setSearchParams({});
    };

    return (
        <div className="advanced-search">
            <div className="container">
                <div className="search-header">
                    <h1>🔍 Advanced Search</h1>
                    <p>Find exactly what you're looking for</p>
                </div>

                <div className="search-layout">
                    {/* Filters Sidebar */}
                    <aside className="filters-sidebar">
                        <div className="filter-header">
                            <h3>Filters</h3>
                            <button onClick={clearFilters} className="btn-clear">Clear All</button>
                        </div>

                        {/* Search Input */}
                        <div className="filter-group">
                            <label>🔎 Search Keywords</label>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={filters.q}
                                onChange={(e) => handleFilterChange('q', e.target.value)}
                                className="filter-input"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="filter-group">
                            <label>📁 Category</label>
                            <select
                                value={filters.category_id}
                                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div className="filter-group">
                            <label>💰 Price Range</label>
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.min_price}
                                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                                    className="filter-input-small"
                                />
                                <span>to</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.max_price}
                                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                                    className="filter-input-small"
                                />
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div className="filter-group">
                            <label>⭐ Minimum Rating</label>
                            <div className="rating-options">
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <button
                                        key={rating}
                                        className={`rating-btn ${filters.rating === String(rating) ? 'active' : ''}`}
                                        onClick={() => handleFilterChange('rating', String(rating))}
                                    >
                                        {'⭐'.repeat(rating)} & up
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stock Filter */}
                        <div className="filter-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={filters.in_stock === 'true'}
                                    onChange={(e) => handleFilterChange('in_stock', e.target.checked ? 'true' : '')}
                                />
                                <span>📦 In Stock Only</span>
                            </label>
                        </div>
                    </aside>

                    {/* Results Section */}
                    <main className="search-results">
                        <div className="results-header">
                            <div className="results-info">
                                {loading ? (
                                    <p>Searching...</p>
                                ) : (
                                    <p>
                                        Found <strong>{pagination.total || 0}</strong> products
                                        {filters.q && ` for "${filters.q}"`}
                                    </p>
                                )}
                            </div>

                            <div className="sort-options">
                                <label>Sort by:</label>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="newest">Newest First</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-grid">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="skeleton-card"></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="products-grid">
                                    {products.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="pagination">
                                        <button
                                            disabled={pagination.page === 1}
                                            onClick={() => handleFilterChange('page', pagination.page - 1)}
                                            className="btn-page"
                                        >
                                            ← Previous
                                        </button>

                                        <span className="page-info">
                                            Page {pagination.page} of {pagination.pages}
                                        </span>

                                        <button
                                            disabled={pagination.page === pagination.pages}
                                            onClick={() => handleFilterChange('page', pagination.page + 1)}
                                            className="btn-page"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-results">
                                <div className="no-results-icon">🔍</div>
                                <h3>No products found</h3>
                                <p>Try adjusting your filters or search terms</p>
                                <button onClick={clearFilters} className="btn-primary">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

function ProductCard({ product }) {
    const imageUrl = product.images?.[0] || 'https://via.placeholder.com/300';
    const price = product.sale_price || product.base_price;
    const hasDiscount = product.sale_price && product.sale_price < product.base_price;
    const discount = hasDiscount ? Math.round((1 - product.sale_price / product.base_price) * 100) : 0;

    return (
        <Link to={`/products/${product.slug || product.id}`} className="product-card">
            <div className="product-image-wrapper">
                <img src={imageUrl} alt={product.name} />
                {hasDiscount && <span className="discount-badge">-{discount}%</span>}
                {product.stock_quantity === 0 && <span className="out-of-stock-badge">Out of Stock</span>}
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>

                {product.avg_rating > 0 && (
                    <div className="product-rating">
                        <span className="stars">{'⭐'.repeat(Math.round(product.avg_rating))}</span>
                        <span className="rating-count">({product.review_count || 0})</span>
                    </div>
                )}

                <div className="product-price">
                    <span className="current-price">ETB {Number(price).toFixed(2)}</span>
                    {hasDiscount && (
                        <span className="old-price">ETB {Number(product.base_price).toFixed(2)}</span>
                    )}
                </div>

                <button className="btn-add-cart">Add to Cart</button>
            </div>
        </Link>
    );
}
