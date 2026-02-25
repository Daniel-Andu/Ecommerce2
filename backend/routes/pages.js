const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get page by slug
router.get('/:slug', async (req, res) => {
    try {
        const [pages] = await pool.query(
            'SELECT * FROM pages WHERE slug = ? AND is_published = 1',
            [req.params.slug]
        );

        if (!pages.length) {
            return res.status(404).json({ message: 'Page not found' });
        }

        res.json(pages[0]);
    } catch (err) {
        console.error('Get page error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Admin: Get all pages
router.get('/admin/all', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const [pages] = await pool.query(
            'SELECT * FROM pages ORDER BY created_at DESC'
        );

        res.json(pages);
    } catch (err) {
        console.error('Get all pages error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Admin: Create/Update page
router.post('/admin/save', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { id, title, slug, content, meta_description, is_published } = req.body;

        if (id) {
            await pool.query(
                `UPDATE pages 
         SET title = ?, slug = ?, content = ?, meta_description = ?, 
             is_published = ?, updated_at = NOW() 
         WHERE id = ?`,
                [title, slug, content, meta_description, is_published, id]
            );
            res.json({ message: 'Page updated successfully' });
        } else {
            await pool.query(
                `INSERT INTO pages 
         (title, slug, content, meta_description, is_published, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
                [title, slug, content, meta_description, is_published]
            );
            res.status(201).json({ message: 'Page created successfully' });
        }
    } catch (err) {
        console.error('Save page error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
