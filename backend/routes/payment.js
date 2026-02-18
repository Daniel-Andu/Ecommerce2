

const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();
const CHAPA_SECRET = process.env.CHAPA_SECRET_KEY;
const CHAPA_BASE = process.env.CHAPA_BASE_URL || 'https://api.chapa.co/v1';

// Initialize Chapa payment
router.post('/initialize', auth, async (req, res) => {
  try {
    const { order_id, return_url, cancel_url } = req.body;
    
    if (!order_id) {
      return res.status(400).json({ message: 'Order ID is required' });
    }
    
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?', 
      [order_id, req.user.id]
    );
    
    if (!orders.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    
    if (order.payment_status === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }
    
    const tx_ref = 'chapa-' + order.order_number + '-' + Date.now();
    
    await pool.query(
      'UPDATE orders SET chapa_txn_ref = ? WHERE id = ?', 
      [tx_ref, order.id]
    );
    
    // Demo mode if no Chapa secret
    if (!CHAPA_SECRET) {
      return res.json({
        message: 'Payment gateway not configured. Using demo mode.',
        demo: true,
        order_id: order.id,
        tx_ref,
        checkout_url: return_url || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.id}`,
      });
    }
    
    const response = await fetch(CHAPA_BASE + '/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + CHAPA_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: order.total,
        currency: 'ETB',
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        tx_ref,
        return_url: return_url || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.id}`,
        cancel_url: cancel_url || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cart`,
        callback_url: process.env.BACKEND_URL + '/api/payment/webhook',
      }),
    });
    
    const data = await response.json();
    
    if (data.status !== 'success') {
      return res.status(400).json({ message: data.message || 'Failed to initialize payment' });
    }
    
    // Log payment initialization
    await pool.query(
      `INSERT INTO payment_logs 
       (order_id, chapa_txn_ref, amount, status, raw_response) 
       VALUES (?, ?, ?, ?, ?)`,
      [order.id, tx_ref, order.total, 'initialized', JSON.stringify(data)]
    );
    
    res.json({ 
      checkout_url: data.data?.checkout_url, 
      tx_ref, 
      order_id: order.id 
    });
  } catch (err) {
    console.error('Payment initialization error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Chapa webhook
router.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
  try {
    const event = req.body;
    const tx_ref = event?.tx_ref;
    
    if (!tx_ref) {
      return res.status(400).send('Bad request');
    }
    
    const [orders] = await pool.query(
      'SELECT id FROM orders WHERE chapa_txn_ref = ?', 
      [tx_ref]
    );
    
    if (orders.length && event?.status === 'success') {
      await pool.query(
        'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
        ['paid', 'confirmed', orders[0].id]
      );
      
      await pool.query(
        `INSERT INTO payment_logs 
         (order_id, chapa_txn_ref, status, raw_response) 
         VALUES (?, ?, ?, ?)`,
        [orders[0].id, tx_ref, 'success', JSON.stringify(event)]
      );
    }
    
    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('Error');
  }
});

module.exports = router;