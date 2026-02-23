// // // backend/config/db.js
// // const mysql = require('mysql2/promise');
// // require('dotenv').config();

// // const pool = mysql.createPool({
// //   host: process.env.DB_HOST || 'localhost',
// //   user: process.env.DB_USER || 'root',
// //   password: process.env.DB_PASSWORD || '',
// //   database: process.env.DB_NAME || 'ecommerce_marketplace',
// //   waitForConnections: true,
// //   connectionLimit: 10,
// //   queueLimit: 0,
// // });

// // // Function to test the connection
// // const testConnection = async () => {
// //   try {
// //     const connection = await pool.getConnection();
// //     console.log('✅ MySQL Connected:', process.env.DB_NAME);
// //     connection.release();
// //   } catch (err) {
// //     console.error('❌ MySQL Connection Error:', err.message);
// //     process.exit(1); // Stop server if DB connection fails
// //   }
// // };

// // // Run the test immediately
// // testConnection();

// // module.exports = pool;







// // // backend/config/db.js
// // const mysql = require('mysql2/promise');
// // const fs = require('fs');
// // require('dotenv').config();

// // const isProduction = process.env.NODE_ENV === 'production';

// // const pool = mysql.createPool({
// //   host: process.env.DB_HOST,
// //   port: process.env.DB_PORT,
// //   user: process.env.DB_USER,
// //   password: process.env.DB_PASSWORD,
// //   database: process.env.DB_NAME,
// //   waitForConnections: true,
// //   connectionLimit: 10,
// //   queueLimit: 0,
// //   ssl: isProduction
// //     ? {
// //         ca: fs.readFileSync('./ca.pem'), // Make sure ca.pem is in backend folder
// //       }
// //     : false,
// // });

// // // Test DB connection
// // const testConnection = async () => {
// //   try {
// //     const connection = await pool.getConnection();
// //     console.log('✅ MySQL Connected:', process.env.DB_NAME);
// //     connection.release();
// //   } catch (err) {
// //     console.error('❌ MySQL Connection Error:', err.message);
// //     process.exit(1);
// //   }
// // };

// // testConnection();

// // module.exports = pool;





// // backend/config/db.js
// const mysql = require('mysql2/promise');
// require('dotenv').config();

// // SSL configuration for TiDB Cloud
// const sslConfig = process.env.NODE_ENV === 'production' ? {
//   ssl: {
//     rejectUnauthorized: true,
//     minVersion: 'TLSv1.2'
//   }
// } : {};

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'ecommerce_marketplace',
//   port: process.env.DB_PORT || 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   ...sslConfig // Add SSL only in production
// });

// // Function to test the connection
// const testConnection = async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log('✅ MySQL Connected:', {
//       host: process.env.DB_HOST,
//       database: process.env.DB_NAME,
//       environment: process.env.NODE_ENV || 'development'
//     });
//     connection.release();
//   } catch (err) {
//     console.error('❌ MySQL Connection Error:', err.message);
//     if (process.env.NODE_ENV === 'production') {
//       console.error('Please check your TiDB Cloud connection settings');
//     }
//     process.exit(1); // Stop server if DB connection fails
//   }
// };

// // Run the test immediately
// testConnection();

// module.exports = pool;



// backend/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// TiDB Cloud requires SSL with specific configuration
const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000, // 60 seconds timeout for cloud connection
  acquireTimeout: 60000,
};

// Add SSL for production (TiDB Cloud requires SSL)
if (isProduction) {
  poolConfig.ssl = {
    rejectUnauthorized: true,
    // TiDB Cloud works with default SSL settings
    // No need for CA file with mysql2
  };
  console.log('🔒 SSL enabled for TiDB Cloud connection');
}

const pool = mysql.createPool(poolConfig);

// Function to test the connection
const testConnection = async () => {
  try {
    console.log('🔄 Attempting to connect to database...');
    console.log('   Host:', process.env.DB_HOST);
    console.log('   Database:', process.env.DB_NAME);
    console.log('   Environment:', process.env.NODE_ENV || 'development');
    console.log('   SSL:', isProduction ? 'Enabled' : 'Disabled');
    
    const connection = await pool.getConnection();
    
    // Run a simple query to verify connection
    const [result] = await connection.query('SELECT 1 + 1 AS solution');
    console.log('✅ Database connected successfully!');
    console.log('   Test query result:', result[0].solution);
    
    // Check if we can access the tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📊 Tables in database:', tables.length);
    
    connection.release();
    return true;
  } catch (err) {
    console.error('❌ Database Connection Error:');
    console.error('   Code:', err.code);
    console.error('   Message:', err.message);
    
    if (err.code === 'ENOTFOUND') {
      console.error('\n🔧 Troubleshooting Tips:');
      console.error('1. Check if the hostname is correct:', process.env.DB_HOST);
      console.error('2. Verify your internet connection');
      console.error('3. Make sure TiDB Cloud cluster is running');
      console.error('4. Check if your IP is whitelisted in TiDB Cloud');
      console.error('5. Try pinging the host: ping', process.env.DB_HOST);
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n🔧 Troubleshooting Tips:');
      console.error('1. Check username and password');
      console.error('2. Verify database name is correct');
    } else if (err.code === 'ETIMEDOUT') {
      console.error('\n🔧 Troubleshooting Tips:');
      console.error('1. Connection timeout - check network/firewall');
      console.error('2. TiDB Cloud might be slow to respond');
      console.error('3. Try increasing connectTimeout in pool config');
    }
    
    // Don't exit in production, let the server try to recover
    if (!isProduction) {
      process.exit(1);
    }
    return false;
  }
};

// Run the test immediately for development, but don't block production startup
if (!isProduction) {
  testConnection();
} else {
  // In production, test connection but don't exit on failure
  testConnection().catch(console.error);
}

// Export the pool with promise wrapper
module.exports = pool;

// Also export a function to test connection programmatically
module.exports.testConnection = testConnection;