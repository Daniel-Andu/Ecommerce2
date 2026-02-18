


const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create review
router.post('/', auth, async (req, res) => {
  try {
    const { product_id, order_id, rating, title, comment } = req.body;
    
    // Validate input
    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if user has purchased this product
    if (order_id) {
      const [order] = await pool.query(
        `SELECT oi.id FROM orders o 
         JOIN order_items oi ON o.id = oi.order_id 
         WHERE o.id = ? AND o.user_id = ? AND oi.product_id = ?`,
        [order_id, req.user.id, product_id]
      );
      
      if (!order.length) {
        return res.status(400).json({ 
          message: 'You can only review products you have purchased' 
        });
      }
    }
    
    await pool.query(
      `INSERT INTO reviews 
       (product_id, user_id, order_id, rating, title, comment, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       rating = VALUES(rating), 
       title = VALUES(title), 
       comment = VALUES(comment)`,
      [
        product_id, 
        req.user.id, 
        order_id || null, 
        rating, 
        title || null, 
        comment || null, 
        'approved'
      ]
    );
    
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;