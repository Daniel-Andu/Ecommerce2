const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure multer for return images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/returns/');
    },
    filename: (req, file, cb) => {
        cb(null, `return-${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});

// Create return request
router.post('/', auth, upload.array('images', 5), async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { order_id, reason, description } = req.body;
        const userId = req.user.id;

        // Validate order ownership and eligibility
        const [orders] = await connection.query(
            `SELECT * FROM orders 
       WHERE id = ? AND user_id = ? AND status = 'delivered'`,
            [order_id, userId]
        );

        if (!orders.length) {
            await connection.rollback();
            return res.status(400).json({ message: 'Order not eligible for return' });
        }

        const order = orders[0];

        // Check if return window is still open (e.g., 7 days)
        const deliveryDate = new Date(order.updated_at);
        const daysSinceDelivery = (Date.now() - deliveryDate) / (1000 * 60 * 60 * 24);

        if (daysSinceDelivery > 7) {
            await connection.rollback();
            return res.status(400).json({ message: 'Return window has expired (7 days)' });
        }

        // Check if return already exists
        const [existing] = await connection.query(
            'SELECT id FROM returns WHERE order_id = ?',
            [order_id]
        );

        if (existing.length) {
            await connection.rollback();
            return res.status(400).json({ message: 'Return request already exists for this order' });
        }

        // Generate return number
        const returnNumber = `RET-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Create return request
        const [result] = await connection.query(
            `INSERT INTO returns 
       (order_id, user_id, return_number, reason, description, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
            [order_id, userId, returnNumber, reason, description]
        );

        const returnId = result.insertId;

        // Save images if uploaded
        if (req.files && req.files.length) {
            const imageValues = req.files.map(file => [
                returnId,
                `/uploads/returns/${file.filename}`
            ]);

            await connection.query(
                'INSERT INTO return_images (return_id, image_url) VALUES ?',
                [imageValues]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: 'Return request submitted successfully',
            return_id: returnId,
            return_number: returnNumber
        });
    } catch (err) {
        await connection.rollback();
        console.error('Create return error:', err);
        res.status(500).json({ message: err.message });
    } finally {
        connection.release();
    }
});

// Get user returns
router.get('/my-returns', auth, async (req, res) => {
    try {
        const [returns] = await pool.query(
            `SELECT r.*, o.order_number, o.total 
       FROM returns r 
       JOIN orders o ON r.order_id = o.id 
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC`,
            [req.user.id]
        );

        // Get images for each return
        for (let ret of returns) {
            const [images] = await pool.query(
                'SELECT image_url FROM return_images WHERE return_id = ?',
                [ret.id]
            );
            ret.images = images.map(img => img.image_url);
        }

        res.json(returns);
    } catch (err) {
        console.error('Get returns error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get return details
router.get('/:id', auth, async (req, res) => {
    try {
        const [returns] = await pool.query(
            `SELECT r.*, o.order_number, o.total, o.seller_id 
       FROM returns r 
       JOIN orders o ON r.order_id = o.id 
       WHERE r.id = ? AND r.user_id = ?`,
            [req.params.id, req.user.id]
        );

        if (!returns.length) {
            return res.status(404).json({ message: 'Return not found' });
        }

        const returnData = returns[0];

        // Get images
        const [images] = await pool.query(
            'SELECT image_url FROM return_images WHERE return_id = ?',
            [returnData.id]
        );
        returnData.images = images.map(img => img.image_url);

        // Get order items
        const [items] = await pool.query(
            'SELECT * FROM order_items WHERE order_id = ?',
            [returnData.order_id]
        );
        returnData.items = items;

        res.json(returnData);
    } catch (err) {
        console.error('Get return details error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Seller: Get returns for their orders
router.get('/seller/returns', auth, async (req, res) => {
    try {
        // Get seller ID
        const [sellers] = await pool.query(
            'SELECT id FROM sellers WHERE user_id = ?',
            [req.user.id]
        );

        if (!sellers.length) {
            return res.status(403).json({ message: 'Not a seller' });
        }

        const sellerId = sellers[0].id;

        const [returns] = await pool.query(
            `SELECT r.*, o.order_number, o.total, u.first_name, u.last_name, u.email 
       FROM returns r 
       JOIN orders o ON r.order_id = o.id 
       JOIN users u ON r.user_id = u.id 
       WHERE o.seller_id = ? 
       ORDER BY r.created_at DESC`,
            [sellerId]
        );

        res.json(returns);
    } catch (err) {
        console.error('Get seller returns error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Seller/Admin: Update return status
router.put('/:id/status', auth, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { status, admin_notes } = req.body;
        const returnId = req.params.id;

        // Validate status
        const validStatuses = ['pending', 'approved', 'rejected', 'processing', 'completed'];
        if (!validStatuses.includes(status)) {
            await connection.rollback();
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Get return details
        const [returns] = await connection.query(
            `SELECT r.*, o.seller_id, o.total, o.user_id 
       FROM returns r 
       JOIN orders o ON r.order_id = o.id 
       WHERE r.id = ?`,
            [returnId]
        );

        if (!returns.length) {
            await connection.rollback();
            return res.status(404).json({ message: 'Return not found' });
        }

        const returnData = returns[0];

        // Check authorization (seller or admin)
        if (req.user.role !== 'admin') {
            const [sellers] = await connection.query(
                'SELECT id FROM sellers WHERE user_id = ? AND id = ?',
                [req.user.id, returnData.seller_id]
            );

            if (!sellers.length) {
                await connection.rollback();
                return res.status(403).json({ message: 'Unauthorized' });
            }
        }

        // Update return status
        await connection.query(
            `UPDATE returns 
       SET status = ?, admin_notes = ?, updated_at = NOW() 
       WHERE id = ?`,
            [status, admin_notes, returnId]
        );

        // If approved, process refund
        if (status === 'approved') {
            await connection.query(
                `UPDATE orders 
         SET status = 'returned', payment_status = 'refunded' 
         WHERE id = ?`,
                [returnData.order_id]
            );

            // Create refund record
            await connection.query(
                `INSERT INTO refunds 
         (order_id, return_id, amount, status, created_at) 
         VALUES (?, ?, ?, 'pending', NOW())`,
                [returnData.order_id, returnId, returnData.total]
            );
        }

        await connection.commit();

        res.json({ message: 'Return status updated successfully' });
    } catch (err) {
        await connection.rollback();
        console.error('Update return status error:', err);
        res.status(500).json({ message: err.message });
    } finally {
        connection.release();
    }
});

module.exports = router;
