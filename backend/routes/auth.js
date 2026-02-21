// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const pool = require('../config/db');
// const { auth } = require('../middleware/auth');

// const router = express.Router();

// // ==================== CUSTOMER REGISTRATION ====================
// router.post('/register', async (req, res) => {
//   try {
//     const { email, password, first_name, last_name, phone, role = 'customer' } = req.body;

//     console.log('Customer registration attempt:', email);

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     // Check if user exists
//     const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
//     if (existing.length) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user - using all columns from your database
//     const [result] = await pool.query(
//       `INSERT INTO users (
//         email, 
//         password_hash, 
//         first_name, 
//         last_name, 
//         phone, 
//         role, 
//         is_active,
//         email_verified,
//         phone_verified,
//         created_at,
//         updated_at
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
//       [
//         email, 
//         hashedPassword, 
//         first_name || null, 
//         last_name || null, 
//         phone || null, 
//         role, 
//         1, // is_active
//         0, // email_verified
//         0  // phone_verified
//       ]
//     );

//     // Generate token
//     const token = jwt.sign(
//       { userId: result.insertId, email, role },
//       process.env.JWT_SECRET || 'secret',
//       { expiresIn: '7d' }
//     );

//     console.log('Customer registered successfully:', email);

//     res.status(201).json({
//       token,
//       user: {
//         id: result.insertId,
//         email,
//         first_name,
//         last_name,
//         phone,
//         role
//       }
//     });
//   } catch (err) {
//     console.error('Register error:', err);
//     res.status(500).json({ 
//       message: 'Registration failed',
//       error: err.sqlMessage || err.message 
//     });
//   }
// });

// // ==================== SELLER REGISTRATION ====================
// router.post('/register/seller', async (req, res) => {
//   let connection;
//   try {
//     const { 
//       email, 
//       password, 
//       first_name, 
//       last_name, 
//       phone,
//       business_name,
//       business_address,
//       business_phone,
//       tax_id,
//       business_type
//     } = req.body;

//     console.log('Seller registration attempt:', { email, business_name });

//     // Validate required fields
//     if (!email || !password) {
//       return res.status(400).json({ 
//         message: 'Email and password are required' 
//       });
//     }

//     if (!business_name) {
//       return res.status(400).json({ 
//         message: 'Business name is required' 
//       });
//     }

//     // Check if user exists
//     const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
//     if (existing.length) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Get a connection for transaction
//     connection = await pool.getConnection();
//     await connection.beginTransaction();

//     // Insert into users table
//     const [userResult] = await connection.query(
//       `INSERT INTO users (
//         email, 
//         password_hash, 
//         first_name, 
//         last_name, 
//         phone, 
//         role, 
//         is_active,
//         email_verified,
//         phone_verified,
//         created_at,
//         updated_at
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
//       [
//         email, 
//         hashedPassword, 
//         first_name || null, 
//         last_name || null, 
//         phone || null, 
//         'seller', 
//         1, // is_active
//         0, // email_verified
//         0  // phone_verified
//       ]
//     );

//     const userId = userResult.insertId;

//     // Check if sellers table exists
//     const [tables] = await connection.query("SHOW TABLES LIKE 'sellers'");
    
//     let sellerId = null;
    
//     if (tables.length > 0) {
//       // Insert into sellers table
//       const [sellerResult] = await connection.query(
//         `INSERT INTO sellers (
//           user_id, 
//           business_name, 
//           business_address, 
//           business_phone, 
//           tax_id, 
//           business_type, 
//           status, 
//           created_at, 
//           updated_at
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
//         [
//           userId,
//           business_name,
//           business_address || null,
//           business_phone || phone || null,
//           tax_id || null,
//           business_type || 'individual',
//           'pending' // status - pending approval
//         ]
//       );
//       sellerId = sellerResult.insertId;
      
//       console.log('Seller record created with ID:', sellerId);
//     } else {
//       console.log('Sellers table does not exist, skipping seller record');
//     }

//     await connection.commit();

