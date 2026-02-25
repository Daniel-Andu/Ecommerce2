const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Admin: Sales report
router.get('/admin/sales', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { start_date, end_date, period = 'daily' } = req.query;

        let dateFormat = '%Y-%m-%d';
        if (period === 'monthly') dateFormat = '%Y-%m';
        if (period === 'yearly') dateFormat = '%Y';

        let query = `
      SELECT 
        DATE_FORMAT(created_at, ?) as period,
        COUNT(*) as order_count,
        SUM(total) as total_sales,
        AVG(total) as avg_order_value
      FROM orders
      WHERE payment_status = 'paid'
    `;

        const params = [dateFormat];

        if (start_date) {
            query += ' AND created_at >= ?';
            params.push(start_date);
        }

        if (end_date) {
            query += ' AND created_at <= ?';
            params.push(end_date);
        }

        query += ' GROUP BY period ORDER BY period DESC';

        const [results] = await pool.query(query, params);

        res.json(results);
    } catch (err) {
        console.error('Sales report error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Admin: Product performance report
router.get('/admin/products', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const [results] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.sku,
        COUNT(oi.id) as times_sold,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.total_price) as total_revenue
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.payment_status = 'paid'
      GROUP BY p.id
      ORDER BY total_revenue DESC
      LIMIT 50
    `);

        res.json(results);
    } catch (err) {
        console.error('Product report error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Seller: Sales report
router.get('/seller/sales', auth, async (req, res) => {
    try {
        const [sellers] = await pool.query(
            'SELECT id FROM sellers WHERE user_id = ?',
            [req.user.id]
        );

        if (!sellers.length) {
            return res.status(403).json({ message: 'Not a seller' });
        }

        const sellerId = sellers[0].id;
        const { period = 'daily' } = req.query;

        let dateFormat = '%Y-%m-%d';
        if (period === 'monthly') dateFormat = '%Y-%m';

        const [results] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, ?) as period,
        COUNT(*) as order_count,
        SUM(total) as total_sales
      FROM orders
      WHERE seller_id = ? AND payment_status = 'paid'
      GROUP BY period
      ORDER BY period DESC
      LIMIT 30
    `, [dateFormat, sellerId]);

        res.json(results);
    } catch (err) {
        console.error('Seller sales report error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
