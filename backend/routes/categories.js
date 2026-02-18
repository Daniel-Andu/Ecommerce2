


const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// Get categories as tree structure
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, slug, image, parent_id, sort_order FROM categories ORDER BY sort_order, name'
    );
    
    // Build category tree
    const categoryMap = {};
    const roots = [];
    
    rows.forEach(cat => {
      categoryMap[cat.id] = { ...cat, subcategories: [] };
    });
    
    rows.forEach(cat => {
      if (cat.parent_id && categoryMap[cat.parent_id]) {
        categoryMap[cat.parent_id].subcategories.push(categoryMap[cat.id]);
      } else {
        roots.push(categoryMap[cat.id]);
      }
    });
    
    res.json(roots);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get flat list of categories
router.get('/flat', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, slug, image, parent_id, sort_order FROM categories ORDER BY sort_order, name'
    );
    res.json(rows);
  } catch (err) {
    console.error('Get flat categories error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;