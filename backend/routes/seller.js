// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const pool = require('../config/db');
// const { auth, requireRole } = require('../middleware/auth');
// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = path.join(__dirname, '../uploads/products');
//     // Create directory if it doesn't exist
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     // Generate unique filename
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   // Accept only images
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };

// const upload = multer({ 
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB limit
//   }
// });

// // All seller routes require authentication and seller role
// router.use(auth);
// router.use(requireRole('seller', 'admin'));

// // Helper to get seller row
// async function getSeller(userId) {
//   const [rows] = await pool.query(
//     'SELECT * FROM sellers WHERE user_id = ?', 
//     [userId]
//   );
//   return rows[0] || null;
// }

// // Check seller status middleware - only approved sellers can proceed
// const checkSellerApproved = async (req, res, next) => {
//   const seller = await getSeller(req.user.id);
  
//   if (!seller) {
//     return res.status(403).json({ 
//       success: false,
//       message: 'Seller account not found' 
//     });
//   }
  
//   if (seller.status !== 'approved') {
//     return res.status(403).json({ 
//       success: false,
//       message: 'Your seller account is pending approval. Please wait for admin approval.',
//       status: seller.status 
//     });
//   }
  
//   req.seller = seller;
//   next();
// };

// // ==================== DASHBOARD ====================

// // Get seller dashboard stats (requires approved seller)
// router.get('/dashboard', checkSellerApproved, async (req, res) => {
//   try {
//     const sellerId = req.seller.id;
//     // IMPORTANT: For dashboard queries, we need to use seller_id in products table
//     // which should be the seller.id (from sellers table), NOT the user.id

//     console.log('Loading dashboard for seller ID:', sellerId, 'user ID:', req.user.id);

//     // Get product count - FIXED: Use seller.id
//     const [productCount] = await pool.query(
//       'SELECT COUNT(*) AS total FROM products WHERE seller_id = ?',
//       [sellerId]  // ✅ FIXED: Use seller.id
//     );

//     // Get order stats - FIXED: Use seller.id in the join through products
//     const [orderStats] = await pool.query(
//       `SELECT 
//         COUNT(DISTINCT o.id) AS totalOrders,
//         SUM(CASE WHEN o.status = 'pending' THEN 1 ELSE 0 END) AS pendingOrders,
//         COALESCE(SUM(oi.total_price), 0) AS totalRevenue
//        FROM orders o
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        WHERE p.seller_id = ?`,
//       [sellerId]  // ✅ FIXED: Use seller.id
//     );

//     // Get recent orders - FIXED: Use seller.id
//     const [recentOrders] = await pool.query(
//       `SELECT 
//         o.id, 
//         o.order_number,
//         o.total AS amount, 
//         o.status, 
//         o.created_at,
//         u.first_name AS customer_name,
//         u.email AS customer_email,
//         oi.product_name,
//         oi.quantity
//        FROM orders o
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        JOIN users u ON o.user_id = u.id
//        WHERE p.seller_id = ?
//        ORDER BY o.created_at DESC
//        LIMIT 5`,
//       [sellerId]  // ✅ FIXED: Use seller.id
//     );

//     // Get recent products - FIXED: Use seller.id
//     const [recentProducts] = await pool.query(
//       `SELECT 
//         id, 
//         name, 
//         slug, 
//         base_price AS price, 
//         sale_price, 
//         stock_quantity AS stock, 
//         status,
//         created_at
//        FROM products 
//        WHERE seller_id = ? 
//        ORDER BY created_at DESC 
//        LIMIT 5`,
//       [sellerId]  // ✅ FIXED: Use seller.id
//     );

//     // Get images for each product from product_images table
//     const productsWithImages = await Promise.all(recentProducts.map(async (product) => {
//       const [images] = await pool.query(
//         `SELECT image_url 
//          FROM product_images 
//          WHERE product_id = ? 
//          ORDER BY sort_order ASC, id ASC 
//          LIMIT 1`,
//         [product.id]
//       );
      
//       return {
//         id: product.id,
//         name: product.name,
//         slug: product.slug,
//         price: parseFloat(product.price || 0),
//         sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
//         stock: product.stock || 0,
//         status: product.status,
//         images: images.length > 0 ? [images[0].image_url] : [],
//         created_at: product.created_at
//       };
//     }));

//     // Get seller balance
//     const [sellerBalance] = await pool.query(
//       'SELECT balance, pending_balance FROM sellers WHERE id = ?',
//       [sellerId]
//     );

//     const response = {
//       success: true,
//       totalProducts: productCount[0]?.total || 0,
//       totalOrders: orderStats[0]?.totalOrders || 0,
//       totalRevenue: parseFloat(orderStats[0]?.totalRevenue || 0),
//       pendingOrders: orderStats[0]?.pendingOrders || 0,
//       recentOrders: recentOrders.map(order => ({
//         id: order.id,
//         order_number: order.order_number,
//         amount: parseFloat(order.amount || 0),
//         status: order.status,
//         created_at: order.created_at,
//         customer_name: order.customer_name,
//         customer_email: order.customer_email,
//         product_name: order.product_name || 'Product',
//         quantity: order.quantity || 1
//       })),
//       recentProducts: productsWithImages,
//       balance: parseFloat(sellerBalance[0]?.balance || 0),
//       pendingBalance: parseFloat(sellerBalance[0]?.pending_balance || 0)
//     };

