


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cart as cartApi } from '../api';
import { getImageUrl, handleImageError, productPlaceholder } from '../utils/imageUtils';
import toast from 'react-hot-toast';
import './Cart.css';

export default function Cart() {
  const [cart, setCart] = useState({ items: [], subtotal: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadCart();
    
    // Listen for cart updates
    const handleCartUpdate = () => loadCart();
    window.addEventListener('cart-updated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  const loadCart = async () => {
    try {
      const data = await cartApi.get();
      setCart({
        items: data.items || [],
        subtotal: parseFloat(data.subtotal) || 0
      });
    } catch (error) {
      console.error('Load cart error:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      await cartApi.updateItem(itemId, newQuantity);
      await loadCart();
      toast.success('Cart updated');
    } catch (error) {
      toast.error(error.message || 'Failed to update cart');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(true);
    try {
      await cartApi.removeItem(itemId);
      await loadCart();
      toast.success('Item removed');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="container">
          <div className="empty-cart-content">
            <span className="empty-icon">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Shopping Cart</h1>
        
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.id} className="cart-item">
                <Link to={`/products/${item.product_id}`} className="cart-item-image">
                  <img 
                    src={getImageUrl(item.image, productPlaceholder)} 
                    alt={item.name}
                    onError={(e) => handleImageError(e, productPlaceholder)}
                  />
                </Link>
                
                <div className="cart-item-info">
                  <Link to={`/products/${item.product_id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <p className="cart-item-price">{Number(item.price).toFixed(2)} birr each</p>
                  
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updating || item.quantity <= 1}
                      >−</button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating}
                      >+</button>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                      disabled={updating}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
                <div className="cart-item-total">
                  {(item.price * item.quantity).toFixed(2)}
                  birr
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal ({cart.items.length} items)</span>
              <span> {cart.subtotal.toFixed(2)} birr</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className="summary-total">
              <span>Total</span>
              <span>{cart.subtotal.toFixed(2)} birr</span>
            </div>
            
            <Link to="/checkout" className="btn-checkout">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}