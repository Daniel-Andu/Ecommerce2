const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const CHAPA_BASE_URL = process.env.CHAPA_BASE_URL || 'https://api.chapa.co/v1';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Helper function to generate unique transaction reference
const generateTxRef = (orderNumber) => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  return `tx-${orderNumber}-${timestamp}-${random}`;
};

// Initialize Chapa payment - FIXED VERSION
router.post('/initialize', auth, async (req, res) => {
  try {
    const { order_id } = req.body; // Only need order_id, rest comes from database
    
    console.log('Payment initialization request:', { order_id, user_id: req.user.id });
    
    if (!order_id) {
      return res.status(400).json({ 
        success: false,
        message: 'Order ID is required' 
      });
    }
    
    // Get order details with user info
    const [orders] = await pool.query(
      `SELECT o.*, u.email, u.first_name, u.last_name, u.phone 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ? AND o.user_id = ?`,
      [order_id, req.user.id]
    );
    
    if (!orders.length) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    const order = orders[0];
    
    // Check if already paid
    if (order.payment_status === 'paid') {
      return res.status(400).json({ 
        success: false,
        message: 'Order already paid' 
      });
    }
    
    // FIX 1: Check if amount exceeds Chapa limit (1,000,000 ETB)
    if (order.total > 1000000) {
      return res.status(400).json({
        success: false,
        message: `Order total ${order.total} ETB exceeds Chapa's maximum limit of 1,000,000 ETB. Please split your order into multiple payments or reduce cart total.`
      });
    }
    
    // Generate transaction reference
    const tx_ref = generateTxRef(order.order_number || order.id);
    
    // Create payment_logs table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        chapa_txn_ref VARCHAR(255),
        amount DECIMAL(10,2),
        status VARCHAR(50),
        raw_response JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_order_id (order_id),
        INDEX idx_txn_ref (chapa_txn_ref)
      )
    `);
    
    // Update order with transaction reference
    await pool.query(
      'UPDATE orders SET chapa_txn_ref = ? WHERE id = ?',
      [tx_ref, order.id]
    );
    
    // DEMO MODE - if no Chapa secret configured
    if (!CHAPA_SECRET_KEY || CHAPA_SECRET_KEY === 'your_chapa_secret_key_here') {
      console.log('⚠️ Running in demo mode - no Chapa API key');
      
      // Log demo payment
      await pool.query(
        `INSERT INTO payment_logs 
         (order_id, chapa_txn_ref, amount, status, raw_response) 
         VALUES (?, ?, ?, ?, ?)`,
        [order.id, tx_ref, order.total, 'demo', JSON.stringify({ demo: true })]
      );
      
      // In demo mode, automatically mark as paid after 3 seconds
      setTimeout(async () => {
        try {
          await pool.query(
            'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
            ['paid', 'confirmed', order.id]
          );
          console.log(`✅ Demo payment confirmed for order ${order.id}`);
        } catch (err) {
          console.error('Demo payment confirmation error:', err);
        }
      }, 3000);
      
      return res.json({
        success: true,
        demo: true,
        message: 'Demo mode - payment simulated',
        order_id: order.id,
        tx_ref: tx_ref,
        checkout_url: `${FRONTEND_URL}/order-confirmation/${order.id}?demo=true`
      });
    }
    
    // PRODUCTION MODE - Call Chapa API
    console.log('Calling Chapa API for payment initialization...');
    
    // FIX 2 & 3: Format title and description properly
    // Title: max 16 chars, only letters/numbers/spaces
    const orderNumber = order.order_number || `ORD-${order.id}`;
    const title = `Order ${orderNumber.substring(0, 10)}`; // Truncate to max 16 chars
    
    // Description: only letters, numbers, hyphens, underscores, spaces, dots
    const description = `Payment for order ${orderNumber}`.replace(/[^a-zA-Z0-9\s\-_\.]/g, '');
    
    const response = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: order.total.toString(),
        currency: 'ETB',
        email: order.email,
        first_name: order.first_name || 'Customer',
        last_name: order.last_name || '',
        tx_ref: tx_ref,
        callback_url: `${BACKEND_URL}/api/payment/webhook`,
        return_url: `${FRONTEND_URL}/order-confirmation/${order.id}`,
        customization: {
          title: title, // Now under 16 chars
          description: description // Now only valid characters
        }
      }),
    });
    
    const data = await response.json();
    console.log('Chapa API response:', data);
    
    if (!response.ok || data.status !== 'success') {
      // FIX: Better error handling
      const errorMessage = data.message || 'Failed to initialize payment';
      console.error('Chapa API error:', errorMessage);
      throw new Error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
    }
    
    // Log successful initialization
    await pool.query(
      `INSERT INTO payment_logs 
       (order_id, chapa_txn_ref, amount, status, raw_response) 
       VALUES (?, ?, ?, ?, ?)`,
      [order.id, tx_ref, order.total, 'initialized', JSON.stringify(data)]
    );
    
    res.json({
      success: true,
      checkout_url: data.data?.checkout_url,
      tx_ref: tx_ref,
      order_id: order.id
    });
    
  } catch (err) {
    console.error('Payment initialization error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message || 'Failed to initialize payment'
    });
  }
});

// Verify payment status
router.get('/verify/:tx_ref', auth, async (req, res) => {
  try {
    const { tx_ref } = req.params;
    
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE chapa_txn_ref = ? AND user_id = ?',
      [tx_ref, req.user.id]
    );
    
    if (!orders.length) {
      return res.status(404).json({ 
        success: false,
        message: 'Transaction not found' 
      });
    }
    
    const order = orders[0];
    
    // If no Chapa secret, return demo verification
    if (!CHAPA_SECRET_KEY || CHAPA_SECRET_KEY === 'your_chapa_secret_key_here') {
      return res.json({
        success: true,
        demo: true,
        status: order.payment_status,
        order: {
          id: order.id,
          order_number: order.order_number,
          total: order.total,
          payment_status: order.payment_status
        }
      });
    }
    
    // Verify with Chapa API
    const response = await fetch(`${CHAPA_BASE_URL}/transaction/verify/${tx_ref}`, {
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (data.status === 'success' && order.payment_status !== 'paid') {
      await pool.query(
        'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
        ['paid', 'confirmed', order.id]
      );
    }
    
    res.json({
      success: true,
      verified: data.status === 'success',
      status: order.payment_status,
      data: data
    });
    
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

// Chapa webhook (for production)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-chapa-signature'];
    const payload = req.body.toString();
    
    // Parse the webhook data
    const event = JSON.parse(payload);
    const tx_ref = event?.tx_ref;
    
    if (!tx_ref) {
      return res.status(400).json({ message: 'Invalid webhook data' });
    }
    
    console.log('Received webhook for transaction:', tx_ref);
    
    // Find the order
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE chapa_txn_ref = ?',
      [tx_ref]
    );
    
    if (orders.length) {
      const order = orders[0];
      
      // Update payment status based on webhook
      if (event?.status === 'success' || event?.event === 'charge.success') {
        await pool.query(
          'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
          ['paid', 'confirmed', order.id]
        );
        
        // Log success
        await pool.query(
          `INSERT INTO payment_logs 
           (order_id, chapa_txn_ref, amount, status, raw_response) 
           VALUES (?, ?, ?, ?, ?)`,
          [order.id, tx_ref, order.total, 'success', JSON.stringify(event)]
        );
        
        console.log(`✅ Payment confirmed for order ${order.id}`);
      }
    }
    
    res.status(200).send('OK');
    
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(200).send('OK');
  }
});

// Manual payment confirmation (for demo mode)
router.post('/confirm/:order_id', auth, async (req, res) => {
  try {
    const { order_id } = req.params;
    
    // Verify order belongs to user
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [order_id, req.user.id]
    );
    
    if (!orders.length) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    // Update payment status
    await pool.query(
      'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
      ['paid', 'confirmed', order_id]
    );
    
    // Log confirmation
    await pool.query(
      `INSERT INTO payment_logs 
       (order_id, status, raw_response) 
       VALUES (?, ?, ?)`,
      [order_id, 'manual_confirmation', JSON.stringify({ user: req.user.id })]
    );
    
    res.json({
      success: true,
      message: 'Payment confirmed manually'
    });
    
  } catch (err) {
    console.error('Manual confirmation error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

// Get payment status for an order
router.get('/status/:order_id', auth, async (req, res) => {
  try {
    const { order_id } = req.params;
    
    const [orders] = await pool.query(
      'SELECT id, order_number, total, payment_status, chapa_txn_ref FROM orders WHERE id = ? AND user_id = ?',
      [order_id, req.user.id]
    );
    
    if (!orders.length) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    const order = orders[0];
    
    // Get latest payment log
    const [logs] = await pool.query(
      'SELECT * FROM payment_logs WHERE order_id = ? ORDER BY created_at DESC LIMIT 1',
      [order_id]
    );
    
    res.json({
      success: true,
      order: order,
      payment: logs[0] || null,
      status: order.payment_status
    });
    
  } catch (err) {
    console.error('Payment status error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
});

// TEMPORARY DEBUG ENDPOINT - Add this to check your setup
router.get('/debug/check/:order_id', auth, async (req, res) => {
  try {
    const { order_id } = req.params;
    const userId = req.user.id;
    
    console.log('🔍 Debug: Checking order', order_id, 'for user', userId);
    
    // Check if order exists
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [order_id, userId]
    );
    
    // Check payment_logs table
    const [logsTable] = await pool.query("SHOW TABLES LIKE 'payment_logs'");
    
    // Get all orders columns
    const [columns] = await pool.query("SHOW COLUMNS FROM orders");
    
    // Check if chapa_txn_ref column exists
    const hasChapaColumn = columns.some(col => col.Field === 'chapa_txn_ref');
    
    // Get environment variables (without exposing secrets)
    const chapaKeyExists = !!process.env.CHAPA_SECRET_KEY;
    const chapaKeyValid = process.env.CHAPA_SECRET_KEY && 
                         process.env.CHAPA_SECRET_KEY !== 'your_chapa_secret_key_here' &&
                         process.env.CHAPA_SECRET_KEY.startsWith('CHASECK_');
    
    res.json({
      success: true,
      order: orders[0] || null,
      order_exists: orders.length > 0,
      payment_logs_table_exists: logsTable.length > 0,
      chapa_txn_ref_column_exists: hasChapaColumn,
      chapa_key_configured: chapaKeyExists,
      chapa_key_valid: chapaKeyValid,
      user_id: userId,
      order_id: order_id,
      chapa_limit_check: orders[0] ? {
        order_total: orders[0].total,
        exceeds_limit: orders[0].total > 1000000,
        limit: 1000000
      } : null
    });
    
  } catch (err) {
    console.error('Debug endpoint error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message,
      stack: err.stack 
    });
  }
});

module.exports = router;