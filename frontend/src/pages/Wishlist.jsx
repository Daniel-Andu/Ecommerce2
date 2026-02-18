

// frontend/src/pages/Wishlist.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlist, cart } from '../api';
import { getImageUrl, handleImageError, productPlaceholder } from '../utils/imageUtils';
import toast from 'react-hot-toast';
import './Wishlist.css';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const data = await wishlist.list();
      setItems(data || []);
    } catch (error) {
      console.error('Load wishlist error:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await cart.addItem({ product_id: item.product_id, quantity: 1 });
      toast.success('Added to cart');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await wishlist.remove(productId);
      setItems(items.filter(item => item.product_id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-wishlist">
        <div className="container">
          <div className="empty-wishlist-content">
            <span className="empty-icon">❤️</span>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love to your wishlist</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1>My Wishlist</h1>
        <div className="wishlist-grid">
          {items.map(item => (
            <div key={item.id} className="wishlist-card">
              <Link to={`/products/${item.slug || item.product_id}`} className="wishlist-image">
                <img 
                  src={getImageUrl(item.image, productPlaceholder)} 
                  alt={item.name}
                  onError={(e) => handleImageError(e, productPlaceholder)}
                />
              </Link>
              <div className="wishlist-info">
                <Link to={`/products/${item.slug || item.product_id}`} className="wishlist-name">
                  {item.name}
                </Link>
                <p className="wishlist-price">{Number(item.price).toFixed(2)} birr</p>
                <div className="wishlist-actions">
                  <button 
                    className="btn-add-to-cart"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="btn-remove"
                    onClick={() => handleRemove(item.product_id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

