// // backend/config/db.js
// const mysql = require('mysql2/promise');
// require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'ecommerce_marketplace',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // Function to test the connection
// const testConnection = async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log('✅ MySQL Connected:', process.env.DB_NAME);
//     connection.release();
//   } catch (err) {
//     console.error('❌ MySQL Connection Error:', err.message);
//     process.exit(1); // Stop server if DB connection fails
//   }
// };

// // Run the test immediately
// testConnection();

// module.exports = pool;







// // backend/config/db.js
// const mysql = require('mysql2/promise');
// const fs = require('fs');
// require('dotenv').config();

// const isProduction = process.env.NODE_ENV === 'production';

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   ssl: isProduction
//     ? {
//         ca: fs.readFileSync('./ca.pem'), // Make sure ca.pem is in backend folder
//       }
//     : false,
// });

// // Test DB connection
// const testConnection = async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log('✅ MySQL Connected:', process.env.DB_NAME);
//     connection.release();
//   } catch (err) {
//     console.error('❌ MySQL Connection Error:', err.message);
//     process.exit(1);
//   }
// };

// testConnection();

// module.exports = pool;





// backend/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// SSL configuration for TiDB Cloud
const sslConfig = process.env.NODE_ENV === 'production' ? {
  ssl: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  }
} : {};

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_marketplace',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...sslConfig // Add SSL only in production
});

// Function to test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connected:', {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      environment: process.env.NODE_ENV || 'development'
    });
    connection.release();
  } catch (err) {
    console.error('❌ MySQL Connection Error:', err.message);
    if (process.env.NODE_ENV === 'production') {
      console.error('Please check your TiDB Cloud connection settings');
    }
    process.exit(1); // Stop server if DB connection fails
  }
};

// Run the test immediately
testConnection();

module.exports = pool;