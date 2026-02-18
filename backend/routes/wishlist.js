


const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get wishlist
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT w.id, w.product_id, p.name, p.slug, p.base_price, p.sale_price 
       FROM wishlists w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = ? AND p.status = ?`,
      [req.user.id, 'approved']
    );
    
    // Get product images
    const productIds = rows.map(r => r.product_id);
    let imgMap = {};
    
    if (productIds.length) {
      const [images] = await pool.query(
        'SELECT product_id, image_url FROM product_images WHERE product_id IN (?) ORDER BY sort_order',
        [productIds]
      );
      images.forEach(i => { 
        imgMap[i.product_id] = i.image_url; 
      });
    }
    
    const wishlist = rows.map(r => ({
      ...r,
      price: r.sale_price || r.base_price,
      image: imgMap[r.product_id]
    }));
    
    res.json(wishlist);
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add to wishlist
router.post('/', auth, async (req, res) => {
  try {
    const { product_id } = req.body;
    
    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    // Check if product exists
    const [product] = await pool.query(
      'SELECT id FROM products WHERE id = ? AND status = ?',
      [product_id, 'approved']
    );
    
    if (!product.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await pool.query(
      'INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)',
      [req.user.id, product_id]
    );
    
    res.json({ message: 'Added to wishlist' });
  } catch (err) {
    console.error('Add to wishlist error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Remove from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM wishlists WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }
    
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Remove from wishlist error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;