//     // Generate token
//     const token = jwt.sign(
//       { userId, email, role: 'seller' },
//       process.env.JWT_SECRET || 'secret',
//       { expiresIn: '7d' }
//     );

//     console.log('Seller registered successfully:', email);

//     res.status(201).json({
//       token,
//       user: {
//         id: userId,
//         email,
//         first_name,
//         last_name,
//         phone,
//         role: 'seller',
//         seller_id: sellerId,
//         business_name,
//         seller_status: 'pending'
//       }
//     });

//   } catch (err) {
//     if (connection) {
//       await connection.rollback();
//     }
//     console.error('Seller registration error:', err);
//     res.status(500).json({ 
//       message: 'Seller registration failed',
//       error: err.sqlMessage || err.message
//     });
//   } finally {
//     if (connection) {
//       connection.release();
//     }
//   }
// });

// // ==================== LOGIN ====================
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     console.log('Login attempt for:', email);

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     // Get user - using password_hash column
//     const [users] = await pool.query(
//       `SELECT 
//         id, 
//         email, 
//         password_hash, 
//         first_name, 
//         last_name, 
//         phone, 
//         role, 
//         is_active,
//         email_verified,
//         phone_verified,
//         profile_image
//       FROM users 
//       WHERE email = ?`,
//       [email]
//     );

//     if (!users.length) {
//       console.log('User not found:', email);
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const user = users[0];

//     // Check if account is active
//     if (!user.is_active) {
//       console.log('Inactive account:', email);
//       return res.status(401).json({ 
//         message: 'Account is inactive. Please contact admin.' 
//       });
//     }

//     // Verify password using password_hash
//     const validPassword = await bcrypt.compare(password, user.password_hash);
//     if (!validPassword) {
//       console.log('Invalid password for:', email);
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Remove password_hash from user object
//     delete user.password_hash;

//     // If user is seller, get seller status
//     if (user.role === 'seller') {
//       try {
//         const [sellers] = await pool.query(
//           'SELECT status, business_name FROM sellers WHERE user_id = ?',
//           [user.id]
//         );
        
//         if (sellers.length > 0) {
//           user.seller_status = sellers[0].status;
//           user.business_name = sellers[0].business_name;
//         } else {
//           user.seller_status = 'pending';
//         }
//       } catch (err) {
//         console.log('Could not fetch seller details:', err.message);
//         user.seller_status = 'pending';
//       }
//     }

//     // Generate token
//     const token = jwt.sign(
//       { userId: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET || 'secret',
//       { expiresIn: '7d' }
//     );

//     console.log('Login successful for:', email, 'Role:', user.role);

//     res.json({
//       token,
//       user
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ 
//       message: 'Login failed',
//       error: err.message 
//     });
//   }
// });

// // ==================== GET CURRENT USER ====================
// router.get('/me', auth, async (req, res) => {
//   try {
//     console.log('Getting user data for ID:', req.user.id);
    
//     // Get fresh user data
//     const [users] = await pool.query(
//       `SELECT 
//         id, 
//         email, 
//         first_name, 
//         last_name, 
//         phone, 
//         role, 
//         profile_image, 
//         email_verified, 
//         phone_verified, 
//         is_active 
//       FROM users 
//       WHERE id = ?`,
//       [req.user.id]
//     );
    
//     if (!users.length) {
//       console.log('User not found with ID:', req.user.id);
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const userData = users[0];
    
//     // If user is a seller, get seller info
//     if (userData.role === 'seller') {
//       try {
//         const [sellers] = await pool.query(
//           `SELECT 
//             id as seller_id,
//             business_name,
//             business_address,
//             business_phone,
//             tax_id,
//             business_type,
//             status as seller_status
//           FROM sellers 
//           WHERE user_id = ?`,
//           [req.user.id]
//         );
        