//     console.log('Dashboard response:', response);
//     res.json(response);

//   } catch (err) {
//     console.error('Seller dashboard error:', err);
//     res.status(500).json({ 
//       success: false, 
//       message: err.message || 'Failed to load dashboard'
//     });
//   }
// });

// // ==================== PRODUCT MANAGEMENT ====================

// // Get seller's products - FIXED: Use seller.id
// router.get('/products', checkSellerApproved, async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT p.*, c.name AS category_name 
//        FROM products p 
//        LEFT JOIN categories c ON p.category_id = c.id 
//        WHERE p.seller_id = ? 
//        ORDER BY p.created_at DESC`,
//       [req.seller.id]  // ✅ FIXED: Use seller.id
//     );

//     // Get images for each product
//     const productsWithImages = await Promise.all(rows.map(async (product) => {
//       const [images] = await pool.query(
//         `SELECT image_url 
//          FROM product_images 
//          WHERE product_id = ? 
//          ORDER BY sort_order ASC, id ASC`,
//         [product.id]
//       );
      
//       return {
//         ...product,
//         images: images.map(img => img.image_url),
//         base_price: parseFloat(product.base_price || 0),
//         sale_price: product.sale_price ? parseFloat(product.sale_price) : null
//       };
//     }));

//     res.json(productsWithImages);
//   } catch (err) {
//     console.error('Get seller products error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get single product for editing - FIXED: Use seller.id
// router.get('/products/:id', checkSellerApproved, async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT p.*, c.name AS category_name 
//        FROM products p 
//        LEFT JOIN categories c ON p.category_id = c.id 
//        WHERE p.id = ? AND p.seller_id = ?`,
//       [req.params.id, req.seller.id]  // ✅ FIXED: Use seller.id
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = rows[0];
    
//     // Get product images
//     const [images] = await pool.query(
//       `SELECT image_url 
//        FROM product_images 
//        WHERE product_id = ? 
//        ORDER BY sort_order ASC, id ASC`,
//       [product.id]
//     );
    
//     product.images = images.map(img => img.image_url);
//     product.base_price = parseFloat(product.base_price || 0);
//     product.sale_price = product.sale_price ? parseFloat(product.sale_price) : null;

//     res.json(product);
//   } catch (err) {
//     console.error('Get product error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Add new product - WITH MULTER FOR FILE UPLOADS - FIXED: Use seller.id
// router.post('/products', checkSellerApproved, upload.array('images', 5), async (req, res) => {
//   const connection = await pool.getConnection();
//   try {
//     await connection.beginTransaction();
    
//     // Get form data from req.body (multer parses it)
//     const { 
//       name, 
//       category_id, 
//       description, 
//       base_price, 
//       sale_price, 
//       stock_quantity,
//       tags,
//       is_featured
//     } = req.body;

//     // Get uploaded files
//     const files = req.files || [];
    
//     console.log('Adding product:', { 
//       name, 
//       category_id, 
//       base_price,
//       filesCount: files.length,
//       sellerId: req.seller.id,  // This is correct (22)
//       userId: req.user.id        // This is 36 - for reference only
//     });

//     // Validation
//     if (!name || name.trim().length === 0) {
//       return res.status(400).json({ message: 'Product name is required' });
//     }
    
//     if (!base_price || parseFloat(base_price) <= 0) {
//       return res.status(400).json({ message: 'Valid base price is required' });
//     }

//     if (!category_id) {
//       return res.status(400).json({ message: 'Category is required' });
//     }

//     // Generate unique slug
//     const baseSlug = name.toLowerCase()
//                          .replace(/\s+/g, '-')
//                          .replace(/[^a-z0-9-]/g, '');
//     const slug = baseSlug + '-' + Date.now();

//     // Create image URLs array for JSON storage
//     const baseUrl = `${req.protocol}://${req.get('host')}`;
//     const imageUrls = files.map(file => `${baseUrl}/uploads/products/${file.filename}`);

//     // Insert product - ✅ FIXED: Use req.seller.id
//     const [result] = await connection.query(
//       `INSERT INTO products 
//        (seller_id, category_id, name, slug, description, base_price, sale_price, stock_quantity, tags, is_featured, status, is_active, created_at, updated_at) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
//       [
//         req.seller.id,  // ✅ FIXED: Use seller.id (22), not user.id (36)
//         parseInt(category_id) || null,
//         name.trim(),
//         slug,
//         description || null,
//         parseFloat(base_price),
//         sale_price ? parseFloat(sale_price) : null,
//         parseInt(stock_quantity) || 0,
//         tags || null,
//         is_featured === 'true' || is_featured === true ? 1 : 0,
//         'pending',
//         1
//       ]
//     );

//     const productId = result.insertId;

//     // Insert into product_images table
//     if (files.length > 0) {
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const imageUrl = `${baseUrl}/uploads/products/${file.filename}`;
        
//         await connection.query(
//           'INSERT INTO product_images (product_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)',
//           [productId, imageUrl, name, i]
//         );
//       }
//     }

//     await connection.commit();

