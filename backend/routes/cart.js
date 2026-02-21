const express = require('express');
const pool = require('../config/db');
const { auth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Get cart items
router.get('/', optionalAuth, async (req, res) => {
  try {
    let cartItems = [];
    
    if (req.user) {
      // Logged in user - get from database
      const [rows] = await pool.query(
        `SELECT c.*, 
                p.id as product_id,
                p.name, 
                p.base_price, 
                p.sale_price, 
                p.stock_quantity,
                p.status, 
                p.slug,
                p.is_active
         FROM cart c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = ?`,
        [req.user.id]
      );
      cartItems = rows;
    } else {
      // Guest user - get from session
      const sessionId = req.headers['x-cart-session'];
      if (sessionId) {
        const [rows] = await pool.query(
          `SELECT c.*, 
                  p.id as product_id,
                  p.name, 
                  p.base_price, 
                  p.sale_price, 
                  p.stock_quantity,
                  p.status, 
                  p.slug,
                  p.is_active
           FROM cart_sessions c
           JOIN products p ON c.product_id = p.id
           WHERE c.session_id = ?`,
          [sessionId]
        );
        cartItems = rows;
      }
    }
    
    // Get images for each product - FIXED: removed is_primary, using sort_order
    const items = await Promise.all(cartItems.map(async (item) => {
      // Get the primary image (lowest sort_order) for this product
      const [images] = await pool.query(
        `SELECT image_url, alt_text 
         FROM product_images 
         WHERE product_id = ? 
         ORDER BY sort_order ASC, id ASC 
         LIMIT 1`,
        [item.product_id]
      );
      
      const image = images.length > 0 ? images[0].image_url : null;
      
      return {
        id: item.id,
        product_id: item.product_id,
        name: item.name || 'Unknown Product',
        price: parseFloat(item.sale_price || item.base_price || 0),
        original_price: parseFloat(item.base_price || 0),
        quantity: item.quantity || 1,
        image: image,
        stock: item.stock_quantity || 0,
        slug: item.slug || '',
        in_stock: (item.stock_quantity || 0) >= (item.quantity || 1),
        available_stock: item.stock_quantity || 0,
        status: item.status,
        is_active: item.is_active
      };
    }));
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const outOfStockCount = items.filter(item => !item.in_stock).length;
    
    res.json({
      items,
      subtotal: parseFloat(subtotal),
      total: parseFloat(subtotal),
      item_count: items.length,
      out_of_stock_count: outOfStockCount,
      has_out_of_stock: outOfStockCount > 0
    });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add item to cart
router.post('/items', optionalAuth, async (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  
  if (!product_id) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check if product exists and has stock
    const [products] = await connection.query(
      `SELECT id, name, stock_quantity, status, is_active 
       FROM products 
       WHERE id = ?`,
      [product_id]
    );

    if (products.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];

    // Check if product is available
    if (product.status !== 'approved') {
      await connection.rollback();
      return res.status(400).json({ message: 'Product is not approved for sale' });
    }

    if (!product.is_active) {
      await connection.rollback();
      return res.status(400).json({ message: 'Product is not active' });
    }

    if (product.stock_quantity < quantity) {
      await connection.rollback();
      return res.status(400).json({ 
        message: `Only ${product.stock_quantity} items available in stock` 
      });
    }

    if (req.user) {
      // Logged in user - add to database cart
      const [existing] = await connection.query(
        'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
        [req.user.id, product_id]
      );

      if (existing.length > 0) {
        // Update existing cart item
        const newQuantity = existing[0].quantity + quantity;
        if (newQuantity > product.stock_quantity) {
          await connection.rollback();
          return res.status(400).json({ 
            message: `Cannot add more than ${product.stock_quantity} items` 
          });
        }
        await connection.query(
          'UPDATE cart SET quantity = ? WHERE id = ?',
          [newQuantity, existing[0].id]
        );
      } else {
        // Insert new cart item
        await connection.query(
          'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
          [req.user.id, product_id, quantity]
        );
      }
    } else {
      // Guest user - use session
      const sessionId = req.headers['x-cart-session'];
      if (!sessionId) {
        await connection.rollback();
        return res.status(400).json({ message: 'Cart session required' });
      }

      const [existing] = await connection.query(
        'SELECT id, quantity FROM cart_sessions WHERE session_id = ? AND product_id = ?',
        [sessionId, product_id]
      );

      if (existing.length > 0) {
        // Update existing cart item
        const newQuantity = existing[0].quantity + quantity;
        if (newQuantity > product.stock_quantity) {
          await connection.rollback();
          return res.status(400).json({ 
            message: `Cannot add more than ${product.stock_quantity} items` 
          });
        }
        await connection.query(
          'UPDATE cart_sessions SET quantity = ? WHERE id = ?',
          [newQuantity, existing[0].id]
        );
      } else {
        // Insert new cart item
        await connection.query(
          'INSERT INTO cart_sessions (session_id, product_id, quantity) VALUES (?, ?, ?)',
          [sessionId, product_id, quantity]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    await connection.rollback();
    console.error('Add to cart error:', err);
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
});

// Update cart item quantity
router.patch('/items/:id', optionalAuth, async (req, res) => {
  const { quantity } = req.body;
  const itemId = req.params.id;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let cartItem;
    if (req.user) {
      [cartItem] = await connection.query(
        `SELECT c.*, p.stock_quantity 
         FROM cart c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.id = ? AND c.user_id = ?`,
        [itemId, req.user.id]
      );
    } else {
      const sessionId = req.headers['x-cart-session'];
      if (!sessionId) {
        await connection.rollback();
        return res.status(400).json({ message: 'Cart session required' });
      }
      [cartItem] = await connection.query(
        `SELECT c.*, p.stock_quantity 
         FROM cart_sessions c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.id = ? AND c.session_id = ?`,
        [itemId, sessionId]
      );
    }

    if (!cartItem || cartItem.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (quantity > cartItem[0].stock_quantity) {
      await connection.rollback();
      return res.status(400).json({ 
        message: `Only ${cartItem[0].stock_quantity} items available` 
      });
    }

    if (req.user) {
      await connection.query(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        [quantity, itemId]
      );
    } else {
      await connection.query(
        'UPDATE cart_sessions SET quantity = ? WHERE id = ?',
        [quantity, itemId]
      );
    }

    await connection.commit();
    res.json({ message: 'Cart updated successfully' });
  } catch (err) {
    await connection.rollback();
    console.error('Update cart error:', err);
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
});

// Remove item from cart
router.delete('/items/:id', optionalAuth, async (req, res) => {
  const itemId = req.params.id;

  try {
    let result;
    if (req.user) {
      [result] = await pool.query(
        'DELETE FROM cart WHERE id = ? AND user_id = ?',
        [itemId, req.user.id]
      );
    } else {
      const sessionId = req.headers['x-cart-session'];
      if (!sessionId) {
        return res.status(400).json({ message: 'Cart session required' });
      }
      [result] = await pool.query(
        'DELETE FROM cart_sessions WHERE id = ? AND session_id = ?',
        [itemId, sessionId]
      );
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Remove cart item error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Check stock status
router.get('/check-stock', optionalAuth, async (req, res) => {
  try {
    let cartItems = [];
    
    if (req.user) {
      const [rows] = await pool.query(
        `SELECT c.*, p.name, p.stock_quantity
         FROM cart c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = ?`,
        [req.user.id]
      );
      cartItems = rows;
    } else {
      const sessionId = req.headers['x-cart-session'];
      if (sessionId) {
        const [rows] = await pool.query(
          `SELECT c.*, p.name, p.stock_quantity
           FROM cart_sessions c
           JOIN products p ON c.product_id = p.id
           WHERE c.session_id = ?`,
          [sessionId]
        );
        cartItems = rows;
      }
    }
    
    const issues = cartItems
      .filter(item => item.stock_quantity < item.quantity)
      .map(item => ({
        product_id: item.product_id,
        name: item.name,
        requested: item.quantity,
        available: item.stock_quantity
      }));
    
    res.json({
      has_issues: issues.length > 0,
      issues: issues
    });
  } catch (err) {
    console.error('Check stock error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Auto-fix cart quantities
router.post('/auto-fix', optionalAuth, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    let cartItems = [];
    const fixes = [];

    if (req.user) {
      const [rows] = await connection.query(
        `SELECT c.id, c.product_id, c.quantity, p.stock_quantity, p.name
         FROM cart c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = ?`,
        [req.user.id]
      );
      cartItems = rows;

      for (const item of cartItems) {
        if (item.stock_quantity < item.quantity) {
          if (item.stock_quantity === 0) {
            await connection.query('DELETE FROM cart WHERE id = ?', [item.id]);
            fixes.push({
              product_id: item.product_id,
              name: item.name,
              action: 'removed',
              reason: 'out of stock'
            });
          } else {
            await connection.query(
              'UPDATE cart SET quantity = ? WHERE id = ?',
              [item.stock_quantity, item.id]
            );
            fixes.push({
              product_id: item.product_id,
              name: item.name,
              action: 'updated',
              old_quantity: item.quantity,
              new_quantity: item.stock_quantity
            });
          }
        }
      }
    } else {
      const sessionId = req.headers['x-cart-session'];
      if (sessionId) {
        const [rows] = await connection.query(
          `SELECT c.id, c.product_id, c.quantity, p.stock_quantity, p.name
           FROM cart_sessions c
           JOIN products p ON c.product_id = p.id
           WHERE c.session_id = ?`,
          [sessionId]
        );
        cartItems = rows;

        for (const item of cartItems) {
          if (item.stock_quantity < item.quantity) {
            if (item.stock_quantity === 0) {
              await connection.query('DELETE FROM cart_sessions WHERE id = ?', [item.id]);
              fixes.push({
                product_id: item.product_id,
                name: item.name,
                action: 'removed',
                reason: 'out of stock'
              });
            } else {
              await connection.query(
                'UPDATE cart_sessions SET quantity = ? WHERE id = ?',
                [item.stock_quantity, item.id]
              );
              fixes.push({
                product_id: item.product_id,
                name: item.name,
                action: 'updated',
                old_quantity: item.quantity,
                new_quantity: item.stock_quantity
              });
            }
          }
        }
      }
    }

    await connection.commit();
    res.json({ 
      message: 'Cart auto-fixed', 
      fixes,
      fixed: fixes.length > 0 
    });
  } catch (err) {
    await connection.rollback();
    console.error('Auto-fix error:', err);
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
});

// Remove out of stock items
router.post('/remove-out-of-stock', optionalAuth, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    let removed = [];

    if (req.user) {
      const [items] = await connection.query(
        `SELECT c.id, p.name
         FROM cart c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = ? AND p.stock_quantity < c.quantity`,
        [req.user.id]
      );

      if (items.length > 0) {
        await connection.query(
          `DELETE c FROM cart c
           JOIN products p ON c.product_id = p.id
           WHERE c.user_id = ? AND p.stock_quantity < c.quantity`,
          [req.user.id]
        );
      }
      removed = items;
    } else {
      const sessionId = req.headers['x-cart-session'];
      if (sessionId) {
        const [items] = await connection.query(
          `SELECT c.id, p.name
           FROM cart_sessions c
           JOIN products p ON c.product_id = p.id
           WHERE c.session_id = ? AND p.stock_quantity < c.quantity`,
          [sessionId]
        );

        if (items.length > 0) {
          await connection.query(
            `DELETE c FROM cart_sessions c
             JOIN products p ON c.product_id = p.id
             WHERE c.session_id = ? AND p.stock_quantity < c.quantity`,
            [sessionId]
          );
        }
        removed = items;
      }
    }

    await connection.commit();
    res.json({ 
      message: 'Out of stock items removed',
      removed_count: removed.length,
      removed_items: removed 
    });
  } catch (err) {
    await connection.rollback();
    console.error('Remove out of stock error:', err);
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
});

module.exports = router;