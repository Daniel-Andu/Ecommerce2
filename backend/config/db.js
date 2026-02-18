// backend/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_marketplace',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Connected:', process.env.DB_NAME);
    connection.release();
  } catch (err) {
    console.error('❌ MySQL Connection Error:', err.message);
    process.exit(1); // Stop server if DB connection fails
  }
};

// Run the test immediately
testConnection();

module.exports = pool;