//     // Get the created product
//     const [product] = await connection.query(
//       `SELECT p.*, c.name AS category_name 
//        FROM products p 
//        LEFT JOIN categories c ON p.category_id = c.id 
//        WHERE p.id = ?`,
//       [productId]
//     );
    
//     // Get images for response
//     const [productImages] = await connection.query(
//       'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
//       [productId]
//     );
    
//     const responseProduct = {
//       ...product[0],
//       images: productImages.map(img => img.image_url)
//     };
    
//     res.status(201).json({
//       success: true,
//       message: 'Product added successfully and pending approval',
//       product: responseProduct
//     });

//   } catch (err) {
//     await connection.rollback();
//     console.error('Add product error:', err);
//     res.status(500).json({ 
//       success: false, 
//       message: err.sqlMessage || err.message 
//     });
//   } finally {
//     connection.release();
//   }
// });

// // Update product - FIXED: Use seller.id
// router.patch('/products/:id', checkSellerApproved, upload.array('images', 5), async (req, res) => {
//   const connection = await pool.getConnection();
//   try {
//     await connection.beginTransaction();
    
//     // Check if product exists and belongs to seller - ✅ FIXED: Use seller.id
//     const [existing] = await connection.query(
//       'SELECT * FROM products WHERE id = ? AND seller_id = ?',
//       [req.params.id, req.seller.id]  // ✅ FIXED: Use seller.id
//     );

//     if (!existing.length) {
//       await connection.rollback();
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     const product = existing[0];
//     const { 
//       name, 
//       base_price, 
//       sale_price, 
//       stock_quantity, 
//       category_id, 
//       description,
//       tags,
//       is_featured,
//       existing_images 
//     } = req.body;
    
//     const files = req.files || [];
//     const baseUrl = `${req.protocol}://${req.get('host')}`;
    
//     const updates = [];
//     const values = [];
    
//     if (name !== undefined && name.trim()) {
//       updates.push('name = ?');
//       values.push(name.trim());
      
//       const newSlug = name.toLowerCase()
//                          .replace(/\s+/g, '-')
//                          .replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
//       updates.push('slug = ?');
//       values.push(newSlug);
//     }
    
//     if (base_price !== undefined) {
//       updates.push('base_price = ?');
//       values.push(parseFloat(base_price));
//     }
    
//     if (sale_price !== undefined) {
//       updates.push('sale_price = ?');
//       values.push(sale_price ? parseFloat(sale_price) : null);
//     }
    
//     if (stock_quantity !== undefined) {
//       updates.push('stock_quantity = ?');
//       values.push(parseInt(stock_quantity));
//     }
    
//     if (category_id !== undefined) {
//       updates.push('category_id = ?');
//       values.push(category_id || null);
//     }
    
//     if (description !== undefined) {
//       updates.push('description = ?');
//       values.push(description || null);
//     }
    
//     if (tags !== undefined) {
//       updates.push('tags = ?');
//       values.push(tags || null);
//     }
    
//     if (is_featured !== undefined) {
//       updates.push('is_featured = ?');
//       values.push(is_featured === 'true' || is_featured === true ? 1 : 0);
//     }
    
//     if (updates.length > 0) {
//       updates.push('updated_at = NOW()');
//       values.push(req.params.id);
      
//       await connection.query(
//         `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
//         values
//       );
//     }

//     // Handle images - parse existing_images if it's a string
//     let keepImages = [];
//     if (existing_images) {
//       try {
//         keepImages = typeof existing_images === 'string' 
//           ? JSON.parse(existing_images) 
//           : existing_images;
//       } catch (e) {
//         console.error('Error parsing existing_images:', e);
//       }
//     }

//     // Delete images that are not in keepImages
//     if (keepImages.length > 0) {
//       const placeholders = keepImages.map(() => '?').join(',');
//       await connection.query(
//         `DELETE FROM product_images WHERE product_id = ? AND image_url NOT IN (${placeholders})`,
//         [req.params.id, ...keepImages]
//       );
//     } else {
//       // If no images to keep, delete all
//       await connection.query('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);
//     }

//     // Add new images
//     if (files.length > 0) {
//       // Get current max sort order
//       const [maxOrder] = await connection.query(
//         'SELECT COALESCE(MAX(sort_order), -1) as max FROM product_images WHERE product_id = ?',
//         [req.params.id]
//       );
      
//       let startOrder = maxOrder[0].max + 1;
      
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const imageUrl = `${baseUrl}/uploads/products/${file.filename}`;
        
//         await connection.query(
//           'INSERT INTO product_images (product_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)',
//           [req.params.id, imageUrl, name || product.name, startOrder + i]
//         );
//       }
//     }

//     await connection.commit();

//     // Get updated product
//     const [updated] = await connection.query(
//       `SELECT p.*, c.name AS category_name 
//        FROM products p 
//        LEFT JOIN categories c ON p.category_id = c.id 
//        WHERE p.id = ?`,
//       [req.params.id]
//     );
    
//     // Get updated images
//     const [productImages] = await connection.query(
//       'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
//       [req.params.id]
//     );
    
//     const responseProduct = {
//       ...updated[0],
//       images: productImages.map(img => img.image_url)
//     };
    
