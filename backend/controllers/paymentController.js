// backend/controllers/paymentController.js
const db = require('../config/db');
const axios = require('axios');

// Chapa configuration
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const CHAPA_API_URL = process.env.CHAPA_API_URL || 'https://api.chapa.co/v1';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Initialize Chapa payment
exports.initializePayment = async (req, res) => {
  try {
    const { order_id } = req.body;
    
    console.log('Payment initialization request for order:', order_id);
    
    if (!order_id) {
      return res.status(400).json({ 
        success: false,
        message: 'Order ID is required' 
      });
    }

    // Get order details with user info
    const [orders] = await db.query(
      `SELECT o.*, u.email, u.first_name, u.last_name, u.phone 
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ? AND o.user_id = ?`,
      [order_id, req.user.id]
    );

    if (orders.length === 0) {
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

    // Generate unique transaction reference
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const tx_ref = `tx-${order.order_number || order.id}-${timestamp}-${random}`;

    // Create payment_transactions table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        transaction_ref VARCHAR(255) UNIQUE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        INDEX idx_transaction_ref (transaction_ref),
        INDEX idx_order_id (order_id)
      )
    `);

    // Save transaction record
    await db.query(
      `INSERT INTO payment_transactions 
       (order_id, transaction_ref, amount, status) 
       VALUES (?, ?, ?, 'pending')`,
      [order_id, tx_ref, order.total_amount || order.total]
    );

    // Update order with transaction reference
    await db.query(
      'UPDATE orders SET chapa_txn_ref = ? WHERE id = ?',
      [tx_ref, order.id]
    );

    // DEMO MODE - if no Chapa secret key
    if (!CHAPA_SECRET_KEY || CHAPA_SECRET_KEY === 'your_chapa_secret_key_here') {
      console.log('⚠️ Running in DEMO mode - no Chapa API key');
      
      // Simulate successful payment after 3 seconds
      setTimeout(async () => {
        try {
          await db.query(
            'UPDATE payment_transactions SET status = ? WHERE transaction_ref = ?',
            ['completed', tx_ref]
          );
          await db.query(
            'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
            ['paid', 'processing', order.id]
          );
          console.log(`✅ Demo payment completed for order ${order.id}`);
        } catch (err) {
          console.error('Demo payment error:', err);
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
    console.log('Calling Chapa API with key:', CHAPA_SECRET_KEY.substring(0, 10) + '...');

    const paymentData = {
      amount: order.total_amount || order.total,
      currency: 'ETB',
      email: order.email,
      first_name: order.first_name,
      last_name: order.last_name,
      tx_ref: tx_ref,
      callback_url: `${BACKEND_URL}/api/payment/webhook`,
      return_url: `${FRONTEND_URL}/order-confirmation/${order.id}`,
      customization: {
        title: 'E-commerce Payment',
        description: `Payment for order #${order.order_number || order.id}`
      }
    };

    console.log('Payment data:', paymentData);

    const response = await axios.post(`${CHAPA_API_URL}/transaction/initialize`, paymentData, {
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Chapa API response:', response.data);

    if (response.data.status === 'success') {
      // Update transaction with checkout URL
      await db.query(
        'UPDATE payment_transactions SET payment_method = ? WHERE transaction_ref = ?',
        ['chapa', tx_ref]
      );

      res.json({
        success: true,
        checkout_url: response.data.data.checkout_url,
        tx_ref: tx_ref,
        order_id: order.id
      });
    } else {
      throw new Error(response.data.message || 'Payment initialization failed');
    }

  } catch (error) {
    console.error('Payment initialization error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false,
      message: error.response?.data?.message || error.message || 'Payment initialization failed'
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.query;

    console.log('Verifying payment for tx_ref:', tx_ref);

    if (!tx_ref) {
      return res.status(400).json({ 
        success: false,
        message: 'Transaction reference is required' 
      });
    }

    // Get transaction
    const [transactions] = await db.query(
      `SELECT pt.*, o.user_id, o.id as order_id 
       FROM payment_transactions pt
       JOIN orders o ON pt.order_id = o.id
       WHERE pt.transaction_ref = ?`,
      [tx_ref]
    );

    if (transactions.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Transaction not found' 
      });
    }

    const transaction = transactions[0];

    // If already completed, redirect to success
    if (transaction.status === 'completed') {
      return res.redirect(`${FRONTEND_URL}/order-confirmation/${transaction.order_id}?success=true`);
    }

    // DEMO MODE
    if (!CHAPA_SECRET_KEY || CHAPA_SECRET_KEY === 'your_chapa_secret_key_here') {
      // Update transaction status
      await db.query(
        'UPDATE payment_transactions SET status = ? WHERE id = ?',
        ['completed', transaction.id]
      );

      // Update order status
      await db.query(
        'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
        ['paid', 'processing', transaction.order_id]
      );

      // Clear cart
      await db.query(
        `DELETE FROM cart_items WHERE user_id = ?`,
        [transaction.user_id]
      );

      return res.redirect(`${FRONTEND_URL}/order-confirmation/${transaction.order_id}?success=true&demo=true`);
    }

    // PRODUCTION MODE - Verify with Chapa
    try {
      const response = await axios.get(`${CHAPA_API_URL}/transaction/verify/${tx_ref}`, {
        headers: {
          'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
        }
      });

      console.log('Chapa verification response:', response.data);

      if (response.data.status === 'success') {
        // Update transaction status
        await db.query(
          'UPDATE payment_transactions SET status = ? WHERE id = ?',
          ['completed', transaction.id]
        );

        // Update order status
        await db.query(
          'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
          ['paid', 'processing', transaction.order_id]
        );

        // Clear cart
        await db.query(
          `DELETE FROM cart_items WHERE user_id = ?`,
          [transaction.user_id]
        );

        return res.redirect(`${FRONTEND_URL}/order-confirmation/${transaction.order_id}?success=true`);
      } else {
        return res.redirect(`${FRONTEND_URL}/checkout?payment=failed`);
      }
    } catch (error) {
      console.error('Chapa verification error:', error.response?.data || error.message);
      return res.redirect(`${FRONTEND_URL}/checkout?payment=error`);
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.redirect(`${FRONTEND_URL}/checkout?payment=error`);
  }
};

