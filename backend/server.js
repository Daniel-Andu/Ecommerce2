

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const db = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const addressesRoutes = require('./routes/addresses');
const bannersRoutes = require('./routes/banners'); // Public banners
const paymentRoutes = require('./routes/payment');
const reviewsRoutes = require('./routes/reviews');
const sellerRoutes = require('./routes/seller');
const adminRoutes = require('./routes/admin');

// ❌ REMOVE THIS LINE - it's causing the error
// const adminBannerRoutes = require('./routes/admin/bannerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet({ 
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));

app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== PUBLIC ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressesRoutes);
app.use('/api/banners', bannersRoutes); // Public banners
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/seller', sellerRoutes);

// ==================== ADMIN ROUTES ====================
app.use('/api/admin', adminRoutes);
// ❌ REMOVE THIS LINE TOO
// app.use('/api/admin/banners', adminBannerRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ 
  status: 'ok', 
  time: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development'
}));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  if (err.code === 'ER_DATA_TOO_LONG') {
    return res.status(400).json({ 
      message: 'Data too long for column. Please check your input.'
    });
  }
  
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ 
      message: 'Duplicate entry. This record already exists.'
    });
  }
  
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ MySQL Connected Successfully');
    
    // Check and fix banners table
    await fixBannersTable(connection);
    
    connection.release();

    app.listen(PORT, () => {
      console.log('🚀 Server running on:');
      console.log(`   Local: http://localhost:${PORT}`);
      // console.log(`   Public Banners: http://localhost:${PORT}/api/banners`);
    });

  } catch (err) {
    console.error('❌ MySQL Connection Error:', err.message);
    process.exit(1);
  }
})();

// Helper function to fix banners table
async function fixBannersTable(connection) {
  try {
    // Check if banners table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'banners'"
    );
    
    if (tables.length === 0) {
      console.log('📦 Creating banners table...');
      await connection.query(`
        CREATE TABLE banners (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255),
          image_url TEXT NOT NULL,
          link_url VARCHAR(1000),
          sort_order INT DEFAULT 0,
          is_active TINYINT(1) DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Banners table created');
    } else {
      // Check image_url column type
      const [columns] = await connection.query(
        "SHOW COLUMNS FROM banners WHERE Field = 'image_url'"
      );
      
      if (columns.length > 0 && columns[0].Type.includes('varchar')) {
        // console.log('📝 Updating image_url column to TEXT...');
        await connection.query('ALTER TABLE banners MODIFY image_url TEXT');
        
      }
      
      // Check link_url column
      const [linkColumn] = await connection.query(
        "SHOW COLUMNS FROM banners WHERE Field = 'link_url'"
      );
      
      if (linkColumn.length > 0 && linkColumn[0].Type.includes('varchar')) {
        await connection.query('ALTER TABLE banners MODIFY link_url VARCHAR(1000)');
      }
    }
  } catch (err) {
    console.error('Error fixing banners table:', err);
  }
}