//     res.json({
//       success: true,
//       message: 'Product updated successfully',
//       product: responseProduct
//     });
//   } catch (err) {
//     await connection.rollback();
//     console.error('Update product error:', err);
//     res.status(500).json({ 
//       success: false, 
//       message: err.sqlMessage || err.message 
//     });
//   } finally {
//     connection.release();
//   }
// });

// // Delete product - FIXED: Use seller.id
// router.delete('/products/:id', checkSellerApproved, async (req, res) => {
//   const connection = await pool.getConnection();
//   try {
//     await connection.beginTransaction();
    
//     // Check if product exists and belongs to seller - ✅ FIXED: Use seller.id
//     const [existing] = await connection.query(
//       'SELECT id FROM products WHERE id = ? AND seller_id = ?',
//       [req.params.id, req.seller.id]  // ✅ FIXED: Use seller.id
//     );

//     if (!existing.length) {
//       await connection.rollback();
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Get images to delete files
//     const [images] = await connection.query(
//       'SELECT image_url FROM product_images WHERE product_id = ?',
//       [req.params.id]
//     );

//     // Delete image files from disk
//     images.forEach(img => {
//       const filename = img.image_url.split('/').pop();
//       const filePath = path.join(__dirname, '../uploads/products', filename);
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       }
//     });

//     await connection.query('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);
//     await connection.query('DELETE FROM cart WHERE product_id = ?', [req.params.id]);
//     await connection.query('DELETE FROM cart_sessions WHERE product_id = ?', [req.params.id]);
//     await connection.query('DELETE FROM wishlist WHERE product_id = ?', [req.params.id]);
//     await connection.query('DELETE FROM products WHERE id = ?', [req.params.id]);

//     await connection.commit();

//     res.json({ 
//       success: true,
//       message: 'Product deleted successfully' 
//     });
//   } catch (err) {
//     await connection.rollback();
//     console.error('Delete product error:', err);
//     res.status(500).json({ 
//       success: false, 
//       message: err.sqlMessage || err.message 
//     });
//   } finally {
//     connection.release();
//   }
// });

// // ==================== ORDER MANAGEMENT ====================

// // Get seller's orders - FIXED: Use seller.id
// router.get('/orders', checkSellerApproved, async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT DISTINCT
//         o.id,
//         o.order_number,
//         o.total,
//         o.status,
//         o.payment_status,
//         o.created_at,
//         u.first_name,
//         u.last_name,
//         u.email,
//         COUNT(oi.id) as item_count,
//         SUM(oi.quantity) as total_items
//        FROM orders o
//        JOIN users u ON o.user_id = u.id
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        WHERE p.seller_id = ?
//        GROUP BY o.id
//        ORDER BY o.created_at DESC`,
//       [req.seller.id]  // ✅ FIXED: Use seller.id
//     );

//     res.json(rows);
//   } catch (err) {
//     console.error('Get seller orders error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get single order details - FIXED: Use seller.id
// router.get('/orders/:id', checkSellerApproved, async (req, res) => {
//   try {
//     const [orders] = await pool.query(
//       `SELECT DISTINCT
//         o.*,
//         u.first_name,
//         u.last_name,
//         u.email,
//         a.address_line1,
//         a.address_line2,
//         a.city,
//         a.state,
//         a.postal_code,
//         a.country,
//         a.phone
//        FROM orders o
//        JOIN users u ON o.user_id = u.id
//        LEFT JOIN addresses a ON o.shipping_address_id = a.id
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        WHERE o.id = ? AND p.seller_id = ?`,
//       [req.params.id, req.seller.id]  // ✅ FIXED: Use seller.id
//     );
    
//     if (!orders.length) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
    
//     const [items] = await pool.query(
//       `SELECT oi.*, p.name, p.slug 
//        FROM order_items oi 
//        LEFT JOIN products p ON oi.product_id = p.id 
//        WHERE oi.order_id = ?`,
//       [req.params.id]
//     );
    
//     res.json({
//       ...orders[0],
//       items
//     });
//   } catch (err) {
//     console.error('Get order error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Update order status - FIXED: Use seller.id
// router.patch('/orders/:id/status', checkSellerApproved, async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     if (!status) {
//       return res.status(400).json({ message: 'Status is required' });
//     }
    
//     const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }
    
//     // Check if seller has items in this order - ✅ FIXED: Use seller.id
//     const [check] = await pool.query(
//       `SELECT oi.id 
//        FROM order_items oi
//        JOIN products p ON oi.product_id = p.id
//        WHERE oi.order_id = ? AND p.seller_id = ?`,
//       [req.params.id, req.seller.id]  // ✅ FIXED: Use seller.id
//     );
    
//     if (!check.length) {
//       return res.status(403).json({ message: 'You do not have permission to update this order' });
//     }
    
//     const [result] = await pool.query(
//       'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
//       [status, req.params.id]
//     );
    
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
    
//     res.json({ 
//       success: true,
//       message: 'Order status updated successfully' 
//     });
//   } catch (err) {
//     console.error('Update order error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ==================== EARNINGS ====================

// // Get earnings summary - FIXED: Use seller.id
// router.get('/earnings', checkSellerApproved, async (req, res) => {
//   try {
//     const sellerId = req.seller.id;

//     const [seller] = await pool.query(
//       'SELECT balance, pending_balance FROM sellers WHERE id = ?',
//       [sellerId]
//     );
    