//         if (sellers.length > 0) {
//           userData.seller_id = sellers[0].seller_id;
//           userData.business_name = sellers[0].business_name;
//           userData.seller_status = sellers[0].seller_status;
//         } else {
//           // If no seller record but role is seller, set default
//           userData.seller_status = 'pending';
//         }
//       } catch (sellerErr) {
//         console.log('Sellers table might not exist:', sellerErr.message);
//         userData.seller_status = 'pending';
//       }
//     }
    
//     console.log('User data retrieved successfully:', userData.email);
//     res.json(userData);
    
//   } catch (err) {
//     console.error('Get me error:', err);
//     res.status(500).json({ 
//       message: 'Failed to get user data',
//       error: err.message 
//     });
//   }
// });

// // ==================== CHANGE PASSWORD ====================
// router.post('/change-password', auth, async (req, res) => {
//   try {
//     const { current_password, new_password } = req.body;

//     if (!current_password || !new_password) {
//       return res.status(400).json({ 
//         message: 'Current password and new password are required' 
//       });
//     }

//     if (new_password.length < 6) {
//       return res.status(400).json({ 
//         message: 'New password must be at least 6 characters' 
//       });
//     }

//     // Get user with password_hash
//     const [users] = await pool.query(
//       'SELECT password_hash FROM users WHERE id = ?',
//       [req.user.id]
//     );

//     if (!users.length) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Verify current password
//     const validPassword = await bcrypt.compare(current_password, users[0].password_hash);
//     if (!validPassword) {
//       return res.status(401).json({ message: 'Current password is incorrect' });
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(new_password, 10);

//     // Update password
//     await pool.query(
//       'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//       [hashedPassword, req.user.id]
//     );

//     res.json({ message: 'Password changed successfully' });
//   } catch (err) {
//     console.error('Change password error:', err);
//     res.status(500).json({ 
//       message: 'Failed to change password',
//       error: err.message 
//     });
//   }
// });

// // ==================== UPDATE PROFILE ====================
// router.patch('/profile', auth, async (req, res) => {
//   try {
//     const { first_name, last_name, phone } = req.body;

//     const [result] = await pool.query(
//       `UPDATE users 
//        SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
//        WHERE id = ?`,
//       [first_name || null, last_name || null, phone || null, req.user.id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Get updated user data
//     const [users] = await pool.query(
//       'SELECT id, email, first_name, last_name, phone, role FROM users WHERE id = ?',
//       [req.user.id]
//     );

//     res.json(users[0]);
//   } catch (err) {
//     console.error('Update profile error:', err);
//     res.status(500).json({ 
//       message: 'Failed to update profile',
//       error: err.message 
//     });
//   }
// });

// // ==================== UPLOAD PROFILE IMAGE ====================
// router.post('/profile/image', auth, async (req, res) => {
//   try {
//     // This would typically use multer for file upload
//     // For now, assuming image URL is sent in body
//     const { image_url } = req.body;

//     if (!image_url) {
//       return res.status(400).json({ message: 'Image URL is required' });
//     }

//     await pool.query(
//       'UPDATE users SET profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//       [image_url, req.user.id]
//     );

//     res.json({ message: 'Profile image updated successfully', image_url });
//   } catch (err) {
//     console.error('Upload profile image error:', err);
//     res.status(500).json({ 
//       message: 'Failed to upload profile image',
//       error: err.message 
//     });
//   }
// });

// // ==================== SETUP ADMIN (for development) ====================
// router.post('/setup-admin', async (req, res) => {
//   try {
//     const adminEmail = 'admin@example.com';
    
//     // Check if admin exists
//     const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    
//     if (existing.length === 0) {
//       // Create admin user
//       const hashedPassword = await bcrypt.hash('admin123', 10);
      
//       await pool.query(
//         `INSERT INTO users (
//           email, 
//           password_hash, 
//           first_name, 
//           last_name, 
//           role, 
//           is_active,
//           email_verified,
//           created_at,
//           updated_at
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
//         [adminEmail, hashedPassword, 'Admin', 'User', 'admin', 1, 1]
//       );
      
