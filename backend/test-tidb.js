
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testing TiDB Cloud connection...');
  console.log('Host:', process.env.DB_HOST);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 4000,
      ssl: {
        rejectUnauthorized: true
      },
      connectTimeout: 30000
    });
    
    console.log('✅ Connected to TiDB Cloud!');
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 + 1 as result');
    console.log('✅ Test query result:', rows[0].result);
    
    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 Tables in database:', tables.map(t => Object.values(t)[0]));
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n🔧 Troubleshooting:');
      console.error('1. Check if hostname is correct:', process.env.DB_HOST);
      console.error('2. Check your internet connection');
      console.error('3. Try pinging the host: ping', process.env.DB_HOST);
      console.error('4. Check TiDB Cloud dashboard for correct hostname');
      console.error('5. Make sure your IP is whitelisted in TiDB Cloud');
    }
  }
}

testConnection();


