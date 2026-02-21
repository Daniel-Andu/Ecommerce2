import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import toast from 'react-hot-toast';
import './Cart.css';

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ 
    items: [], 
    subtotal: 0, 
    total: 0,
    item_count: 0,
    out_of_stock_count: 0,
    has_out_of_stock: false 
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showOutOfStockWarning, setShowOutOfStockWarning] = useState(false);

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
      setLoading(true);
      const data = await api.cart.get();
      
      // Ensure all price values are numbers
      const processedItems = (data.items || []).map(item => ({
        ...item,
        price: parseFloat(item.price) || 0,
        original_price: parseFloat(item.original_price) || 0,
        total: parseFloat(item.price * item.quantity) || 0
      }));
      
      const processedCart = {
        ...data,
        items: processedItems,
        subtotal: parseFloat(data.subtotal) || 0,
        total: parseFloat(data.total) || 0
      };
      
      setCart(processedCart);
      
      // Check if there are out of stock items
      const hasOutOfStock = processedItems.some(item => !item.in_stock);
      setShowOutOfStockWarning(hasOutOfStock);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      await api.cart.updateItem(itemId, newQuantity);
      await loadCart();
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error(error.message || 'Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm('Remove this item from cart?')) return;
    
    setUpdating(true);
    try {
      await api.cart.removeItem(itemId);
      await loadCart();
      window.dispatchEvent(new Event('cart-updated'));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const handleAutoFixCart = async () => {
    setUpdating(true);
    try {
      const result = await api.cart.autoFix();
      
      if (result.fixes && result.fixes.length > 0) {
        toast.success('Cart updated to available stock');
        await loadCart();
        window.dispatchEvent(new Event('cart-updated'));
      } else {
        toast.info('No fixes needed');
      }
    } catch (error) {
      console.error('Error auto-fixing cart:', error);
      toast.error('Failed to update cart');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveOutOfStock = async () => {
    setUpdating(true);
    try {
      const result = await api.cart.removeOutOfStock();
      
      if (result.removed_count > 0) {
        toast.success(`${result.removed_count} out of stock items removed`);
        await loadCart();
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch (error) {
      console.error('Error removing items:', error);
      toast.error('Failed to remove items');
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    // Check if there are out of stock items
    const hasOutOfStock = cart.items.some(item => !item.in_stock);
    
    if (hasOutOfStock) {
      toast.error('Please remove out of stock items before checkout');
      return;
    }
    
    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };

  // Helper function to safely format price
  const formatPrice = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="btn-shop">
          Start Shopping
        </Link>
      </div>
    );
  }

  const outOfStockItems = cart.items.filter(item => !item.in_stock);
  const inStockItems = cart.items.filter(item => item.in_stock);
  const subtotal = inStockItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>
      
      {showOutOfStockWarning && (
        <div className="out-of-stock-warning">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h3>Some items are out of stock</h3>
            <p>
              {outOfStockItems.length} item(s) in your cart are no longer available.
              Please remove them or update quantities to proceed.
            </p>
            <div className="warning-actions">
              <button 
                onClick={handleAutoFixCart}
                className="btn-fix"
                disabled={updating}
              >
                {updating ? 'Fixing...' : 'Auto-Fix Quantities'}
              </button>
              <button 
                onClick={handleRemoveOutOfStock}
                className="btn-remove-all"
                disabled={updating}
              >
                {updating ? 'Removing...' : 'Remove All Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="cart-grid">
        {/* Cart Items */}
        <div className="cart-items">
          {/* Out of Stock Items */}
          {outOfStockItems.length > 0 && (
            <div className="out-of-stock-section">
              <h3>⚠️ Out of Stock Items</h3>
              {outOfStockItems.map(item => (
                <div key={item.id} className="cart-item out-of-stock">
                  <div className="item-image">
                    <img 
                      src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'} 
                      alt={item.name || 'Product'} 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.name || 'Unknown Product'}</h4>
                    <p className="item-price">${formatPrice(item.price)}</p>
                    <div className="item-warning">
                      <span className="warning-badge">Out of Stock</span>
                      <span className="stock-info">
                        Available: {item.available_stock || 0}
                      </span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="btn-remove"
                      disabled={updating}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* In Stock Items */}
          {inStockItems.length > 0 && (
            <div className="in-stock-section">
              <h3> Available Items</h3>
              {inStockItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'} 
                      alt={item.name || 'Product'}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.name || 'Unknown Product'}</h4>
                    <p className="item-price">ETB{formatPrice(item.price)}</p>
                    {item.original_price > item.price && (
                      <p className="item-original-price">
                        <s>ETB{formatPrice(item.original_price)}</s>
                      </p>
                    )}
                    {item.stock > 0 && item.stock <= 5 && (
                      <span className="low-stock-badge">Only {item.stock} left!</span>
                    )}
                  </div>
                  <div className="item-quantity">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updating}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock || updating}
                    >
                      +
                    </button>
                    {item.quantity >= item.stock && (
                      <span className="max-stock">Max</span>
                    )}
                  </div>
                  <div className="item-total">
                    ETB{formatPrice(item.price * item.quantity)}
                  </div>
                  <div className="item-actions">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="btn-remove"
                      disabled={updating}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-row">
            <span>Subtotal ({inStockItems.length} items)</span>
            <span>ETB{formatPrice(subtotal)}</span>
          </div>
          
          {outOfStockItems.length > 0 && (
            <div className="summary-row warning">
              <span>Out of stock items</span>
              <span>{outOfStockItems.length} item(s)</span>
            </div>
          )}
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          
          <div className="summary-total">
            <span>Total</span>
            <span>ETB{formatPrice(subtotal)}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="btn-checkout"
            disabled={inStockItems.length === 0 || updating}
          >
            {inStockItems.length === 0 
              ? 'No Items Available' 
              : updating ? 'Processing...' : 'Proceed to Checkout'
            }
          </button>

          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>

          <div className="secure-checkout">
            <span>🔒</span> Secure Checkout
          </div>
        </div>
      </div>
    </div>
  );
}