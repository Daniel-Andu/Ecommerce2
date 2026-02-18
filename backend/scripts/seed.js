// const bcrypt = require('bcryptjs');
// const pool = require('../config/db');
// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// async function seed() {
//   const hash = await bcrypt.hash('Admin123!', 10);
//   await pool.query(
//     `INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
//     ['admin@ecommerce.com', hash, 'Admin', 'User', 'admin']
//   );
//   console.log('Admin user seeded (email: admin@ecommerce.com, password: Admin123!)');
//   process.exit(0);
// }

// seed().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });


const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function seed() {
  try {
    const hash = await bcrypt.hash('Admin123!', 10);
    
    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) 
       VALUES (?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       password_hash = VALUES(password_hash),
       first_name = VALUES(first_name),
       last_name = VALUES(last_name),
       role = VALUES(role)`,
      ['admin@ecommerce.com', hash, 'Admin', 'User', 'admin', 1]
    );
    
    console.log('✅ Admin user seeded:');
    console.log('   Email: admin@ecommerce.com');
    console.log('   Password: Admin123!');
    
    // Seed sample categories if they don't exist
    const [categories] = await pool.query('SELECT COUNT(*) as count FROM categories');
    
    if (categories[0].count === 0) {
      await pool.query(`
        INSERT INTO categories (name, slug, sort_order) VALUES
        ('Electronics', 'electronics', 1),
        ('Fashion', 'fashion', 2),
        ('Home & Living', 'home-living', 3),
        ('Beauty', 'beauty', 4),
        ('Sports', 'sports', 5),
        ('Books', 'books', 6)
      `);
      console.log('✅ Sample categories seeded');
    }
    
    process.exit(0);
  } catch (e) {
    console.error('❌ Seed error:', e);
    process.exit(1);
  }
}

seed();