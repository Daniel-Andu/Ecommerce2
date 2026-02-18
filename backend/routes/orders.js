const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { 
      shipping_address_id, 
      shipping_method = 'standard',
      payment_method = 'chapa',
      cart_session_id 
    } = req.body;
    
    const userId = req.user.id;
    
    // Validate shipping address
    const [address] = await connection.query(
      'SELECT * FROM addresses WHERE id = ? AND user_id = ?', 
      [shipping_address_id, userId]
    );
    
    if (!address.length) {
      await connection.rollback();
      return res.status(400).json({ message: 'Invalid shipping address' });
    }
    
    // Get cart
    let cartId;
    if (cart_session_id) {
      const [cartRows] = await connection.query(
        'SELECT id FROM carts WHERE session_id = ?', 
        [cart_session_id]
      );
      cartId = cartRows[0]?.id;
    } else {
      const [cartRows] = await connection.query(
        'SELECT id FROM carts WHERE user_id = ?', 
        [userId]
      );
      cartId = cartRows[0]?.id;
    }
    
    if (!cartId) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Get cart items with product details
    const [cartItems] = await connection.query(
      `SELECT ci.id, ci.product_id, ci.variant_id, ci.quantity, 
              p.name, p.sku, p.base_price, p.sale_price, p.seller_id,
              p.stock_quantity
       FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    
    if (!cartItems.length) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Check stock availability
    for (const item of cartItems) {
      if (item.quantity > item.stock_quantity) {
        await connection.rollback();
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.name}. Available: ${item.stock_quantity}` 
        });
      }
    }
    
    // Generate order number
    const orderNumber = 'ORD-' + Date.now() + '-' + 
                        Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.sale_price || item.base_price);
      return sum + (price * item.quantity);
    }, 0);
    
    const shippingCost = shipping_method === 'express' ? 10.00 : 5.00;
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + shippingCost + tax;
    
    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (order_number, user_id, status, subtotal, shipping_cost, tax, total, 
        shipping_address_id, shipping_method, payment_method, payment_status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        orderNumber, 
        userId, 
        'pending', 
        subtotal, 
        shippingCost, 
        tax, 
        total,
        shipping_address_id, 
        shipping_method, 
        payment_method, 
        'pending'
      ]
    );
    
    const orderId = orderResult.insertId;
    
    // Create order items and update stock
    for (const item of cartItems) {
      const unitPrice = parseFloat(item.sale_price || item.base_price);
      const totalPrice = unitPrice * item.quantity;
      
      await connection.query(
        `INSERT INTO order_items 
         (order_id, product_id, variant_id, product_name, sku, quantity, unit_price, total_price, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          orderId, 
          item.product_id, 
          item.variant_id, 
          item.name, 
          item.sku, 
          item.quantity, 
          unitPrice, 
          totalPrice
        ]
      );
      
      // Update stock
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }
    
    // Clear cart
    await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    await connection.query('DELETE FROM carts WHERE id = ?', [cartId]);
    
    await connection.commit();
    
    // Get the created order
    const [order] = await connection.query(
      'SELECT * FROM orders WHERE id = ?', 
      [orderId]
    );
    
    res.status(201).json({ 
      success: true,
      message: 'Order placed successfully', 
      order: order[0] 
    });
    
  } catch (err) {
    await connection.rollback();
    console.error('Create order error:', err);
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
});

// Get user's orders
router.get('/my', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, order_number, status, subtotal, shipping_cost, tax, total, 
              payment_status, payment_method, created_at 
       FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get my orders error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?', 
      [req.params.id, req.user.id]
    );
    
    if (!orders.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const [items] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?', 
      [req.params.id]
    );
    
    const [address] = await pool.query(
      'SELECT * FROM addresses WHERE id = ?', 
      [orders[0].shipping_address_id]
    );
    
    res.json({ 
      ...orders[0], 
      items, 
      address: address[0] || null 
    });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


