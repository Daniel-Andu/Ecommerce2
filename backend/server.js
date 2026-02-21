// backend/server.js
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
const cartRoutes = require('./routes/cart');  // Make sure this line exists
const ordersRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const addressesRoutes = require('./routes/addresses');
const bannersRoutes = require('./routes/banners');
const paymentRoutes = require('./routes/payment');
const reviewsRoutes = require('./routes/reviews');
const sellerRoutes = require('./routes/seller');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet({ 
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));

// CORS CONFIGURATION - Allow multiple origins (local dev + production)
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001', 
  'http://localhost:3002',
  'https://e-commerce-marketing.vercel.app', // ✅ Admin Frontend (LIVE)
  'https://e-commerce-marketing-tu4h.vercel.app', // ✅ Customer Frontend (LIVE)
  'https://e-commerce-backend-3i6r.onrender.com' // ✅ Backend itself (LIVE)
];

app.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Cart-Session']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);  // Make sure this line exists
app.use('/api/orders', ordersRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressesRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);

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
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log('  Server running on:');
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Payment API: http://localhost:${PORT}/api/payment`);
  console.log(`   CORS allowed origins:`, allowedOrigins);
});