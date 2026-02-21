

// backend/scripts/createAdmin.js
const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function createAdminUser() {
  try {
    const adminEmail = 'admin@example.com';
    
    // Check if admin exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ?', 
      [adminEmail]
    );
    
    if (existing.length === 0) {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const [result] = await pool.query(
        `INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [adminEmail, hashedPassword, 'Admin', 'User', 'admin', 1]
      );
      
      console.log('✅ Admin user created successfully!');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123');
      console.log('   Please change this password after first login!');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
}

module.exports = createAdminUser;