// Chapa webhook
exports.chapaWebhook = async (req, res) => {
  try {
    const payload = req.body;
    console.log('Webhook received:', payload);

    const { tx_ref, status } = payload;

    if (!tx_ref) {
      return res.status(400).json({ message: 'Invalid webhook data' });
    }

    if (status === 'success') {
      // Get transaction
      const [transactions] = await db.query(
        `SELECT pt.*, o.user_id 
         FROM payment_transactions pt
         JOIN orders o ON pt.order_id = o.id
         WHERE pt.transaction_ref = ?`,
        [tx_ref]
      );

      if (transactions.length > 0) {
        const transaction = transactions[0];
        
        // Update transaction status
        await db.query(
          'UPDATE payment_transactions SET status = ? WHERE id = ?',
          ['completed', transaction.id]
        );

        // Update order status
        await db.query(
          'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
          ['paid', 'processing', transaction.order_id]
        );

        // Clear cart
        await db.query(
          `DELETE FROM cart_items WHERE user_id = ?`,
          [transaction.user_id]
        );

        console.log(`✅ Payment completed for order ${transaction.order_id}`);
      }
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const [transactions] = await db.query(
      `SELECT * FROM payment_transactions 
       WHERE order_id = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [orderId]
    );

    if (transactions.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No payment found for this order' 
      });
    }

    // Get order details
    const [orders] = await db.query(
      'SELECT payment_status, status FROM orders WHERE id = ?',
      [orderId]
    );

    res.json({
      success: true,
      payment: transactions[0],
      order: orders[0]
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get payment status' 
    });
  }
};