//     const [totalEarnings] = await pool.query(
//       `SELECT COALESCE(SUM(oi.total_price), 0) as total
//        FROM order_items oi
//        JOIN orders o ON oi.order_id = o.id
//        JOIN products p ON oi.product_id = p.id
//        WHERE p.seller_id = ? AND o.payment_status = 'paid'`,
//       [sellerId]  // ✅ FIXED: Use seller.id
//     );
    
//     const [pendingEarnings] = await pool.query(
//       `SELECT COALESCE(SUM(oi.total_price), 0) as total
//        FROM order_items oi
//        JOIN orders o ON oi.order_id = o.id
//        JOIN products p ON oi.product_id = p.id
//        WHERE p.seller_id = ? AND o.payment_status = 'pending'`,
//       [sellerId]  // ✅ FIXED: Use seller.id
//     );
    
//     const [monthly] = await pool.query(
//       `SELECT 
//         DATE_FORMAT(o.created_at, '%Y-%m') as month,
//         SUM(oi.total_price) as earnings
//        FROM orders o
//        JOIN order_items oi ON o.id = oi.order_id
//        JOIN products p ON oi.product_id = p.id
//        WHERE p.seller_id = ? AND o.payment_status = 'paid'
//        GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
//        ORDER BY month DESC
//        LIMIT 6`,
//       [sellerId]  // ✅ FIXED: Use seller.id
//     );
    
//     res.json({
//       success: true,
//       stats: {
//         total: parseFloat(totalEarnings[0]?.total || 0),
//         available: parseFloat(seller[0]?.balance || 0),
//         pending: parseFloat(pendingEarnings[0]?.total || 0),
//         withdrawn: 0
//       },
//       monthlyEarnings: monthly.map(m => ({
//         month: m.month,
//         earnings: parseFloat(m.earnings || 0)
//       }))
//     });
//   } catch (err) {
//     console.error('Get earnings error:', err);
//     res.status(500).json({ 
//       success: false, 
//       message: err.message 
//     });
//   }
// });

// // Request withdrawal
// router.post('/withdraw', checkSellerApproved, async (req, res) => {
//   const connection = await pool.getConnection();
//   try {
//     await connection.beginTransaction();
    
//     const { amount } = req.body;
    
//     if (!amount || amount <= 0) {
//       return res.status(400).json({ message: 'Valid amount is required' });
//     }
    
//     const [seller] = await connection.query(
//       'SELECT balance FROM sellers WHERE id = ?',
//       [req.seller.id]
//     );
    
//     if (!seller.length || seller[0].balance < amount) {
//       return res.status(400).json({ message: 'Insufficient balance' });
//     }
    
//     await connection.query(
//       'UPDATE sellers SET balance = balance - ?, pending_balance = pending_balance + ? WHERE id = ?',
//       [amount, amount, req.seller.id]
//     );
    
//     await connection.commit();
    
//     res.json({
//       success: true,
//       message: 'Withdrawal request submitted successfully'
//     });
    
//   } catch (err) {
//     await connection.rollback();
//     console.error('Withdrawal error:', err);
//     res.status(500).json({ 
//       success: false, 
//       message: err.message 
//     });
//   } finally {
//     connection.release();
//   }
// });

// // TEMPORARY DEBUG ENDPOINT
// router.get('/debug-ids', checkSellerApproved, async (req, res) => {
//   res.json({
//     userId: req.user.id,
//     sellerId: req.seller.id,
//     seller: req.seller
//   });
// });

// module.exports = router;





const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/products');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// All seller routes require authentication and seller role
router.use(auth);
router.use(requireRole('seller', 'admin'));

// Helper to get seller row
async function getSeller(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM sellers WHERE user_id = ?', 
    [userId]
  );
  return rows[0] || null;
}

// Check seller status middleware - only approved sellers can proceed
const checkSellerApproved = async (req, res, next) => {
  const seller = await getSeller(req.user.id);
  
  if (!seller) {
    return res.status(403).json({ 
      success: false,
      message: 'Seller account not found' 
    });
  }
  
  if (seller.status !== 'approved') {
    return res.status(403).json({ 
      success: false,
      message: 'Your seller account is pending approval. Please wait for admin approval.',
      status: seller.status 
    });
  }
  
  req.seller = seller;
  next();
};

// ==================== DASHBOARD ====================

