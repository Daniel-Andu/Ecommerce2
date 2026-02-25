const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get seller wallet balance
router.get('/wallet', auth, async (req, res) => {
    try {
        const [sellers] = await pool.query(
            'SELECT balance, pending_balance FROM sellers WHERE user_id = ?',
            [req.user.id]
        );

        if (!sellers.length) {
            return res.status(403).json({ message: 'Not a seller' });
        }

        res.json(sellers[0]);
    } catch (err) {
        console.error('Get wallet error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get withdrawal history
router.get('/history', auth, async (req, res) => {
    try {
        const [sellers] = await pool.query(
            'SELECT id FROM sellers WHERE user_id = ?',
            [req.user.id]
        );

        if (!sellers.length) {
            return res.status(403).json({ message: 'Not a seller' });
        }

        const [withdrawals] = await pool.query(
            `SELECT * FROM withdrawals 
       WHERE seller_id = ? 
       ORDER BY created_at DESC`,
            [sellers[0].id]
        );

        res.json(withdrawals);
    } catch (err) {
        console.error('Get withdrawal history error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Request withdrawal
router.post('/request', auth, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { amount, payment_method, account_details } = req.body;

        // Get seller
        const [sellers] = await connection.query(
            'SELECT * FROM sellers WHERE user_id = ?',
            [req.user.id]
        );

        if (!sellers.length) {
            await connection.rollback();
            return res.status(403).json({ message: 'Not a seller' });
        }

        const seller = sellers[0];

        // Validate amount
        if (amount <= 0 || amount > seller.balance) {
            await connection.rollback();
            return res.status(400).json({ message: 'Invalid withdrawal amount' });
        }

        // Minimum withdrawal amount
        if (amount < 10) {
            await connection.rollback();
            return res.status(400).json({ message: 'Minimum withdrawal amount is $10' });
        }

        // Generate withdrawal number
        const withdrawalNumber = `WD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Create withdrawal request
        const [result] = await connection.query(
            `INSERT INTO withdrawals 
       (seller_id, withdrawal_number, amount, payment_method, account_details, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
            [seller.id, withdrawalNumber, amount, payment_method, JSON.stringify(account_details)]
        );

        // Update seller balance
        await connection.query(
            'UPDATE sellers SET balance = balance - ? WHERE id = ?',
            [amount, seller.id]
        );

        await connection.commit();

        res.status(201).json({
            message: 'Withdrawal request submitted successfully',
            withdrawal_id: result.insertId,
            withdrawal_number: withdrawalNumber
        });
    } catch (err) {
        await connection.rollback();
        console.error('Request withdrawal error:', err);
        res.status(500).json({ message: err.message });
    } finally {
        connection.release();
    }
});

// Admin: Get all withdrawal requests
router.get('/admin/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { status } = req.query;

        let query = `
      SELECT w.*, s.business_name, u.email, u.first_name, u.last_name 
      FROM withdrawals w 
      JOIN sellers s ON w.seller_id = s.id 
      JOIN users u ON s.user_id = u.id
    `;

        const params = [];

        if (status) {
            query += ' WHERE w.status = ?';
            params.push(status);
        }

        query += ' ORDER BY w.created_at DESC';

        const [withdrawals] = await pool.query(query, params);

        res.json(withdrawals);
    } catch (err) {
        console.error('Get all withdrawals error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Admin: Process withdrawal
router.put('/admin/:id/process', auth, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        await connection.beginTransaction();

        const { status, admin_notes, transaction_id } = req.body;
        const withdrawalId = req.params.id;

        // Validate status
        const validStatuses = ['approved', 'rejected', 'completed'];
        if (!validStatuses.includes(status)) {
            await connection.rollback();
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Get withdrawal details
        const [withdrawals] = await connection.query(
            'SELECT * FROM withdrawals WHERE id = ?',
            [withdrawalId]
        );

        if (!withdrawals.length) {
            await connection.rollback();
            return res.status(404).json({ message: 'Withdrawal not found' });
        }

        const withdrawal = withdrawals[0];

        // If rejecting, refund the amount to seller
        if (status === 'rejected' && withdrawal.status === 'pending') {
            await connection.query(
                'UPDATE sellers SET balance = balance + ? WHERE id = ?',
                [withdrawal.amount, withdrawal.seller_id]
            );
        }

        // Update withdrawal status
        await connection.query(
            `UPDATE withdrawals 
       SET status = ?, admin_notes = ?, transaction_id = ?, processed_at = NOW(), updated_at = NOW() 
       WHERE id = ?`,
            [status, admin_notes, transaction_id, withdrawalId]
        );

        await connection.commit();

        res.json({ message: 'Withdrawal processed successfully' });
    } catch (err) {
        await connection.rollback();
        console.error('Process withdrawal error:', err);
        res.status(500).json({ message: err.message });
    } finally {
        connection.release();
    }
});

module.exports = router;