//       console.log('Admin user created successfully');
//       res.json({ message: 'Admin user created successfully' });
//     } else {
//       // Update existing user to admin if needed
//       await pool.query(
//         'UPDATE users SET role = ? WHERE email = ?',
//         ['admin', adminEmail]
//       );
//       console.log('Existing user updated to admin');
//       res.json({ message: 'Admin user already exists, role updated' });
//     }
//   } catch (err) {
//     console.error('Setup admin error:', err);
//     res.status(500).json({ 
//       message: 'Failed to setup admin',
//       error: err.message 
//     });
//   }
// });

// module.exports = router;





const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// ==================== CUSTOMER REGISTRATION ====================
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, role = 'customer' } = req.body;

    console.log('Customer registration attempt:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query(
      `INSERT INTO users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        phone, 
        role, 
        is_active,
        email_verified,
        phone_verified,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        email, 
        hashedPassword, 
        first_name || null, 
        last_name || null, 
        phone || null, 
        role, 
        1, 
        0, 
        0
      ]
    );

    const token = jwt.sign(
      { userId: result.insertId, email, role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log('Customer registered successfully:', email);

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        email,
        first_name,
        last_name,
        phone,
        role
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ 
      message: 'Registration failed',
      error: err.sqlMessage || err.message 
    });
  }
});

// ==================== SELLER REGISTRATION - FIXED VERSION ====================
router.post('/register/seller', async (req, res) => {
  let connection;
  try {
    const { 
      email, 
      password, 
      first_name, 
      last_name, 
      phone,
      business_name,
      business_address,
      business_phone,
      tax_id
      // IMPORTANT: business_type is REMOVED
    } = req.body;

    console.log('Seller registration attempt:', { email, business_name });

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    if (!business_name) {
      return res.status(400).json({ 
        message: 'Business name is required' 
      });
    }

    // Check if user exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get a connection for transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Insert into users table
    const [userResult] = await connection.query(
      `INSERT INTO users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        phone, 
        role, 
        is_active,
        email_verified,
        phone_verified,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        email, 
        hashedPassword, 
        first_name || null, 
        last_name || null, 
        phone || null, 
        'seller', 
        1, 
        0, 
        0
      ]
    );

    const userId = userResult.insertId;

    // IMPORTANT: This query matches your EXACT table structure
    // NO business_type column!
    const [sellerResult] = await connection.query(
      `INSERT INTO sellers (
        user_id, 
        business_name, 
        business_email,
        business_phone, 
        business_address, 
        tax_id, 
        status,
        balance,
        pending_balance,
        created_at, 
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userId,
        business_name,
        email,
        business_phone || phone || null,
        business_address || null,
        tax_id || null,
        'pending',
        0.00,
        0.00
      ]
    );
    
    const sellerId = sellerResult.insertId;
    console.log('Seller record created with ID:', sellerId);

    await connection.commit();

    // Generate token
    const token = jwt.sign(
      { userId, email, role: 'seller' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log('Seller registered successfully:', email);

    res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        first_name,
        last_name,
        phone,
        role: 'seller',
        seller_id: sellerId,
        business_name,
        seller_status: 'pending'
      }
    });

  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Seller registration error:', err);
    res.status(500).json({ 
      message: 'Seller registration failed',
      error: err.sqlMessage || err.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// ==================== LOGIN ====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [users] = await pool.query(
      `SELECT 
        id, 
        email, 
        password_hash, 
        first_name, 
        last_name, 
        phone, 
        role, 
        is_active,
        email_verified,
        phone_verified,
        profile_image
      FROM users 
      WHERE email = ?`,
      [email]
    );

    if (!users.length) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    if (!user.is_active) {
      console.log('Inactive account:', email);
      return res.status(401).json({ 
        message: 'Account is inactive. Please contact admin.' 
      });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    delete user.password_hash;

    // If user is seller, get seller status
    if (user.role === 'seller') {
      try {
        const [sellers] = await pool.query(
          'SELECT status, business_name FROM sellers WHERE user_id = ?',
          [user.id]
        );
        
        if (sellers.length > 0) {
          user.seller_status = sellers[0].status;
          user.business_name = sellers[0].business_name;
        } else {
          user.seller_status = 'pending';
        }
      } catch (err) {
        console.log('Could not fetch seller details:', err.message);
        user.seller_status = 'pending';
      }
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log('Login successful for:', email, 'Role:', user.role);

    res.json({
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      message: 'Login failed',
      error: err.message 
    });
  }
});

// ==================== GET CURRENT USER ====================
router.get('/me', auth, async (req, res) => {
  try {
    console.log('Getting user data for ID:', req.user.id);
    
    const [users] = await pool.query(
      `SELECT 
        id, 
        email, 
        first_name, 
        last_name, 
        phone, 
        role, 
        profile_image, 
        email_verified, 
        phone_verified, 
        is_active 
      FROM users 
      WHERE id = ?`,
      [req.user.id]
    );
    
    if (!users.length) {
      console.log('User not found with ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = users[0];
    
    if (userData.role === 'seller') {
      try {
        const [sellers] = await pool.query(
          `SELECT 
            id as seller_id,
            business_name,
            business_address,
            business_phone,
            tax_id,
            status as seller_status
          FROM sellers 
          WHERE user_id = ?`,
          [req.user.id]
        );
        
        if (sellers.length > 0) {
          userData.seller_id = sellers[0].seller_id;
          userData.business_name = sellers[0].business_name;
          userData.seller_status = sellers[0].seller_status;
        } else {
          userData.seller_status = 'pending';
        }
      } catch (sellerErr) {
        console.log('Could not fetch seller details:', sellerErr.message);
        userData.seller_status = 'pending';
      }
    }
    
    console.log('User data retrieved successfully:', userData.email);
    res.json(userData);
    
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ 
      message: 'Failed to get user data',
      error: err.message 
    });
  }
});

// ==================== CHANGE PASSWORD ====================
router.post('/change-password', auth, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters' 
      });
    }

    const [users] = await pool.query(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!users.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(current_password, users[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await pool.query(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ 
      message: 'Failed to change password',
      error: err.message 
    });
  }
});

// ==================== UPDATE PROFILE ====================
router.patch('/profile', auth, async (req, res) => {
  try {
    const { first_name, last_name, phone } = req.body;

    const [result] = await pool.query(
      `UPDATE users 
       SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [first_name || null, last_name || null, phone || null, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [users] = await pool.query(
      'SELECT id, email, first_name, last_name, phone, role FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json(users[0]);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ 
      message: 'Failed to update profile',
      error: err.message 
    });
  }
});

