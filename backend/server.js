require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const addressesRoutes = require('./routes/addresses');
const bannersRoutes = require('./routes/banners');
const paymentRoutes = require('./routes/payment');
const reviewsRoutes = require('./routes/reviews');
const sellerRoutes = require('./routes/seller');
const adminRoutes = require('./routes/admin');
const notificationsRoutes = require('./routes/notifications');
const returnsRoutes = require('./routes/returns');
const withdrawalsRoutes = require('./routes/withdrawals');
const shippingRoutes = require('./routes/shipping');
const couponsRoutes = require('./routes/coupons');
const reportsRoutes = require('./routes/reports');
const pagesRoutes = require('./routes/pages');
const searchRoutes = require('./routes/search');
const usersRoutes = require('./routes/users');
const variantsRoutes = require('./routes/variants');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting server...');
console.log('📁 Environment:', process.env.NODE_ENV);

// Middlewares
app.use(helmet({ 
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));

// CORS CONFIGURATION
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://e-commerce-marketing.vercel.app',
  'https://e-commerce-marketing-tu4h.vercel.app',
  'https://e-commerce-backend-3i6r.onrender.com',
  'https://admin-dashboard-final.vercel.app' // Add your new admin domain
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('❌ Blocked origin:', origin);
      return callback(null, true); // Allow anyway for now
    }
    console.log('✅ Allowed origin:', origin);
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

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Routes
console.log('📌 Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressesRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/withdrawals', withdrawalsRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/variants', variantsRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => res.json({ 
  status: 'ok', 
  time: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development'
}));

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 Not Found:', req.method, req.originalUrl);
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
app.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log('  Server running on:');
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  console.log('=================================');
  console.log('  Registered Routes:');
  console.log('   ✅ /api/auth');
  console.log('   ✅ /api/auth/login');
  console.log('   ✅ /api/auth/register');
  console.log('   ✅ /api/auth/me');
  console.log('   ✅ /api/admin');
  console.log('   ✅ /api/products');
  console.log('   ✅ /api/orders');
  console.log('=================================');
});





// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const path = require('path');
// const db = require('./config/db');

// // Import routes
// const authRoutes = require('./routes/auth');
// const categoriesRoutes = require('./routes/categories');
// const productsRoutes = require('./routes/products');
// const cartRoutes = require('./routes/cart');
// const ordersRoutes = require('./routes/orders');
// const wishlistRoutes = require('./routes/wishlist');
// const addressesRoutes = require('./routes/addresses');
// const bannersRoutes = require('./routes/banners');
// const paymentRoutes = require('./routes/payment');
// const reviewsRoutes = require('./routes/reviews');
// const sellerRoutes = require('./routes/seller');
// const adminRoutes = require('./routes/admin');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middlewares
// app.use(helmet({ 
//   crossOriginResourcePolicy: { policy: 'cross-origin' },
//   contentSecurityPolicy: false
// }));

// // CORS CONFIGURATION - FIXED
// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:3001',
//   'http://localhost:3002',
//   'https://e-commerce-marketing.vercel.app',
//   'https://e-commerce-marketing-tu4h.vercel.app',
//   'https://e-commerce-backend-3i6r.onrender.com'
// ];

// app.use(cors({
//   origin: function(origin, callback) {
//     // Allow requests with no origin (like mobile apps, curl, etc)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) === -1) {
//       console.log('❌ Blocked origin:', origin);
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     console.log('✅ Allowed origin:', origin);
//     return callback(null, true);
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Cart-Session']
// }));

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/categories', categoriesRoutes);
// app.use('/api/products', productsRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', ordersRoutes);
// app.use('/api/wishlist', wishlistRoutes);
// app.use('/api/addresses', addressesRoutes);
// app.use('/api/banners', bannersRoutes);
// app.use('/api/payment', paymentRoutes);
// app.use('/api/reviews', reviewsRoutes);
// app.use('/api/seller', sellerRoutes);
// app.use('/api/admin', adminRoutes);

// // Test route
// app.get('/api/test', (req, res) => {
//   res.json({ 
//     message: 'API is working!',
//     env: process.env.NODE_ENV,
//     time: new Date().toISOString()
//   });
// });

// // Health check
// app.get('/api/health', (req, res) => res.json({ 
//   status: 'ok', 
//   time: new Date().toISOString(),
//   environment: process.env.NODE_ENV || 'development'
// }));

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ 
//     message: 'Route not found',
//     path: req.originalUrl,
//     method: req.method
//   });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error('❌ Error:', err);
//   res.status(err.status || 500).json({ 
//     message: err.message || 'Internal server error',
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// });

// // Start server
// app.listen(PORT, '0.0.0.0', () => {
//   console.log('  Server running on:');
//   console.log(`   Local: http://localhost:${PORT}`);
//   console.log(`   API: http://localhost:${PORT}/api`);
//   console.log(`   Environment: ${process.env.NODE_ENV}`);
//   console.log(`   CORS allowed origins:`, allowedOrigins);
// });