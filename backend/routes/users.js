const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Admin: Get all users
router.get('/admin/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { role, status, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT id, email, first_name, last_name, phone, role, is_active, created_at FROM users WHERE 1=1';
        const params = [];

        if (role) {
            query += ' AND role = ?';
            params.push(role);
        }

        if (status) {
            query += ' AND is_active = ?';
            params.push(status === 'active' ? 1 : 0);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [users] = await pool.query(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
        const countParams = [];

        if (role) {
            countQuery += ' AND role = ?';
            countParams.push(role);
        }

        if (status) {
            countQuery += ' AND is_active = ?';
            countParams.push(status === 'active' ? 1 : 0);
        }

        const [countResult] = await pool.query(countQuery, countParams);

        res.json({
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0].total,
                pages: Math.ceil(countResult[0].total / limit)
            }
        });
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Admin: Update user status
router.put('/admin/:id/status', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { is_active } = req.body;

        await pool.query(
            'UPDATE users SET is_active = ? WHERE id = ?',
            [is_active, req.params.id]
        );

        res.json({ message: 'User status updated successfully' });
    } catch (err) {
        console.error('Update user status error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Admin: Delete user
router.delete('/admin/:id', auth, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        await connection.beginTransaction();

        // Prevent deleting admin users
        const [users] = await connection.query(
            'SELECT role FROM users WHERE id = ?',
            [req.params.id]
        );

        if (users.length && users[0].role === 'admin') {
            await connection.rollback();
            return res.status(400).json({ message: 'Cannot delete admin users' });
        }

        await connection.query('DELETE FROM users WHERE id = ?', [req.params.id]);

        await connection.commit();

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        await connection.rollback();
        console.error('Delete user error:', err);
        res.status(500).json({ message: err.message });
    } finally {
        connection.release();
    }
});

module.exports = router;
