

const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.slice(7);
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    const [rows] = await pool.query(
      'SELECT id, email, role, first_name, last_name, profile_image, is_active FROM users WHERE id = ?', 
      [decoded.userId]
    );
    
    if (!rows.length) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (!rows[0].is_active) {
      return res.status(401).json({ message: 'Account is inactive' });
    }
    
    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }
    
    const token = authHeader.slice(7);
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    const [rows] = await pool.query(
      'SELECT id, email, role, first_name, last_name, profile_image FROM users WHERE id = ?', 
      [decoded.userId]
    );
    
    req.user = rows[0] || null;
    next();
  } catch {
    req.user = null;
    next();
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

module.exports = { auth, optionalAuth, requireRole };