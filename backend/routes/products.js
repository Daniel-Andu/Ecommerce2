




// const express = require('express');
// const pool = require('../config/db');
// const { optionalAuth } = require('../middleware/auth');
// const router = express.Router();

// /* =========================
//    FEATURED PRODUCTS
// ========================= */
// router.get('/featured', async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT id, name, slug, base_price, sale_price, is_featured
//        FROM products
//        WHERE status = 'approved'
//        AND is_featured = 1
//        AND is_active = 1
//        ORDER BY created_at DESC
//        LIMIT 8`
//     );

//     const ids = rows.map(r => r.id);
//     let imgMap = {};
    
//     if (ids.length) {
//       const [imgs] = await pool.query(
//         'SELECT product_id, image_url FROM product_images WHERE product_id IN (?) ORDER BY sort_order', 
//         [ids]
//       );
//       imgs.forEach(i => { 
//         if (!imgMap[i.product_id]) imgMap[i.product_id] = []; 
//         imgMap[i.product_id].push(i.image_url); 
//       });
//     }

//     const products = rows.map(p => ({ 
//       ...p, 
//       price: p.sale_price || p.base_price,
//       images: imgMap[p.id] || [] 
//     }));

//     res.json(products);
//   } catch (err) {
//     console.error('Featured products error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// /* =========================
//    NEW ARRIVALS
// ========================= */
// router.get('/new-arrivals', async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT id, name, slug, base_price, sale_price
//        FROM products
//        WHERE status = 'approved'
//        AND is_active = 1
//        ORDER BY created_at DESC
//        LIMIT 8`
//     );

//     const ids = rows.map(r => r.id);
//     let imgMap = {};
    
//     if (ids.length) {
//       const [imgs] = await pool.query(
//         'SELECT product_id, image_url FROM product_images WHERE product_id IN (?) ORDER BY sort_order', 
//         [ids]
//       );
//       imgs.forEach(i => { 
//         if (!imgMap[i.product_id]) imgMap[i.product_id] = []; 
//         imgMap[i.product_id].push(i.image_url); 
//       });
//     }

//     const products = rows.map(p => ({ 
//       ...p, 
//       price: p.sale_price || p.base_price,
//       images: imgMap[p.id] || [] 
//     }));

//     res.json(products);
//   } catch (err) {
//     console.error('New arrivals error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// /* =========================
//    ALL PRODUCTS WITH PAGINATION
// ========================= */
// router.get('/', optionalAuth, async (req, res) => {
//   try {
//     const category_id = req.query.category_id;
//     const search = req.query.search;
//     const sort = req.query.sort || 'newest';
//     const page = Math.max(1, parseInt(req.query.page, 10) || 1);
//     const limit = 12;
//     const offset = (page - 1) * limit;

//     let sql = 'SELECT p.id, p.name, p.slug, p.base_price, p.sale_price, p.stock_quantity, p.sku, p.is_featured, p.created_at, s.business_name AS seller_name FROM products p LEFT JOIN sellers s ON p.seller_id = s.id WHERE p.status = ? AND p.is_active = 1';
//     const params = ['approved'];
    
//     if (category_id) { 
//       sql += ' AND (p.category_id = ? OR p.subcategory_id = ?)'; 
//       params.push(category_id, category_id); 
//     }
    
//     if (search) { 
//       sql += ' AND (p.name LIKE ? OR p.description LIKE ?)'; 
//       params.push('%' + search + '%', '%' + search + '%'); 
//     }
    
//     let orderBy = 'p.created_at DESC';
//     if (sort === 'price_asc') orderBy = 'COALESCE(p.sale_price, p.base_price) ASC';
//     if (sort === 'price_desc') orderBy = 'COALESCE(p.sale_price, p.base_price) DESC';
    
//     const [rows] = await pool.query(sql + ' ORDER BY ' + orderBy + ' LIMIT ? OFFSET ?', params.concat([limit, offset]));
    
//     const [countResult] = await pool.query(
//       'SELECT COUNT(*) AS total FROM products p WHERE p.status = ? AND p.is_active = 1', 
//       ['approved']
//     );
    
//     const ids = rows.map(r => r.id);
//     let imgMap = {};
    
