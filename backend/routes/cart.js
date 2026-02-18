

const express = require('express');
const pool = require('../config/db');
const { optionalAuth } = require('../middleware/auth');
const crypto = require('crypto');
const router = express.Router();

function getCartIdentifier(req) {
  if (req.user) return { type: 'user', value: req.user.id };
  
  let sessionId = req.headers['x-cart-session'];
  
  if (!sessionId && req.body && req.body.session_id) {
    sessionId = req.body.session_id;
  }
  
  // Generate new session if none exists
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }
  
  return { type: 'session', value: sessionId };
}

async function getOrCreateCart(req) {
  const ident = getCartIdentifier(req);
  let cartId;
  
  if (ident.type === 'user') {
    // Check if user has a cart
    const [rows] = await pool.query(
      'SELECT id FROM carts WHERE user_id = ?', 
      [ident.value]
    );
    
    if (rows.length) {
      cartId = rows[0].id;
    } else {
      // Check if there's a session cart to merge
      const sessionId = req.headers['x-cart-session'];
      if (sessionId) {
        const [sessionCart] = await pool.query(
          'SELECT id FROM carts WHERE session_id = ?', 
          [sessionId]
        );
        
        if (sessionCart.length) {
          // Convert session cart to user cart
          await pool.query(
            'UPDATE carts SET user_id = ?, session_id = NULL WHERE id = ?', 
            [ident.value, sessionCart[0].id]
          );
          cartId = sessionCart[0].id;
        }
      }
      
      if (!cartId) {
        const [result] = await pool.query(
          'INSERT INTO carts (user_id) VALUES (?)', 
          [ident.value]
        );
        cartId = result.insertId;
      }
    }
  } else {
    const [rows] = await pool.query(
      'SELECT id FROM carts WHERE session_id = ?', 
      [ident.value]
    );
    
    if (rows.length) {
      cartId = rows[0].id;
    } else {
      const [result] = await pool.query(
        'INSERT INTO carts (session_id) VALUES (?)', 
        [ident.value]
      );
      cartId = result.insertId;
    }
  }
  
  return { cartId, sessionId: ident.type === 'session' ? ident.value : null };
}

// Get cart contents
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { cartId, sessionId } = await getOrCreateCart(req);
    
    const [items] = await pool.query(
      `SELECT ci.id, ci.product_id, ci.variant_id, ci.quantity, 
              p.name, p.slug, p.base_price, p.sale_price 
       FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    
    let imgMap = {};
    if (items.length) {
      const productIds = items.map(i => i.product_id);
      const [images] = await pool.query(
        'SELECT product_id, image_url FROM product_images WHERE product_id IN (?) ORDER BY sort_order',
        [productIds]
      );
      images.forEach(i => { 
        imgMap[i.product_id] = i.image_url; 
      });
    }
    
    const cartItems = items.map(i => ({
      ...i,
      price: i.sale_price || i.base_price,
      image: imgMap[i.product_id],
      total: (parseFloat(i.sale_price || i.base_price) * i.quantity).toFixed(2)
    }));
    
    const subtotal = cartItems.reduce((sum, i) => sum + parseFloat(i.total), 0);
    
    res.json({ 
      cartId, 
      sessionId, 
      items: cartItems, 
      subtotal: subtotal.toFixed(2) 
    });
  } catch (err) { 
    console.error('Get cart error:', err);
    res.status(500).json({ message: err.message }); 
  }
});

// Add item to cart
router.post('/items', optionalAuth, async (req, res) => {
  try {
    const { cartId, sessionId } = await getOrCreateCart(req);
    const { product_id, variant_id, quantity = 1 } = req.body;
    
    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    // Check if product exists and is approved
    const [product] = await pool.query(
      'SELECT id FROM products WHERE id = ? AND status = ? AND is_active = 1', 
      [product_id, 'approved']
    );
    
    if (!product.length) {
      return res.status(404).json({ message: 'Product not found or unavailable' });
    }
    
    // Check if item already in cart
    const [existing] = await pool.query(
      `SELECT id FROM cart_items 
       WHERE cart_id = ? AND product_id = ? 
       AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))`,
      [cartId, product_id, variant_id || null, variant_id || null]
    );
    
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    
    if (existing.length) {
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', 
        [qty, existing[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)',
        [cartId, product_id, variant_id || null, qty]
      );
    }
    
    res.json({ message: 'Added to cart', sessionId });
  } catch (err) { 
    console.error('Add to cart error:', err);
    res.status(500).json({ message: err.message }); 
  }
});

// Update item quantity
router.patch('/items/:itemId', optionalAuth, async (req, res) => {
  try {
    const { cartId } = await getOrCreateCart(req);
    const quantity = parseInt(req.body.quantity, 10);
    
    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    
    if (quantity === 0) {
      await pool.query(
        'DELETE FROM cart_items WHERE id = ? AND cart_id = ?', 
        [req.params.itemId, cartId]
      );
      return res.json({ message: 'Item removed' });
    }
    
    const [result] = await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND cart_id = ?', 
      [quantity, req.params.itemId, cartId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Cart updated' });
  } catch (err) { 
    console.error('Update cart error:', err);
    res.status(500).json({ message: err.message }); 
  }
});

// Remove item from cart
router.delete('/items/:itemId', optionalAuth, async (req, res) => {
  try {
    const { cartId } = await getOrCreateCart(req);
    
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE id = ? AND cart_id = ?', 
      [req.params.itemId, cartId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item removed' });
  } catch (err) { 
    console.error('Remove cart item error:', err);
    res.status(500).json({ message: err.message }); 
  }
});

module.exports = router;