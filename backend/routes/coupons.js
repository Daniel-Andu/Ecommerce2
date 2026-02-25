const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Validate and apply coupon
router.post('/validate', auth, async (req, res) => {
    try {
        const { code, subtotal } = req.body;

        const [coupons] = await pool.query(
            `SELECT * FROM coupons 
       WHERE code = ? AND is_active = 1 
       AND (valid_from IS NULL OR valid_from <= NOW()) 
       AND (valid_until IS NULL OR valid_until >= NOW())`,
            [code.toUpperCase()]
        );

        if (!coupons.length) {
            return res.status(404).json({ message: 'Invalid or expired coupon code' });
        }

        const coupon = coupons[0];

        // Check usage limit
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }

        // Check minimum order amount
        if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
            return res.status(400).json({
                message: `Minimum order amount of $${coupon.min_order_amount} required`
            });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discount_type === 'percentage') {
            discount = (subtotal * coupon.discount_value) / 100;
            if (coupon.max_discount_amount) {
                discount = Math.min(discount, coupon.max_discount_amount);
            }
        } else {
            discount = coupon.discount_value;
        }

        res.json({
            valid: true,
            coupon_id: coupon.id,
            discount: discount.toFixed(2),
            code: coupon.code
        });
    } catch (err) {
        console.error('Validate coupon error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Admin: Create coupon
router.post('/admin/create', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const {
            code,
            discount_type,
            discount_value,
            min_order_amount,
            max_discount_amount,
            usage_limit,
            valid_from,
            valid_until,
            description
        } = req.body;

        await pool.query(
            `INSERT INTO coupons 
       (code, discount_type, discount_value, min_order_amount, max_discount_amount, 
        usage_limit, valid_from, valid_until, description, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [code.toUpperCase(), discount_type, discount_value, min_order_amount,
                max_discount_amount, usage_limit, valid_from, valid_until, description]
        );

        res.status(201).json({ message: 'Coupon created successfully' });
    } catch (err) {
        console.error('Create coupon error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Admin: Get all coupons
router.get('/admin/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const [coupons] = await pool.query(
            'SELECT * FROM coupons ORDER BY created_at DESC'
        );

        res.json(coupons);
    } catch (err) {
        console.error('Get coupons error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
