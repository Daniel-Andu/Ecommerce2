const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get shipping methods
router.get('/methods', async (req, res) => {
    try {
        const [methods] = await pool.query(
            'SELECT * FROM shipping_methods WHERE is_active = 1 ORDER BY sort_order'
        );

        res.json(methods);
    } catch (err) {
        console.error('Get shipping methods error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Calculate shipping cost
router.post('/calculate', async (req, res) => {
    try {
        const { shipping_method_id, postal_code, weight } = req.body;

        const [methods] = await pool.query(
            'SELECT * FROM shipping_methods WHERE id = ?',
            [shipping_method_id]
        );

        if (!methods.length) {
            return res.status(404).json({ message: 'Shipping method not found' });
        }

        const method = methods[0];
        let cost = parseFloat(method.base_cost);

        // Add weight-based cost
        if (weight && method.cost_per_kg) {
            cost += weight * parseFloat(method.cost_per_kg);
        }

        res.json({ cost: cost.toFixed(2) });
    } catch (err) {
        console.error('Calculate shipping error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Admin: Manage shipping methods
router.post('/admin/methods', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { name, description, base_cost, cost_per_kg, estimated_days, is_active } = req.body;

        await pool.query(
            `INSERT INTO shipping_methods 
       (name, description, base_cost, cost_per_kg, estimated_days, is_active, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [name, description, base_cost, cost_per_kg, estimated_days, is_active]
        );

        res.status(201).json({ message: 'Shipping method created successfully' });
    } catch (err) {
        console.error('Create shipping method error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
