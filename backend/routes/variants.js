const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get product variants
router.get('/product/:productId', async (req, res) => {
    try {
        const [variants] = await pool.query(
            'SELECT * FROM product_variants WHERE product_id = ? ORDER BY id',
            [req.params.productId]
        );

        res.json(variants);
    } catch (err) {
        console.error('Get variants error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Seller: Add product variant
router.post('/', auth, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { product_id, sku, attributes, price, stock_quantity } = req.body;

        // Verify product ownership
        const [products] = await connection.query(
            `SELECT p.* FROM products p 
       JOIN sellers s ON p.seller_id = s.id 
       WHERE p.id = ? AND s.user_id = ?`,
            [product_id, req.user.id]
        );

        if (!products.length && req.user.role !== 'admin') {
            await connection.rollback();
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check if SKU already exists
        const [existing] = await connection.query(
            'SELECT id FROM product_variants WHERE sku = ?',
            [sku]
        );

        if (existing.length) {
            await connection.rollback();
            return res.status(400).json({ message: 'SKU already exists' });
        }

        // Create variant
        const [result] = await connection.query(
            `INSERT INTO product_variants 
       (product_id, sku, attributes, price, stock_quantity, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
            [product_id, sku, JSON.stringify(attributes), price, stock_quantity]
        );

        await connection.commit();

        res.status(201).json({
            message: 'Variant created successfully',
            variant_id: result.insertId
        });
    } catch (err) {
        await connection.rollback();
        console.error('Create variant error:', err);
        res.status(500).json({ message: err.message });
    } finally {
        connection.release();
    }
});

// Seller: Update variant
router.put('/:id', auth, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { sku, attributes, price, stock_quantity } = req.body;
        const variantId = req.params.id;

        // Verify ownership
        const [variants] = await connection.query(
            `SELECT pv.* FROM product_variants pv 
       JOIN products p ON pv.product_id = p.id 
       JOIN sellers s ON p.seller_id = s.id 
       WHERE pv.id = ? AND s.user_id = ?`,
            [variantId, req.user.id]
        );

        if (!variants.length && req.user.role !== 'admin') {
            await connection.rollback();
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await connection.query(
            `UPDATE product_variants 
       SET sku = ?, attributes = ?, price = ?, stock_quantity = ?, updated_at = NOW() 
       WHERE id = ?`,
            [sku, JSON.stringify(attributes), price, stock_quantity, variantId]
        );

        await connection.commit();

        res.json({ message: 'Variant updated successfully' });
    } catch (err) {
        await connection.rollback();
        console.error('Update variant error:', err);
        res.status(500).json({ message: err.message });
    } finally {
        connection.release();
    }
});

// Seller: Delete variant
router.delete('/:id', auth, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Verify ownership
        const [variants] = await connection.query(
            `SELECT pv.* FROM product_variants pv 
       JOIN products p ON pv.product_id = p.id 
       JOIN sellers s ON p.seller_id = s.id 
       WHERE pv.id = ? AND s.user_id = ?`,
            [req.params.id, req.user.id]
        );

        if (!variants.length && req.user.role !== 'admin') {
            await connection.rollback();
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await connection.query('DELETE FROM product_variants WHERE id = ?', [req.params.id]);

        await connection.commit();

        res.json({ message: 'Variant deleted successfully' });
    } catch (err) {
        await connection.rollback();
        console.error('Delete variant error:', err);
        res.status(500).json({ message: err.message });
    } finally {
        connection.release();
    }
});

module.exports = router;