// ==================== UPLOAD PROFILE IMAGE ====================
router.post('/profile/image', auth, async (req, res) => {
  try {
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    await pool.query(
      'UPDATE users SET profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [image_url, req.user.id]
    );

    res.json({ message: 'Profile image updated successfully', image_url });
  } catch (err) {
    console.error('Upload profile image error:', err);
    res.status(500).json({ 
      message: 'Failed to upload profile image',
      error: err.message 
    });
  }
});

// ==================== SETUP ADMIN ====================
router.post('/setup-admin', async (req, res) => {
  try {
    const adminEmail = 'admin@example.com';
    
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    
    if (existing.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await pool.query(
        `INSERT INTO users (
          email, 
          password_hash, 
          first_name, 
          last_name, 
          role, 
          is_active,
          email_verified,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [adminEmail, hashedPassword, 'Admin', 'User', 'admin', 1, 1]
      );
      
      console.log('Admin user created successfully');
      res.json({ message: 'Admin user created successfully' });
    } else {
      await pool.query(
        'UPDATE users SET role = ? WHERE email = ?',
        ['admin', adminEmail]
      );
      console.log('Existing user updated to admin');
      res.json({ message: 'Admin user already exists, role updated' });
    }
  } catch (err) {
    console.error('Setup admin error:', err);
    res.status(500).json({ 
      message: 'Failed to setup admin',
      error: err.message 
    });
  }
});

module.exports = router;