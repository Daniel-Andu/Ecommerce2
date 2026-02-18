



import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products as productsApi, cart, wishlist, reviews } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
  const { idOrSlug } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await productsApi.get(idOrSlug);
        setProduct(data);
      } catch (error) {
        console.error('Load product error:', error);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [idOrSlug]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please log in to add items to cart');
      return;
    }
    
    try {
      await cart.addItem({ 
        product_id: product.id, 
        variant_id: selectedVariant?.id || null, 
        quantity 
      });
      toast.success('Added to cart successfully');
    } catch (e) {
      toast.error(e.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please log in to purchase');
      return;
    }
    
    try {
      await cart.addItem({ 
        product_id: product.id, 
        variant_id: selectedVariant?.id || null, 
        quantity 
      });
      window.location.href = '/checkout';
    } catch (e) {
      toast.error(e.message || 'Failed to process purchase');
    }
  };

  const handleWishlist = async () => {
    if (!user) { 
      toast.error('Please log in to add to wishlist'); 
      return; 
    }
    try {
      await wishlist.add(product.id);
      toast.success('Added to wishlist');
    } catch (e) {
      toast.error(e.message || 'Failed to add to wishlist');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { 
      toast.error('Please log in to review'); 
      return; 
    }
    
    if (!reviewText.trim()) {
      toast.error('Please enter a review');
      return;
    }
    
    setSubmitting(true);
    try {
      await reviews.create({ 
        product_id: product.id, 
        rating, 
        comment: reviewText 
      });
      toast.success('Review submitted successfully');
      setReviewText('');
      setRating(5);
      
      // Refresh product to show new review
      const updated = await productsApi.get(idOrSlug);
      setProduct(updated);
    } catch (e) {
      toast.error(e.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  if (loading) {
    return (
      <div className="page-loading container">
        <div className="spinner" /> 
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found container">
        <h1>Product Not Found</h1>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary">Back to Products</Link>
      </div>
    );
  }

  const price = product.sale_price || product.base_price;
  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[selectedImageIndex];
  const hasImage = currentImage && !imageErrors[selectedImageIndex];

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt;
          <Link to="/products">Products</Link> &gt;
          <span>{product.name}</span>
        </div>

        <div className="product-detail-layout">
          {/* Product Gallery */}
          <div className="product-gallery">
            <div className="gallery-main">
              {hasImage ? (
                <img 
                  src={currentImage.url || currentImage} 
                  alt={currentImage.alt || product.name}
                  onError={() => handleImageError(selectedImageIndex)}
                />
              ) : (
                <div className="gallery-placeholder">
                  <span>No Image Available</span>
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((img, index) => (
                  <button 
                    key={index} 
                    type="button" 
                    className={`thumb ${selectedImageIndex === index ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img 
                      src={img.url || img} 
                      alt={`${product.name} thumbnail ${index + 1}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('thumb-error');
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1>{product.name}</h1>
            
            {product.seller_name && (
              <p className="seller">Sold by: {product.seller_name}</p>
            )}
            
            {product.average_rating != null && (
              <div className="rating-row">
                <span className="stars">
                  {'★'.repeat(Math.round(product.average_rating))}
                  {'☆'.repeat(5 - Math.round(product.average_rating))}
                </span>
                <span className="review-count">
                  ({product.review_count || 0} {product.review_count === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
            
            <div className="price-row">
              <span className="price">{Number(price).toFixed(2)} birr</span>
              {product.sale_price && product.base_price && (
                <span className="price-old">{Number(product.base_price).toFixed(2)} birr</span>
              )}
            </div>
            
            {product.sku && <p className="sku">SKU: {product.sku}</p>}
            
            {product.stock_quantity != null && (
              <p className={`stock ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock_quantity > 0 
                  ? `In stock (${product.stock_quantity} available)` 
                  : 'Out of stock'}
              </p>
            )}
            
            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="variants">
                <label>Options</label>
                <div className="variant-options">
                  {product.variants.map((v) => {
                    let variantLabel = `Variant ${v.id}`;
                    if (v.attributes) {
                      if (typeof v.attributes === 'object') {
                        variantLabel = Object.entries(v.attributes)
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(', ');
                      } else {
                        variantLabel = v.attributes;
                      }
                    } else if (v.sku) {
                      variantLabel = v.sku;
                    }
                    
                    return (
                      <button
                        key={v.id}
                        type="button"
                        className={`variant-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                        onClick={() => setSelectedVariant(v)}
                        disabled={v.stock_quantity === 0}
                      >
                        {variantLabel}
                        {v.price && v.price !== price && (
                          <span className="variant-price">
                            {Number(v.price).toFixed(2)} birr
                          </span>
                        )}
                        {v.stock_quantity === 0 && (
                          <span className="variant-out">Out of stock</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="quantity-row">
              <label>Quantity</label>
              <div className="qty-controls">
                <button 
                  type="button" 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >−</button>
                <input 
                  type="number" 
                  min="1" 
                  max={product.stock_quantity || 999}
                  value={quantity} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val > 0) {
                      setQuantity(Math.min(val, product.stock_quantity || 999));
                    }
                  }} 
                />
                <button 
                  type="button" 
                  onClick={() => setQuantity(q => Math.min(q + 1, product.stock_quantity || 999))}
                  disabled={quantity >= (product.stock_quantity || 999)}
                >+</button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="actions">
              <button 
                type="button" 
                className="btn btn-primary btn-add-to-cart" 
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                Add to Cart
              </button>
              <button 
                type="button" 
                className="btn btn-accent btn-buy-now" 
                onClick={handleBuyNow}
                disabled={product.stock_quantity === 0}
              >
                Buy Now
              </button>
              <button 
                type="button" 
                className="btn btn-outline btn-wishlist" 
                onClick={handleWishlist}
              >
                ♥ Wishlist
              </button>
            </div>
            
            {/* Tabs */}
            <div className="tabs">
              <button 
                type="button" 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} 
                onClick={() => setActiveTab('description')}
              >Description</button>
              <button 
                type="button" 
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} 
                onClick={() => setActiveTab('reviews')}
              >Reviews ({product.reviews?.length || 0})</button>
            </div>
            
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="tab-content description-tab">
                <p>{product.description || 'No description available for this product.'}</p>
                {product.short_description && (
                  <div className="short-description">
                    <h4>Quick Overview</h4>
                    <p>{product.short_description}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="tab-content reviews-tab">
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="reviews-list">
                    {product.reviews.map((r) => (
                      <div key={r.id} className="review-item">
                        <div className="review-header">
                          <span className="stars">
                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                          </span>
                          <span className="reviewer">
                            {r.first_name} {r.last_name}
                          </span>
                          <span className="review-date">
                            {new Date(r.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {r.title && <h4 className="review-title">{r.title}</h4>}
                        <p className="review-comment">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                )}
                
                {/* Review Form */}
                {user ? (
                  <form onSubmit={handleSubmitReview} className="review-form">
                    <h3>Write a Review</h3>
                    
                    <div className="form-group">
                      <label>Your Rating *</label>
                      <select 
                        value={rating} 
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="rating-select"
                      >
                        {[5,4,3,2,1].map((n) => (
                          <option key={n} value={n}>
                            {n} star{n !== 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Your Review *</label>
                      <textarea 
                        placeholder="Share your experience with this product..." 
                        value={reviewText} 
                        onChange={(e) => setReviewText(e.target.value)} 
                        rows={4}
                        required
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={submitting || !reviewText.trim()}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <p className="login-to-review">
                    <Link to="/login">Log in</Link> to write a review.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {product.related_products && product.related_products.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className="related-grid">
              {product.related_products.map(related => (
                <RelatedProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Related Product Card Component
function RelatedProductCard({ product }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="related-card">
      <Link to={`/products/${product.slug}`}>
        <div className="related-image">
          {product.image && !imageError ? (
            <img 
              src={product.image} 
              alt={product.name}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="no-image-small">
              <span>No Image</span>
            </div>
          )}
        </div>
        <div className="related-info">
          <h4>{product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name}</h4>
          <p className="related-price">{Number(product.price).toFixed(2)} birr</p>
        </div>
      </Link>
    </div>
  );
}