

// const express = require('express');
// const pool = require('../config/db');
// const { auth } = require('../middleware/auth');
// const crypto = require('crypto');

// const router = express.Router();
// const CHAPA_SECRET = process.env.CHAPA_SECRET_KEY;
// const CHAPA_BASE = process.env.CHAPA_BASE_URL || 'https://api.chapa.co/v1';

// // Initialize Chapa payment
// router.post('/initialize', auth, async (req, res) => {
//   try {
//     const { order_id, return_url, cancel_url } = req.body;
    
//     if (!order_id) {
//       return res.status(400).json({ message: 'Order ID is required' });
//     }
    
//     const [orders] = await pool.query(
//       'SELECT * FROM orders WHERE id = ? AND user_id = ?', 
//       [order_id, req.user.id]
//     );
    
//     if (!orders.length) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
    
//     const order = orders[0];
    
//     if (order.payment_status === 'paid') {
//       return res.status(400).json({ message: 'Order already paid' });
//     }
    
//     const tx_ref = 'chapa-' + order.order_number + '-' + Date.now();
    
//     await pool.query(
//       'UPDATE orders SET chapa_txn_ref = ? WHERE id = ?', 
//       [tx_ref, order.id]
//     );
    
//     // Demo mode if no Chapa secret
//     if (!CHAPA_SECRET) {
//       return res.json({
//         message: 'Payment gateway not configured. Using demo mode.',
//         demo: true,
//         order_id: order.id,
//         tx_ref,
//         checkout_url: return_url || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.id}`,
//       });
//     }
    
//     const response = await fetch(CHAPA_BASE + '/transaction/initialize', {
//       method: 'POST',
//       headers: {
//         'Authorization': 'Bearer ' + CHAPA_SECRET,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         amount: order.total,
//         currency: 'ETB',
//         email: req.user.email,
//         first_name: req.user.first_name,
//         last_name: req.user.last_name,
//         tx_ref,
//         return_url: return_url || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.id}`,
//         cancel_url: cancel_url || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cart`,
//         callback_url: process.env.BACKEND_URL + '/api/payment/webhook',
//       }),
//     });
    
//     const data = await response.json();
    
//     if (data.status !== 'success') {
//       return res.status(400).json({ message: data.message || 'Failed to initialize payment' });
//     }
    
//     // Log payment initialization
//     await pool.query(
//       `INSERT INTO payment_logs 
//        (order_id, chapa_txn_ref, amount, status, raw_response) 
//        VALUES (?, ?, ?, ?, ?)`,
//       [order.id, tx_ref, order.total, 'initialized', JSON.stringify(data)]
//     );
    
//     res.json({ 
//       checkout_url: data.data?.checkout_url, 
//       tx_ref, 
//       order_id: order.id 
//     });
//   } catch (err) {
//     console.error('Payment initialization error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Chapa webhook
// router.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
//   try {
//     const event = req.body;
//     const tx_ref = event?.tx_ref;
    
//     if (!tx_ref) {
//       return res.status(400).send('Bad request');
//     }
    
//     const [orders] = await pool.query(
//       'SELECT id FROM orders WHERE chapa_txn_ref = ?', 
//       [tx_ref]
//     );
    
//     if (orders.length && event?.status === 'success') {
//       await pool.query(
//         'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
//         ['paid', 'confirmed', orders[0].id]
//       );
      
//       await pool.query(
//         `INSERT INTO payment_logs 
//          (order_id, chapa_txn_ref, status, raw_response) 
//          VALUES (?, ?, ?, ?)`,
//         [orders[0].id, tx_ref, 'success', JSON.stringify(event)]
//       );
//     }
    
//     res.status(200).send('OK');
//   } catch (err) {
//     console.error('Webhook error:', err);
//     res.status(500).send('Error');
//   }
// });

// module.exports = router;



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

// Verify payment status
router.get('/verify/:tx_ref', auth, async (req, res) => {
  try {
    const { tx_ref } = req.params;
    
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE chapa_txn_ref = ? AND user_id = ?',
      [tx_ref, req.user.id]
    );
    
    if (!orders.length) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    const order = orders[0];
    
    // If no Chapa secret, return demo verification
    if (!CHAPA_SECRET_KEY) {
      return res.json({
        demo: true,
        status: order.payment_status,
        order: order
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
    
    if (data.status === 'success') {
      await pool.query(
        'UPDATE orders SET payment_status = ? WHERE id = ?',
        ['paid', order.id]
      );
    }
    
    res.json({
      verified: data.status === 'success',
      status: order.payment_status,
      data: data
    });
    
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Initialize Chapa payment
router.post('/initialize', auth, async (req, res) => {
  try {
    const { order_id, return_url, cancel_url } = req.body;
    
    if (!order_id) {
      return res.status(400).json({ message: 'Order ID is required' });
    }
    
    // Get order details
    const [orders] = await pool.query(
      `SELECT o.*, u.email, u.first_name, u.last_name 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ? AND o.user_id = ?`,
      [order_id, req.user.id]
    );
    
    if (!orders.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Check if already paid
    if (order.payment_status === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }
    
    // Generate transaction reference
    const tx_ref = generateTxRef(order.order_number || order.id);
    
    // Update order with transaction reference
    await pool.query(
      'UPDATE orders SET chapa_txn_ref = ? WHERE id = ?',
      [tx_ref, order.id]
    );
    
    // DEMO MODE - if no Chapa secret configured
    if (!CHAPA_SECRET_KEY) {
      console.log('⚠️ Chapa secret not configured. Running in demo mode.');
      
      // Log demo payment
      await pool.query(
        `INSERT INTO payment_logs 
         (order_id, chapa_txn_ref, amount, status, raw_response) 
         VALUES (?, ?, ?, ?, ?)`,
        [order.id, tx_ref, order.total, 'demo', JSON.stringify({ demo: true })]
      );
      
      return res.json({
        demo: true,
        message: 'Payment gateway not configured. Using demo mode.',
        order_id: order.id,
        tx_ref,
        checkout_url: return_url || `${FRONTEND_URL}/orders/${order.id}`,
        // For demo, automatically mark as paid after 3 seconds (simulate payment)
        auto_confirm: true,
        confirm_delay: 3000
      });
    }
    
    // PRODUCTION MODE - Call Chapa API
    const response = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: order.total,
        currency: 'ETB',
        email: order.email,
        first_name: order.first_name,
        last_name: order.last_name,
        tx_ref: tx_ref,
        callback_url: `${BACKEND_URL}/api/payment/webhook`,
        return_url: return_url || `${FRONTEND_URL}/orders/${order.id}`,
        cancel_url: cancel_url || `${FRONTEND_URL}/cart`,
        customization: {
          title: 'E-Commerce Payment',
          description: `Payment for order #${order.order_number || order.id}`
        }
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok || data.status !== 'success') {
      throw new Error(data.message || 'Failed to initialize payment');
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

// Chapa webhook (for production)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Verify webhook signature (optional but recommended)
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
    
    // Always return 200 to acknowledge receipt
    res.status(200).send('OK');
    
  } catch (err) {
    console.error('Webhook error:', err);
    // Still return 200 to prevent Chapa from retrying
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
      return res.status(404).json({ message: 'Order not found' });
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
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;