//     if (ids.length) {
//       const [imgs] = await pool.query(
//         'SELECT product_id, image_url, alt_text FROM product_images WHERE product_id IN (?) ORDER BY sort_order', 
//         [ids]
//       );
//       imgs.forEach(i => { 
//         if (!imgMap[i.product_id]) imgMap[i.product_id] = []; 
//         imgMap[i.product_id].push({ url: i.image_url, alt: i.alt_text }); 
//       });
//     }
    
//     const products = rows.map(p => ({ 
//       ...p, 
//       price: p.sale_price || p.base_price, 
//       images: imgMap[p.id] || [] 
//     }));
    
//     res.json({ 
//       products, 
//       total: countResult[0].total, 
//       page, 
//       limit 
//     });
//   } catch (err) {
//     console.error('Products list error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// /* =========================
//    SINGLE PRODUCT - COMPLETELY FIXED
// ========================= */
// router.get('/:idOrSlug', optionalAuth, async (req, res) => {
//   try {
//     const idOrSlug = req.params.idOrSlug;
//     const isId = /^\d+$/.test(idOrSlug);

//     const [rows] = await pool.query(
//       `SELECT p.*, c.name AS category_name, c.image AS category_image, s.business_name AS seller_name 
//        FROM products p 
//        LEFT JOIN categories c ON p.category_id = c.id 
//        LEFT JOIN sellers s ON p.seller_id = s.id 
//        WHERE p.status = 'approved' 
//        AND p.is_active = 1 
//        AND ${isId ? 'p.id = ?' : 'p.slug = ?'}`,
//       [idOrSlug]
//     );

//     if (!rows.length) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = rows[0];
    
//     // Increment view count
//     await pool.query('UPDATE products SET view_count = view_count + 1 WHERE id = ?', [product.id]);
    
//     // Get images - FIXED: No DISTINCT needed here
//     const [images] = await pool.query(
//       'SELECT image_url, alt_text FROM product_images WHERE product_id = ? ORDER BY sort_order', 
//       [product.id]
//     );
    
//     // Get variants
//     const [variants] = await pool.query(
//       'SELECT id, sku, attributes, price, stock_quantity FROM product_variants WHERE product_id = ?', 
//       [product.id]
//     );
    
//     // Get reviews with user info
//     const [reviews] = await pool.query(
//       `SELECT r.id, r.rating, r.title, r.comment, r.created_at, u.first_name, u.last_name, u.profile_image 
//        FROM reviews r 
//        JOIN users u ON r.user_id = u.id 
//        WHERE r.product_id = ? AND r.status = 'approved' 
//        ORDER BY r.created_at DESC 
//        LIMIT 20`, 
//       [product.id]
//     );
    
//     // Calculate average rating
//     const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null;

//     // Get related products from same category
//     const [related] = await pool.query(
//       `SELECT id, name, slug, base_price, sale_price 
//        FROM products 
//        WHERE category_id = ? AND id != ? AND status = 'approved' AND is_active = 1 
//        ORDER BY created_at DESC 
//        LIMIT 4`,
//       [product.category_id, product.id]
//     );
    
//     // Get related product images - FIXED: Removed DISTINCT and ORDER BY conflict
//     const relatedIds = related.map(r => r.id);
//     let relatedImgMap = {};
    
//     if (relatedIds.length) {
//       // FIXED: Removed DISTINCT and ORDER BY sort_order, using simple query
//       const [relatedImgs] = await pool.query(
//         'SELECT product_id, image_url FROM product_images WHERE product_id IN (?)',
//         [relatedIds]
//       );
      
//       // Take the first image for each product
//       relatedImgs.forEach(i => {
//         if (!relatedImgMap[i.product_id]) {
//           relatedImgMap[i.product_id] = i.image_url;
//         }
//       });
//     }

//     const relatedProducts = related.map(r => ({
//       ...r,
//       price: r.sale_price || r.base_price,
//       image: relatedImgMap[r.id] || null
//     }));

