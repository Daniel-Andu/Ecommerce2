

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products, categories, banners } from '../api';
import { getImageUrl } from '../utils/imageUtils';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [bannersList, setBannersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredData, newData, catsData, bannersData] = await Promise.all([
          products.featured().catch(() => []),
          products.newArrivals().catch(() => []),
          categories.list().catch(() => []),
          banners.list().catch(() => [])
        ]);
        
        setFeatured(featuredData || []);
        setNewArrivals(newData || []);
        
        // Get all categories, not just parent ones
        const allCategories = Array.isArray(catsData) ? catsData : [];
        setCategoriesList(allCategories);
        
        setBannersList(bannersData || []);
      } catch (error) {
        console.error('Load error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (bannersList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannersList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannersList.length]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="home">
      {/* Animated Welcome Message */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1 className="welcome-text">Welcome to Our Marketplace</h1>
          <p className="welcome-subtitle">Discover Amazing Products at Great Prices</p>
        </div>
      </div>

      {/* Hero Banner - Full width below navbar */}
      <section className="hero">
        {bannersList.length > 0 ? (
          <>
            <div className="hero-slides">
              {bannersList.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`hero-slide ${index === currentBanner ? 'active' : ''}`}
                >
                  <img 
                    src={getImageUrl(banner.image_url, 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200')} 
                    alt={banner.title || 'Banner'}
                    className="hero-image"
                  />
                  <div className="hero-content">
                    <h1>{banner.title || 'Big Sale 50% Off'}</h1>
                    <Link to={banner.link_url || '/products'} className="btn-shop-now">
                      Shop Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {bannersList.length > 1 && (
              <>
                <button 
                  className="hero-arrow prev"
                  onClick={() => setCurrentBanner(prev => (prev - 1 + bannersList.length) % bannersList.length)}
                >
                  ←
                </button>
                <button 
                  className="hero-arrow next"
                  onClick={() => setCurrentBanner(prev => (prev + 1) % bannersList.length)}
                >
                  →
                </button>
                <div className="hero-dots">
                  {bannersList.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentBanner ? 'active' : ''}`}
                      onClick={() => setCurrentBanner(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="hero-slide active">
            <img 
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200" 
              alt="Sale Banner"
              className="hero-image"
            />
            <div className="hero-content">
              <h1>Big Sale 50% Off</h1>
              <Link to="/products" className="btn-shop-now">
                Shop Now
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Categories Section - Below Banner */}
      {categoriesList.length > 0 && (
        <section className="categories-section">
          <div className="container">
            <div className="section-header">
              <h2>Shop by Category</h2>
              <Link to="/categories" className="view-all">View All Categories →</Link>
            </div>
            <div className="categories-grid">
              {categoriesList.slice(0, 8).map((category) => {
                const categoryImages = {
                  'Electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=400&fit=crop',
                  'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
                  'Home & Living': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
                  'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
                  'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
                  'Books': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=400&fit=crop',
                  'Toys': 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=600&h=400&fit=crop',
                  'Automotive': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop'
                };
                
                const imageUrl = categoryImages[category.name] || 
                  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop';
                
                return (
                  <Link
                    key={category.id}
                    to={`/products?category_id=${category.id}`}
                    className="category-card"
                  >
                    <div className="category-image-container">
                      <img src={imageUrl} alt={category.name} className="category-image" />
                      <div className="category-overlay"></div>
                      <h3>{category.name}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Featured Products</h2>
              <Link to="/products?sort=featured" className="view-all">View All →</Link>
            </div>
            <div className="products-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section bg-light">
          <div className="container">
            <div className="section-header">
              <h2>New Arrivals</h2>
              <Link to="/products?sort=newest" className="view-all">View All →</Link>
            </div>
            <div className="products-grid">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>On orders over $50</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Money Back</h3>
              <p>30 days guarantee</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>100% secure</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎧</div>
              <h3>24/7 Support</h3>
              <p>Dedicated support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const ProductCard = ({ product }) => (
  <Link to={`/products/${product.slug || product.id}`} className="product-card">
    <div className="product-image-container">
      <div className="product-image">
        <img 
          src={getImageUrl(product.images?.[0], 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop')} 
          alt={product.name}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop';
          }}
        />
      </div>
      {product.sale_price && (
        <span className="product-badge sale">
          -{Math.round((1 - product.sale_price / product.base_price) * 100)}%
        </span>
      )}
    </div>
    <div className="product-info">
      <h3 className="product-title">{product.name}</h3>
      <p className="product-seller">{product.seller_name || 'Unknown Seller'}</p>
      <div className="product-price">
        {product.sale_price ? (
          <>
            <span className="current-price">{Number(product.sale_price).toFixed(2)} birr</span>
            <span className="old-price">{Number(product.base_price).toFixed(2)} birr</span>
          </>
        ) : (
          <span className="current-price">{Number(product.base_price).toFixed(2)} birr</span>
        )}
      </div>
      <button className="btn-add-to-cart">Add to Cart</button>
    </div>
  </Link>
);