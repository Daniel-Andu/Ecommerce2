



const express = require('express');
const pool = require('../config/db');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

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

    // Get sales stats
    const [stats] = await pool.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END), 0) AS totalSales,
        COUNT(*) AS totalOrders,
        COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END), 0) AS earnings
       FROM orders 
       WHERE seller_id = ?`,
      [sellerId]
    );
    
    // Get pending orders count
    const [pending] = await pool.query(
      `SELECT COUNT(*) AS count 
       FROM orders 
       WHERE seller_id = ? AND status = ?`,
      [sellerId, 'pending']
    );
    
    // Get recent products
    const [products] = await pool.query(
      `SELECT id, name, slug, base_price, sale_price, stock_quantity, status, created_at
       FROM products 
       WHERE seller_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [sellerId]
    );

    // Get balance from seller record
    const [balance] = await pool.query(
      'SELECT balance, pending_balance FROM sellers WHERE id = ?',
      [sellerId]
    );

    res.json({
      success: true,
      totalSales: stats[0].totalSales || 0,
      totalOrders: stats[0].totalOrders || 0,
      earnings: balance[0]?.balance || 0,
      pendingBalance: balance[0]?.pending_balance || 0,
      pendingOrders: pending[0]?.count || 0,
      products: products || []
    });
  } catch (err) {
    console.error('Seller dashboard error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== PRODUCT MANAGEMENT ====================

// Get seller's products (requires approved seller)
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

    res.json(rows);
  } catch (err) {
    console.error('Get seller products error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add new product (requires approved seller)
router.post('/products', checkSellerApproved, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { 
      name, 
      category_id, 
      description, 
      base_price, 
      sale_price, 
      sku, 
      stock_quantity,
      images = [] 
    } = req.body;

    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Product name is required' });
    }
    
    if (!base_price || base_price <= 0) {
      return res.status(400).json({ message: 'Valid base price is required' });
    }

    // Generate unique slug
    const baseSlug = name.toLowerCase()
                         .replace(/\s+/g, '-')
                         .replace(/[^a-z0-9-]/g, '');
    const slug = baseSlug + '-' + Date.now();

    // Insert product
    const [result] = await connection.query(
      `INSERT INTO products 
       (seller_id, category_id, name, slug, description, base_price, sale_price, sku, stock_quantity, status, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        req.seller.id,
        category_id || null,
        name.trim(),
        slug,
        description || null,
        parseFloat(base_price),
        sale_price ? parseFloat(sale_price) : null,
        sku || null,
        parseInt(stock_quantity) || 0,
        'pending', // Products start as pending for admin approval
        1
      ]
    );

    const productId = result.insertId;

    // Insert product images if provided
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await connection.query(
          'INSERT INTO product_images (product_id, image_url, alt_text, sort_order) VALUES (?, ?, ?, ?)',
          [productId, images[i].url, images[i].alt || name, i]
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
    
    res.status(201).json({
      success: true,
      message: 'Product added successfully and pending approval',
      product: product[0]
    });

  } catch (err) {
    await connection.rollback();
    console.error('Add product error:', err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
});

// Update product (requires approved seller)
router.patch('/products/:id', checkSellerApproved, async (req, res) => {
  try {
    // Check if product exists and belongs to seller
    const [existing] = await pool.query(
      'SELECT * FROM products WHERE id = ? AND seller_id = ?',
      [req.params.id, req.seller.id]
    );

    if (!existing.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = existing[0];
    const { name, base_price, sale_price, stock_quantity, category_id, description } = req.body;
    
    const updates = [];
    const values = [];
    
    if (name !== undefined && name.trim()) {
      updates.push('name = ?');
      values.push(name.trim());
      
      // Update slug if name changes
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
      updates.push('stock_quantity = ?');
      values.push(parseInt(stock_quantity));
    }
    
    if (category_id !== undefined) {
      updates.push('category_id = ?');
      values.push(category_id || null);
    }
    
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description || null);
    }
    
    if (updates.length > 0) {
      updates.push('updated_at = NOW()');
      values.push(req.params.id);
      
      await pool.query(
        `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Get updated product
    const [updated] = await pool.query(
      `SELECT p.*, c.name AS category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [req.params.id]
    );
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updated[0]
    });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete product (requires approved seller)
router.delete('/products/:id', checkSellerApproved, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Check if product exists and belongs to seller
    const [existing] = await connection.query(
      'SELECT id FROM products WHERE id = ? AND seller_id = ?',
      [req.params.id, req.seller.id]
    );

    if (!existing.length) {
      await connection.rollback();
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete product images first (foreign key constraint)
    await connection.query('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);
    
    // Delete cart items with this product
    await connection.query('DELETE FROM cart_items WHERE product_id = ?', [req.params.id]);
    
    // Delete wishlist entries
    await connection.query('DELETE FROM wishlists WHERE product_id = ?', [req.params.id]);
    
    // Finally delete the product
    await connection.query('DELETE FROM products WHERE id = ?', [req.params.id]);

    await connection.commit();

    res.json({ 
      success: true,
      message: 'Product deleted successfully' 
    });
  } catch (err) {
    await connection.rollback();
    console.error('Delete product error:', err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
});

// ==================== ORDER MANAGEMENT ====================

// Get seller's orders (requires approved seller)
router.get('/orders', checkSellerApproved, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.*, u.first_name, u.last_name, u.email,
              COUNT(oi.id) as item_count
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.seller_id = ? 
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
      `SELECT o.*, u.first_name, u.last_name, u.email,
              a.full_name, a.address_line1, a.address_line2, a.city, a.state, a.postal_code, a.country, a.phone
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       LEFT JOIN addresses a ON o.shipping_address_id = a.id
       WHERE o.id = ? AND o.seller_id = ?`,
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
    
    // Valid statuses
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const [result] = await pool.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ? AND seller_id = ?',
      [status, req.params.id, req.seller.id]
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
    // Get seller balance
    const [seller] = await pool.query(
      'SELECT balance, pending_balance FROM sellers WHERE id = ?',
      [req.seller.id]
    );
    
    // Get monthly earnings for chart
    const [monthly] = await pool.query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(total) as earnings
       FROM orders 
       WHERE seller_id = ? AND payment_status = 'paid'
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY month DESC
       LIMIT 6`,
      [req.seller.id]
    );
    
    res.json({
      success: true,
      balance: seller[0]?.balance || 0,
      pendingBalance: seller[0]?.pending_balance || 0,
      monthlyEarnings: monthly
    });
  } catch (err) {
    console.error('Get earnings error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;