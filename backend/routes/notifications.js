const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
    try {
        const [notifications] = await pool.query(
            `SELECT * FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 50`,
            [req.user.id]
        );

        res.json(notifications);
    } catch (err) {
        console.error('Get notifications error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get unread count
router.get('/unread-count', auth, async (req, res) => {
    try {
        // Check if notifications table exists first
        const [tables] = await pool.query("SHOW TABLES LIKE 'notifications'");

        if (tables.length === 0) {
            // Table doesn't exist, return 0
            return res.json({ count: 0 });
        }

        const [result] = await pool.query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
            [req.user.id]
        );

        res.json({ count: result[0].count });
    } catch (err) {
        console.error('Get unread count error:', err);
        // Return 0 instead of error to prevent UI issues
        res.json({ count: 0 });
    }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
    try {
        await pool.query(
            'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error('Mark read error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Mark all as read
router.put('/mark-all-read', auth, async (req, res) => {
    try {
        await pool.query(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
            [req.user.id]
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        console.error('Mark all read error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM notifications WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        res.json({ message: 'Notification deleted' });
    } catch (err) {
        console.error('Delete notification error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