// Get seller dashboard stats (requires approved seller)
router.get('/dashboard', checkSellerApproved, async (req, res) => {
  try {
    const sellerId = req.seller.id;

    console.log('Loading dashboard for seller ID:', sellerId);

    // Get product count
    const [productCount] = await pool.query(
      'SELECT COUNT(*) AS total FROM products WHERE seller_id = ?',
      [sellerId]
    );

    // Get order stats
    const [orderStats] = await pool.query(
      `SELECT 
        COUNT(DISTINCT o.id) AS totalOrders,
        SUM(CASE WHEN o.status = 'pending' THEN 1 ELSE 0 END) AS pendingOrders,
        COALESCE(SUM(oi.total_price), 0) AS totalRevenue
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE p.seller_id = ?`,
      [sellerId]
    );

    // Get recent orders
    const [recentOrders] = await pool.query(
      `SELECT 
        o.id, 
        o.order_number,
        o.total AS amount, 
        o.status, 
        o.created_at,
        u.first_name AS customer_name,
        u.email AS customer_email,
        oi.product_name,
        oi.quantity
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       JOIN users u ON o.user_id = u.id
       WHERE p.seller_id = ?
       ORDER BY o.created_at DESC
       LIMIT 5`,
      [sellerId]
    );

    // Get recent products
    const [recentProducts] = await pool.query(
      `SELECT 
        id, 
        name, 
        slug, 
        base_price AS price, 
        sale_price, 
        stock_quantity AS stock, 
        status,
        created_at
       FROM products 
       WHERE seller_id = ? 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [sellerId]
    );

    // Get images for each product
    const productsWithImages = await Promise.all(recentProducts.map(async (product) => {
      const [images] = await pool.query(
        `SELECT image_url 
         FROM product_images 
         WHERE product_id = ? 
         ORDER BY sort_order ASC, id ASC 
         LIMIT 1`,
        [product.id]
      );
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: parseFloat(product.price || 0),
        sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
        stock: product.stock || 0,
        status: product.status,
        images: images.length > 0 ? [images[0].image_url] : [],
        created_at: product.created_at
      };
    }));

    // Get seller balance
    const [sellerBalance] = await pool.query(
      'SELECT balance, pending_balance FROM sellers WHERE id = ?',
      [sellerId]
    );

    const response = {
      success: true,
      totalProducts: productCount[0]?.total || 0,
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalRevenue: parseFloat(orderStats[0]?.totalRevenue || 0),
      pendingOrders: orderStats[0]?.pendingOrders || 0,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        order_number: order.order_number,
        amount: parseFloat(order.amount || 0),
        status: order.status,
        created_at: order.created_at,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        product_name: order.product_name || 'Product',
        quantity: order.quantity || 1
      })),
      recentProducts: productsWithImages,
      balance: parseFloat(sellerBalance[0]?.balance || 0),
      pendingBalance: parseFloat(sellerBalance[0]?.pending_balance || 0)
    };

    console.log('Dashboard response:', response);
    res.json(response);

  } catch (err) {
    console.error('Seller dashboard error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Failed to load dashboard'
    });
  }
});

// ==================== PRODUCT MANAGEMENT ====================

// Get seller's products
router.get('/products', checkSellerApproved, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.seller_id = ? 
       ORDER BY p.created_at DESC`,
      [req.seller.id]
    );

    // Get images for each product
    const productsWithImages = await Promise.all(rows.map(async (product) => {
      const [images] = await pool.query(
        `SELECT image_url 
         FROM product_images 
         WHERE product_id = ? 
         ORDER BY sort_order ASC, id ASC`,
        [product.id]
      );
      
      return {
        ...product,
        images: images.map(img => img.image_url),
        base_price: parseFloat(product.base_price || 0),
        sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
        stock_quantity: parseInt(product.stock_quantity || 0)
      };
    }));

    res.json(productsWithImages);
  } catch (err) {
    console.error('Get seller products error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get single product for editing
router.get('/products/:id', checkSellerApproved, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ? AND p.seller_id = ?`,
      [req.params.id, req.seller.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = rows[0];
    
    // Get product images
    const [images] = await pool.query(
      `SELECT image_url 
       FROM product_images 
       WHERE product_id = ? 
       ORDER BY sort_order ASC, id ASC`,
      [product.id]
    );
    
    product.images = images.map(img => img.image_url);
    product.base_price = parseFloat(product.base_price || 0);
    product.sale_price = product.sale_price ? parseFloat(product.sale_price) : null;
    product.stock_quantity = parseInt(product.stock_quantity || 0);

    res.json(product);
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add new product - FIXED with proper stock handling
router.post('/products', checkSellerApproved, upload.array('images', 5), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Get form data from req.body
    const { 
      name, 
      category_id, 
      description, 
      base_price, 
      sale_price, 
      stock_quantity,
      tags,
      is_featured
    } = req.body;

    // Get uploaded files
    const files = req.files || [];
    
    // FIXED: Parse stock_quantity properly
    let stockQty = 0;
    if (stock_quantity !== undefined && stock_quantity !== null && stock_quantity !== '') {
      stockQty = parseInt(stock_quantity);
      if (isNaN(stockQty) || stockQty < 0) {
        stockQty = 0;
      }
    }
    
    console.log('Adding product:', { 
      name, 
      category_id, 
      base_price,
      stock_quantity: stockQty, // Log parsed stock
      filesCount: files.length,
      sellerId: req.seller.id
    });

    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Product name is required' });
    }
    
    if (!base_price || parseFloat(base_price) <= 0) {
      return res.status(400).json({ message: 'Valid base price is required' });
    }

    if (!category_id) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Generate unique slug
    const baseSlug = name.toLowerCase()
                         .replace(/\s+/g, '-')
                         .replace(/[^a-z0-9-]/g, '');
    const slug = baseSlug + '-' + Date.now();

    // Create image URLs array for JSON storage
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Insert product - with parsed stock_quantity
    const [result] = await connection.query(
      `INSERT INTO products 
       (seller_id, category_id, name, slug, description, base_price, sale_price, stock_quantity, tags, is_featured, status, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        req.seller.id,
        parseInt(category_id) || null,
        name.trim(),
        slug,
        description || null,
        parseFloat(base_price),
        sale_price ? parseFloat(sale_price) : null,
        stockQty, // Use parsed stock quantity
        tags || null,
        is_featured === 'true' || is_featured === true ? 1 : 0,
        'pending',
        1
      ]
    );

    const productId = result.insertId;

    // Insert into product_images table
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = `${baseUrl}/uploads/products/${file.filename}`;
        
        await connection.query(
          'INSERT INTO product_images (product_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)',
          [productId, imageUrl, name, i]
        );
      }
    }

    await connection.commit();

    // Get the created product
    const [product] = await connection.query(
      `SELECT p.*, c.name AS category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [productId]
    );
    
    // Get images for response
    const [productImages] = await connection.query(
      'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
      [productId]
    );
    
    const responseProduct = {
      ...product[0],
      images: productImages.map(img => img.image_url),
      stock_quantity: stockQty
    };
    
    res.status(201).json({
      success: true,
      message: 'Product added successfully and pending approval',
      product: responseProduct
    });

  } catch (err) {
    await connection.rollback();
    console.error('Add product error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.sqlMessage || err.message 
    });
  } finally {
    connection.release();
  }
});

// Update product
router.patch('/products/:id', checkSellerApproved, upload.array('images', 5), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Check if product exists and belongs to seller
    const [existing] = await connection.query(
      'SELECT * FROM products WHERE id = ? AND seller_id = ?',
      [req.params.id, req.seller.id]
    );

    if (!existing.length) {
      await connection.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = existing[0];
    const { 
      name, 
      base_price, 
      sale_price, 
      stock_quantity, 
      category_id, 
      description,
      tags,
      is_featured,
      existing_images 
    } = req.body;
    
    const files = req.files || [];
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    const updates = [];
    const values = [];
    
    if (name !== undefined && name.trim()) {
      updates.push('name = ?');
      values.push(name.trim());
      
      const newSlug = name.toLowerCase()
                         .replace(/\s+/g, '-')
                         .replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
      updates.push('slug = ?');
      values.push(newSlug);
    }
    
    if (base_price !== undefined) {
      updates.push('base_price = ?');
      values.push(parseFloat(base_price));
    }
    
    if (sale_price !== undefined) {
      updates.push('sale_price = ?');
      values.push(sale_price ? parseFloat(sale_price) : null);
    }
    
    if (stock_quantity !== undefined) {
      const stockQty = parseInt(stock_quantity) || 0;
      updates.push('stock_quantity = ?');
      values.push(stockQty);
    }
    
    if (category_id !== undefined) {
      updates.push('category_id = ?');
      values.push(category_id || null);
    }
    
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description || null);
    }
    
    if (tags !== undefined) {
      updates.push('tags = ?');
      values.push(tags || null);
    }
    
    if (is_featured !== undefined) {
      updates.push('is_featured = ?');
      values.push(is_featured === 'true' || is_featured === true ? 1 : 0);
    }
    
    if (updates.length > 0) {
      updates.push('updated_at = NOW()');
      values.push(req.params.id);
      
      await connection.query(
        `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Handle images
    let keepImages = [];
    if (existing_images) {
      try {
        keepImages = typeof existing_images === 'string' 
          ? JSON.parse(existing_images) 
          : existing_images;
      } catch (e) {
        console.error('Error parsing existing_images:', e);
      }
    }

    // Delete images that are not in keepImages
    if (keepImages.length > 0) {
      const placeholders = keepImages.map(() => '?').join(',');
      await connection.query(
        `DELETE FROM product_images WHERE product_id = ? AND image_url NOT IN (${placeholders})`,
        [req.params.id, ...keepImages]
      );
    } else {
      await connection.query('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);
    }

    // Add new images
    if (files.length > 0) {
      const [maxOrder] = await connection.query(
        'SELECT COALESCE(MAX(sort_order), -1) as max FROM product_images WHERE product_id = ?',
        [req.params.id]
      );
      
      let startOrder = maxOrder[0].max + 1;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = `${baseUrl}/uploads/products/${file.filename}`;
        
        await connection.query(
          'INSERT INTO product_images (product_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)',
          [req.params.id, imageUrl, name || product.name, startOrder + i]
        );
      }
    }

    await connection.commit();

    // Get updated product
    const [updated] = await connection.query(
      `SELECT p.*, c.name AS category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [req.params.id]
    );
    
    // Get updated images
    const [productImages] = await connection.query(
      'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC',
      [req.params.id]
    );
    
    const responseProduct = {
      ...updated[0],
      images: productImages.map(img => img.image_url)
    };
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: responseProduct
    });
  } catch (err) {
    await connection.rollback();
    console.error('Update product error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.sqlMessage || err.message 
    });
  } finally {
    connection.release();
  }
});

// Delete product
router.delete('/products/:id', checkSellerApproved, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const [existing] = await connection.query(
      'SELECT id FROM products WHERE id = ? AND seller_id = ?',
      [req.params.id, req.seller.id]
    );

    if (!existing.length) {
      await connection.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get images to delete files
    const [images] = await connection.query(
      'SELECT image_url FROM product_images WHERE product_id = ?',
      [req.params.id]
    );

    // Delete image files from disk
    images.forEach(img => {
      const filename = img.image_url.split('/').pop();
      const filePath = path.join(__dirname, '../uploads/products', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await connection.query('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);
    await connection.query('DELETE FROM cart WHERE product_id = ?', [req.params.id]);
    await connection.query('DELETE FROM cart_sessions WHERE product_id = ?', [req.params.id]);
    await connection.query('DELETE FROM wishlist WHERE product_id = ?', [req.params.id]);
    await connection.query('DELETE FROM products WHERE id = ?', [req.params.id]);

    await connection.commit();

    res.json({ 
      success: true,
      message: 'Product deleted successfully' 
    });
  } catch (err) {
    await connection.rollback();
    console.error('Delete product error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.sqlMessage || err.message 
    });
  } finally {
    connection.release();
  }
});

// ==================== ORDER MANAGEMENT ====================

// Get seller's orders
router.get('/orders', checkSellerApproved, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT
        o.id,
        o.order_number,
        o.total,
        o.status,
        o.payment_status,
        o.created_at,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(oi.id) as item_count,
        SUM(oi.quantity) as total_items
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE p.seller_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.seller.id]
    );

    res.json(rows);
  } catch (err) {
    console.error('Get seller orders error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get single order details
router.get('/orders/:id', checkSellerApproved, async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT DISTINCT
        o.*,
        u.first_name,
        u.last_name,
        u.email,
        a.address_line1,
        a.address_line2,
        a.city,
        a.state,
        a.postal_code,
        a.country,
        a.phone
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN addresses a ON o.shipping_address_id = a.id
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.id = ? AND p.seller_id = ?`,
      [req.params.id, req.seller.id]
    );
    
    if (!orders.length) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const [items] = await pool.query(
      `SELECT oi.*, p.name, p.slug 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [req.params.id]
    );
    
    res.json({
      ...orders[0],
      items
    });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update order status
router.patch('/orders/:id/status', checkSellerApproved, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Check if seller has items in this order
    const [check] = await pool.query(
      `SELECT oi.id 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ? AND p.seller_id = ?`,
      [req.params.id, req.seller.id]
    );
    
    if (!check.length) {
      return res.status(403).json({ message: 'You do not have permission to update this order' });
    }
    
    const [result] = await pool.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ 
      success: true,
      message: 'Order status updated successfully' 
    });
  } catch (err) {
    console.error('Update order error:', err);
    res.status(500).json({ message: err.message });
  }
});

// ==================== EARNINGS ====================

// Get earnings summary
router.get('/earnings', checkSellerApproved, async (req, res) => {
  try {
    const sellerId = req.seller.id;

    const [seller] = await pool.query(
      'SELECT balance, pending_balance FROM sellers WHERE id = ?',
      [sellerId]
    );
    
    const [totalEarnings] = await pool.query(
      `SELECT COALESCE(SUM(oi.total_price), 0) as total
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN products p ON oi.product_id = p.id
       WHERE p.seller_id = ? AND o.payment_status = 'paid'`,
      [sellerId]
    );
    
    const [pendingEarnings] = await pool.query(
      `SELECT COALESCE(SUM(oi.total_price), 0) as total
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN products p ON oi.product_id = p.id
       WHERE p.seller_id = ? AND o.payment_status = 'pending'`,
      [sellerId]
    );
    
    const [monthly] = await pool.query(
      `SELECT 
        DATE_FORMAT(o.created_at, '%Y-%m') as month,
        SUM(oi.total_price) as earnings
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE p.seller_id = ? AND o.payment_status = 'paid'
       GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
       ORDER BY month DESC
       LIMIT 6`,
      [sellerId]
    );
    
    res.json({
      success: true,
      stats: {
        total: parseFloat(totalEarnings[0]?.total || 0),
        available: parseFloat(seller[0]?.balance || 0),
        pending: parseFloat(pendingEarnings[0]?.total || 0),
        withdrawn: 0
      },
      monthlyEarnings: monthly.map(m => ({
        month: m.month,
        earnings: parseFloat(m.earnings || 0)
      }))
    });
  } catch (err) {
    console.error('Get earnings error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// Request withdrawal
router.post('/withdraw', checkSellerApproved, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }
    
    const [seller] = await connection.query(
      'SELECT balance FROM sellers WHERE id = ?',
      [req.seller.id]
    );
    
    if (!seller.length || seller[0].balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    await connection.query(
      'UPDATE sellers SET balance = balance - ?, pending_balance = pending_balance + ? WHERE id = ?',
      [amount, amount, req.seller.id]
    );
    
    await connection.commit();
    
    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully'
    });
    
  } catch (err) {
    await connection.rollback();
    console.error('Withdrawal error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  } finally {
    connection.release();
  }
});

// Debug endpoint to check seller info
router.get('/debug-info', auth, requireRole('seller'), async (req, res) => {
  try {
    // Get seller info
    const [seller] = await pool.query(
      'SELECT * FROM sellers WHERE user_id = ?',
      [req.user.id]
    );
    
    // Get products for this seller
    const [products] = await pool.query(
      'SELECT id, name, stock_quantity, status FROM products WHERE seller_id = ?',
      [seller.length ? seller[0].id : null]
    );
    
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      },
      seller: seller[0] || null,
      products: products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

