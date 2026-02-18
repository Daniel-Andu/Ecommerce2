



const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/profile-images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Register customer
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password, first_name, last_name, phone } = req.body;
    
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, role, profile_image, email_verified, phone_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [email, hash, first_name, last_name, phone || null, 'customer', null, 0, 0, 1]
    );
    
    const userId = result.insertId;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    
    const [user] = await pool.query(
      'SELECT id, email, first_name, last_name, role, profile_image, email_verified, phone_verified, is_active, created_at FROM users WHERE id = ?', 
      [userId]
    );
    
    res.status(201).json({ 
      message: 'Registered successfully', 
      token, 
      user: user[0] 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Register seller
router.post('/register/seller', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('first_name').trim().notEmpty(),
  body('last_name').trim().notEmpty(),
  body('business_name').trim().notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password, first_name, last_name, business_name, business_email, business_phone, business_address, tax_id } = req.body;
    
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const hash = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    
    try {
      await conn.beginTransaction();
      
      const [userResult] = await conn.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, role, profile_image, email_verified, phone_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [email, hash, first_name, last_name, 'seller', null, 0, 0, 1]
      );
      
      const userId = userResult.insertId;
      
      await conn.query(
        'INSERT INTO sellers (user_id, business_name, business_email, business_phone, business_address, tax_id, status, balance, pending_balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, business_name, business_email || email, business_phone || null, business_address || null, tax_id || null, 'pending', 0, 0]
      );
      
      await conn.commit();
      
      const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      
      const [user] = await pool.query(
        'SELECT id, email, first_name, last_name, role, profile_image FROM users WHERE id = ?', 
        [userId]
      );
      
      res.status(201).json({ 
        message: 'Seller registration submitted. Awaiting approval.', 
        token, 
        user: user[0] 
      });
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Seller registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    
    const [rows] = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name, role, profile_image, is_active FROM users WHERE email = ?', 
      [email]
    );
    
    if (!rows.length || !rows[0].is_active) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    
    delete user.password_hash;
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        first_name: user.first_name, 
        last_name: user.last_name, 
        role: user.role, 
        profile_image: user.profile_image,
        is_active: user.is_active
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user with seller info
router.get('/me', auth, async (req, res) => {
  try {
    const [seller] = await pool.query(
      'SELECT id, business_name, business_email, business_phone, business_address, tax_id, status, balance, pending_balance FROM sellers WHERE user_id = ?', 
      [req.user.id]
    );
    
    res.json({ 
      ...req.user, 
      seller: seller[0] || null 
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.patch('/profile', auth, [
  body('first_name').optional().trim(),
  body('last_name').optional().trim(),
  body('phone').optional().trim(),
], async (req, res) => {
  try {
    const { first_name, last_name, phone } = req.body;
    
    await pool.query(
      'UPDATE users SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name), phone = COALESCE(?, phone), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [first_name, last_name, phone, req.user.id]
    );
    
    const [user] = await pool.query(
      'SELECT id, email, first_name, last_name, phone, role, profile_image, email_verified, phone_verified, is_active, created_at FROM users WHERE id = ?', 
      [req.user.id]
    );
    
    res.json(user[0]);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload profile image
router.post('/profile/image', auth, upload.single('profile_image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    // Get old profile image to delete
    const [oldUser] = await pool.query(
      'SELECT profile_image FROM users WHERE id = ?',
      [req.user.id]
    );
    
    // Delete old image if exists
    if (oldUser[0]?.profile_image) {
      const oldPath = path.join(__dirname, '..', oldUser[0].profile_image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    
    const imageUrl = '/uploads/profile-images/' + req.file.filename;
    
    await pool.query(
      'UPDATE users SET profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [imageUrl, req.user.id]
    );
    
    const [user] = await pool.query(
      'SELECT id, email, first_name, last_name, phone, role, profile_image FROM users WHERE id = ?',
      [req.user.id]
    );
    
    res.json(user[0]);
  } catch (err) {
    console.error('Profile image upload error:', err);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// Change password
router.post('/change-password', auth, [
  body('current_password').notEmpty(),
  body('new_password').isLength({ min: 6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    
    const valid = await bcrypt.compare(req.body.current_password, rows[0].password_hash);
    if (!valid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    const hash = await bcrypt.hash(req.body.new_password, 10);
    await pool.query('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [hash, req.user.id]);
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify email (you can implement this with a verification token)
router.post('/verify-email/:token', async (req, res) => {
  try {
    // Implement email verification logic
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;