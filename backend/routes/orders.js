const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Create order - COMPLETELY FIXED VERSION
router.post('/', auth, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { 
      shipping_address_id, 
      payment_method = 'chapa',
      notes 
    } = req.body;
    
    const userId = req.user.id;
    
    console.log('Creating order for user:', userId, 'with address:', shipping_address_id);
    console.log('Payment method:', payment_method);
    
    // Validate required fields
    if (!shipping_address_id) {
      await connection.rollback();
      return res.status(400).json({ message: 'Shipping address is required' });
    }
    
    if (!payment_method) {
      await connection.rollback();
      return res.status(400).json({ message: 'Payment method is required' });
    }
    
    // Validate shipping address
    const [address] = await connection.query(
      'SELECT * FROM addresses WHERE id = ? AND user_id = ?', 
      [shipping_address_id, userId]
    );
    
    if (!address.length) {
      await connection.rollback();
      return res.status(400).json({ message: 'Invalid shipping address' });
    }
    
    // Get cart items with product details
    const [cartItems] = await connection.query(
      `SELECT c.*, p.name, p.base_price, p.sale_price, p.stock_quantity, p.seller_id, p.sku
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
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
          message: `Insufficient stock for ${item.name}. Available: ${item.stock_quantity}`,
          item: item.name,
          available: item.stock_quantity,
          requested: item.quantity
        });
      }
    }
    
    // Generate order number
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderNumber = `ORD-${timestamp}-${random}`;
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.sale_price || item.base_price);
      return sum + (price * item.quantity);
    }, 0);
    
    const shippingCost = 5.00; // Default shipping cost
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + shippingCost + tax;
    
    console.log('Order totals:', { subtotal, shippingCost, tax, total });
    
    // Get seller_id from first product (all products must have same seller for the order)
    const sellerId = cartItems[0]?.seller_id || null;
    
    // Insert order with ALL required fields
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (user_id, seller_id, order_number, subtotal, shipping_cost, tax, total, 
        status, payment_status, payment_method, shipping_address_id, notes, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userId, 
        sellerId,
        orderNumber, 
        subtotal.toFixed(2), 
        shippingCost.toFixed(2), 
        tax.toFixed(2), 
        total.toFixed(2), 
        'pending', 
        'pending', 
        payment_method,
        shipping_address_id, 
        notes || null
      ]
    );
    
    const orderId = orderResult.insertId;
    
    // Create order items - FIXED with correct column names from your table
    for (const item of cartItems) {
      const unitPrice = parseFloat(item.sale_price || item.base_price);
      const totalPrice = unitPrice * item.quantity;
      
      await connection.query(
        `INSERT INTO order_items 
         (order_id, product_id, product_name, sku, quantity, unit_price, total_price, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          orderId, 
          item.product_id,
          item.name,                    // product_name
          item.sku || null,              // sku (if available)
          item.quantity, 
          unitPrice.toFixed(2),          // unit_price
          totalPrice.toFixed(2)           // total_price
        ]
      );
      
      // Update stock
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }
    
    // Clear cart
    await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);
    
    await connection.commit();
    
    console.log('Order created successfully with ID:', orderId);
    
    res.status(201).json({ 
      success: true,
      message: 'Order created successfully', 
      id: orderId,
      order_number: orderNumber,
      total: total.toFixed(2)
    });
    
  } catch (err) {
    await connection.rollback();
    console.error('Create order error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Failed to create order' 
    });
  } finally {
    connection.release();
  }
});

// Get user's orders
router.get('/my', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, order_number, status, total, 
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

// Get single order - FIXED VERSION
router.get('/:id', auth, async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, 
              a.address_line1, a.address_line2, a.city, a.state, a.postal_code, a.country, a.phone
       FROM orders o
       LEFT JOIN addresses a ON o.shipping_address_id = a.id
       WHERE o.id = ? AND o.user_id = ?`, 
      [req.params.id, req.user.id]
    );
    
    if (!orders.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // FIX: Use pool.query, not connection.query
    const [items] = await pool.query(
      `SELECT oi.*, p.name, p.slug 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`, 
      [req.params.id]
    );
    
    res.json({ 
      ...orders[0], 
      items
    });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ message: err.message });
  }
});



// Cancel order - FIXED VERSION
router.patch('/:id/cancel', auth, async (req, res) => {
  const connection = await pool.getConnection(); // Define connection here
  try {
    await connection.beginTransaction();
    
    const [orders] = await connection.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    
    if (!orders.length) {
      await connection.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    
    if (order.status !== 'pending') {
      await connection.rollback();
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }
    
    await connection.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      ['cancelled', req.params.id]
    );
    
    const [items] = await connection.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [req.params.id]
    );
    
    for (const item of items) {
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }
    
    await connection.commit();
    
    res.json({ 
      success: true,
      message: 'Order cancelled successfully' 
    });
    
  } catch (err) {
    await connection.rollback();
    console.error('Cancel order error:', err);
    res.status(500).json({ message: err.message });
  } finally {
    connection.release();
  }
});



// Track order
router.get('/:id/track', auth, async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT status, created_at, updated_at FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    
    if (!orders.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(orders[0]);
  } catch (err) {
    console.error('Track order error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;