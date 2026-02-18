


const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// Get active banners
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, image_url, link_url, sort_order FROM banners WHERE is_active = 1 ORDER BY sort_order'
    );
    res.json(rows);
  } catch (err) {
    console.error('Get banners error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;