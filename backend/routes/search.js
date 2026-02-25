const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Advanced search with filters
router.get('/', async (req, res) => {
    try {
        const {
            q = '',
            category_id,
            min_price,
            max_price,
            rating,
            in_stock,
            sort = 'relevance',
            page = 1,
            limit = 20
        } = req.query;

        const offset = (page - 1) * limit;

        let query = `
      SELECT DISTINCT p.id, p.name, p.slug, p.base_price, p.sale_price, 
             p.stock_quantity, p.is_featured, p.view_count,
             c.name as category_name,
             COALESCE(AVG(r.rating), 0) as avg_rating,
             COUNT(DISTINCT r.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.status = 'approved'
      WHERE p.status = 'approved' AND p.is_active = 1
    `;

        const params = [];

        // Search query
        if (q) {
            query += ` AND (
        p.name LIKE ? OR 
        p.description LIKE ? OR 
        p.sku LIKE ? OR 
        p.tags LIKE ?
      )`;
            const searchTerm = `%${q}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        // Category filter
        if (category_id) {
            query += ' AND p.category_id = ?';
            params.push(category_id);
        }

        // Price range filter
        if (min_price) {
            query += ' AND COALESCE(p.sale_price, p.base_price) >= ?';
            params.push(min_price);
        }

        if (max_price) {
            query += ' AND COALESCE(p.sale_price, p.base_price) <= ?';
            params.push(max_price);
        }

        // Stock filter
        if (in_stock === 'true') {
            query += ' AND p.stock_quantity > 0';
        }

        query += ' GROUP BY p.id';

        // Rating filter (after GROUP BY)
        if (rating) {
            query += ' HAVING avg_rating >= ?';
            params.push(rating);
        }

        // Sorting
        switch (sort) {
            case 'price_low':
                query += ' ORDER BY COALESCE(p.sale_price, p.base_price) ASC';
                break;
            case 'price_high':
                query += ' ORDER BY COALESCE(p.sale_price, p.base_price) DESC';
                break;
            case 'newest':
                query += ' ORDER BY p.created_at DESC';
                break;
            case 'popular':
                query += ' ORDER BY p.view_count DESC';
                break;
            case 'rating':
                query += ' ORDER BY avg_rating DESC';
                break;
            default:
                query += ' ORDER BY p.is_featured DESC, p.view_count DESC';
        }

        // Pagination
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [products] = await pool.query(query, params);

        // Get total count for pagination
        let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      WHERE p.status = 'approved' AND p.is_active = 1
    `;

        const countParams = [];

        if (q) {
            countQuery += ` AND (
        p.name LIKE ? OR 
        p.description LIKE ? OR 
        p.sku LIKE ? OR 
        p.tags LIKE ?
      )`;
            const searchTerm = `%${q}%`;
            countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (category_id) {
            countQuery += ' AND p.category_id = ?';
            countParams.push(category_id);
        }

        if (min_price) {
            countQuery += ' AND COALESCE(p.sale_price, p.base_price) >= ?';
            countParams.push(min_price);
        }

        if (max_price) {
            countQuery += ' AND COALESCE(p.sale_price, p.base_price) <= ?';
            countParams.push(max_price);
        }

        if (in_stock === 'true') {
            countQuery += ' AND p.stock_quantity > 0';
        }

        const [countResult] = await pool.query(countQuery, countParams);
        const total = countResult[0].total;

        // Get images for products
        if (products.length) {
            const productIds = products.map(p => p.id);
            const [images] = await pool.query(
                'SELECT product_id, image_url FROM product_images WHERE product_id IN (?) ORDER BY sort_order',
                [productIds]
            );

            const imageMap = {};
            images.forEach(img => {
                if (!imageMap[img.product_id]) imageMap[img.product_id] = [];
                imageMap[img.product_id].push(img.image_url);
            });

            products.forEach(p => {
                p.images = imageMap[p.id] || [];
                p.price = p.sale_price || p.base_price;
            });
        }

        res.json({
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Search suggestions/autocomplete
router.get('/suggestions', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.json([]);
        }

        const [results] = await pool.query(
            `SELECT DISTINCT name, slug 
       FROM products 
       WHERE status = 'approved' AND is_active = 1 
       AND name LIKE ? 
       LIMIT 10`,
            [`%${q}%`]
        );

        res.json(results);
    } catch (err) {
        console.error('Suggestions error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