//     res.json({ 
//       ...product, 
//       price: product.sale_price || product.base_price, 
//       images: images.map(i => ({ url: i.image_url, alt: i.alt_text || product.name })), 
//       variants, 
//       reviews, 
//       average_rating: avg, 
//       review_count: reviews.length,
//       related_products: relatedProducts
//     });

//   } catch (err) {
//     console.error('Single product error:', err);
//     res.status(500).json({ 
//       message: 'Failed to load product',
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// });

// module.exports = router;



const express = require('express');
const pool = require('../config/db');
const { optionalAuth } = require('../middleware/auth');
const router = express.Router();

/* =========================
   FEATURED PRODUCTS
========================= */
router.get('/featured', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.slug, p.base_price, p.sale_price, p.is_featured,
              s.business_name AS seller_name
       FROM products p
       LEFT JOIN sellers s ON p.seller_id = s.id
       WHERE p.status = 'approved'
       AND p.is_featured = 1
       AND p.is_active = 1
       ORDER BY p.created_at DESC
       LIMIT 8`
    );

    const ids = rows.map(r => r.id);
    let imgMap = {};
    
    if (ids.length) {
      const [imgs] = await pool.query(
        'SELECT product_id, image_url FROM product_images WHERE product_id IN (?) ORDER BY sort_order', 
        [ids]
      );
      imgs.forEach(i => { 
        if (!imgMap[i.product_id]) imgMap[i.product_id] = []; 
        imgMap[i.product_id].push(i.image_url); 
      });
    }

    const products = rows.map(p => ({ 
      ...p, 
      price: p.sale_price || p.base_price,
      images: imgMap[p.id] || [] 
    }));

    res.json(products);
  } catch (err) {
    console.error('Featured products error:', err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   NEW ARRIVALS - FIXED with seller_name
========================= */
router.get('/new-arrivals', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.slug, p.base_price, p.sale_price,
              s.business_name AS seller_name
       FROM products p
       LEFT JOIN sellers s ON p.seller_id = s.id
       WHERE p.status = 'approved'
       AND p.is_active = 1
       ORDER BY p.created_at DESC
       LIMIT 8`
    );

    const ids = rows.map(r => r.id);
    let imgMap = {};
    
    if (ids.length) {
      const [imgs] = await pool.query(
        'SELECT product_id, image_url FROM product_images WHERE product_id IN (?) ORDER BY sort_order', 
        [ids]
      );
      imgs.forEach(i => { 
        if (!imgMap[i.product_id]) imgMap[i.product_id] = []; 
        imgMap[i.product_id].push(i.image_url); 
      });
    }

    const products = rows.map(p => ({ 
      ...p, 
      price: p.sale_price || p.base_price,
      images: imgMap[p.id] || [],
      seller_name: p.seller_name || 'Official Store' // Fallback if no seller
    }));

    res.json(products);
  } catch (err) {
    console.error('New arrivals error:', err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   ALL PRODUCTS WITH PAGINATION
========================= */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const category_id = req.query.category_id;
    const search = req.query.search;
    const sort = req.query.sort || 'newest';
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 12;
    const offset = (page - 1) * limit;

    let sql = `SELECT p.id, p.name, p.slug, p.base_price, p.sale_price, 
                      p.stock_quantity, p.sku, p.is_featured, p.created_at, 
                      COALESCE(s.business_name, 'Official Store') AS seller_name 
               FROM products p 
               LEFT JOIN sellers s ON p.seller_id = s.id 
               WHERE p.status = ? AND p.is_active = 1`;
    const params = ['approved'];
    
    if (category_id) { 
      sql += ' AND (p.category_id = ? OR p.subcategory_id = ?)'; 
      params.push(category_id, category_id); 
    }
    
    if (search) { 
      sql += ' AND (p.name LIKE ? OR p.description LIKE ?)'; 
      params.push('%' + search + '%', '%' + search + '%'); 
    }
    
    let orderBy = 'p.created_at DESC';
    if (sort === 'price_asc') orderBy = 'COALESCE(p.sale_price, p.base_price) ASC';
    if (sort === 'price_desc') orderBy = 'COALESCE(p.sale_price, p.base_price) DESC';
    
    const [rows] = await pool.query(sql + ' ORDER BY ' + orderBy + ' LIMIT ? OFFSET ?', params.concat([limit, offset]));
    
    const [countResult] = await pool.query(
      'SELECT COUNT(*) AS total FROM products p WHERE p.status = ? AND p.is_active = 1', 
      ['approved']
    );
    
    const ids = rows.map(r => r.id);
    let imgMap = {};
    
    if (ids.length) {
      const [imgs] = await pool.query(
        'SELECT product_id, image_url, alt_text FROM product_images WHERE product_id IN (?) ORDER BY sort_order', 
        [ids]
      );
      imgs.forEach(i => { 
        if (!imgMap[i.product_id]) imgMap[i.product_id] = []; 
        imgMap[i.product_id].push({ url: i.image_url, alt: i.alt_text }); 
      });
    }
    
    const products = rows.map(p => ({ 
      ...p, 
      price: p.sale_price || p.base_price, 
      images: imgMap[p.id] || [] 
    }));
    
    res.json({ 
      products, 
      total: countResult[0].total, 
      page, 
      limit 
    });
  } catch (err) {
    console.error('Products list error:', err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   SINGLE PRODUCT - COMPLETELY FIXED
========================= */
router.get('/:idOrSlug', optionalAuth, async (req, res) => {
  try {
    const idOrSlug = req.params.idOrSlug;
    const isId = /^\d+$/.test(idOrSlug);

    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.image AS category_image, 
              COALESCE(s.business_name, 'Official Store') AS seller_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN sellers s ON p.seller_id = s.id 
       WHERE p.status = 'approved' 
       AND p.is_active = 1 
       AND ${isId ? 'p.id = ?' : 'p.slug = ?'}`,
      [idOrSlug]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = rows[0];
    
    // Increment view count
    await pool.query('UPDATE products SET view_count = view_count + 1 WHERE id = ?', [product.id]);
    
    // Get images
    const [images] = await pool.query(
      'SELECT image_url, alt_text FROM product_images WHERE product_id = ? ORDER BY sort_order', 
      [product.id]
    );
    
    // Get variants
    const [variants] = await pool.query(
      'SELECT id, sku, attributes, price, stock_quantity FROM product_variants WHERE product_id = ?', 
      [product.id]
    );
    
    // Get reviews with user info
    const [reviews] = await pool.query(
      `SELECT r.id, r.rating, r.title, r.comment, r.created_at, 
              u.first_name, u.last_name, u.profile_image 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.product_id = ? AND r.status = 'approved' 
       ORDER BY r.created_at DESC 
       LIMIT 20`, 
      [product.id]
    );
    
    // Calculate average rating
    const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : null;

    // Get related products from same category
    const [related] = await pool.query(
      `SELECT id, name, slug, base_price, sale_price 
       FROM products 
       WHERE category_id = ? AND id != ? AND status = 'approved' AND is_active = 1 
       ORDER BY created_at DESC 
       LIMIT 4`,
      [product.category_id, product.id]
    );
    
    // Get related product images
    const relatedIds = related.map(r => r.id);
    let relatedImgMap = {};
    
    if (relatedIds.length) {
      const [relatedImgs] = await pool.query(
        'SELECT product_id, image_url FROM product_images WHERE product_id IN (?)',
        [relatedIds]
      );
      
      // Take the first image for each product
      relatedImgs.forEach(i => {
        if (!relatedImgMap[i.product_id]) {
          relatedImgMap[i.product_id] = i.image_url;
        }
      });
    }

    const relatedProducts = related.map(r => ({
      ...r,
      price: r.sale_price || r.base_price,
      image: relatedImgMap[r.id] || null
    }));

    // Check if product is in stock
    const inStock = product.stock_quantity > 0;

    res.json({ 
      ...product, 
      price: product.sale_price || product.base_price, 
      images: images.map(i => ({ url: i.image_url, alt: i.alt_text || product.name })), 
      variants, 
      reviews, 
      average_rating: avg, 
      review_count: reviews.length,
      related_products: relatedProducts,
      in_stock: inStock,
      stock_status: inStock ? 'In Stock' : 'Out of Stock'
    });

  } catch (err) {
    console.error('Single product error:', err);
    res.status(500).json({ 
      message: 'Failed to load product',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;