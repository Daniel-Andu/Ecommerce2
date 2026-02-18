


const express = require('express');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all addresses for user
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id', 
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get addresses error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add new address
router.post('/', auth, async (req, res) => {
  try {
    const { 
      label, full_name, phone, address_line1, address_line2, 
      city, state, postal_code, country, is_default 
    } = req.body;
    
    // Validate required fields
    if (!full_name || !address_line1 || !city) {
      return res.status(400).json({ 
        message: 'Full name, address line 1, and city are required' 
      });
    }
    
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // If this address is default, unset any existing default
      if (is_default) {
        await connection.query(
          'UPDATE addresses SET is_default = 0 WHERE user_id = ?', 
          [req.user.id]
        );
      }
      
      const [result] = await connection.query(
        `INSERT INTO addresses 
         (user_id, label, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id, 
          label || 'Home', 
          full_name, 
          phone || null, 
          address_line1, 
          address_line2 || null, 
          city, 
          state || null, 
          postal_code || null, 
          country || 'Ethiopia', 
          is_default ? 1 : 0
        ]
      );
      
      await connection.commit();
      
      const [newAddress] = await pool.query(
        'SELECT * FROM addresses WHERE id = ?', 
        [result.insertId]
      );
      
      res.status(201).json(newAddress[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Add address error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update address
router.patch('/:id', auth, async (req, res) => {
  try {
    const { 
      label, full_name, phone, address_line1, address_line2, 
      city, state, postal_code, country, is_default 
    } = req.body;
    
    // Check if address exists and belongs to user
    const [existing] = await pool.query(
      'SELECT id FROM addresses WHERE id = ? AND user_id = ?', 
      [req.params.id, req.user.id]
    );
    
    if (!existing.length) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // If setting as default, unset any existing default
      if (is_default) {
        await connection.query(
          'UPDATE addresses SET is_default = 0 WHERE user_id = ?', 
          [req.user.id]
        );
      }
      
      // Build update query dynamically
      const updates = [];
      const values = [];
      
      if (label !== undefined) { 
        updates.push('label = ?'); 
        values.push(label); 
      }
      if (full_name !== undefined) { 
        updates.push('full_name = ?'); 
        values.push(full_name); 
      }
      if (phone !== undefined) { 
        updates.push('phone = ?'); 
        values.push(phone); 
      }
      if (address_line1 !== undefined) { 
        updates.push('address_line1 = ?'); 
        values.push(address_line1); 
      }
      if (address_line2 !== undefined) { 
        updates.push('address_line2 = ?'); 
        values.push(address_line2); 
      }
      if (city !== undefined) { 
        updates.push('city = ?'); 
        values.push(city); 
      }
      if (state !== undefined) { 
        updates.push('state = ?'); 
        values.push(state); 
      }
      if (postal_code !== undefined) { 
        updates.push('postal_code = ?'); 
        values.push(postal_code); 
      }
      if (country !== undefined) { 
        updates.push('country = ?'); 
        values.push(country); 
      }
      if (is_default !== undefined) { 
        updates.push('is_default = ?'); 
        values.push(is_default ? 1 : 0); 
      }
      
      if (updates.length) {
        values.push(req.params.id, req.user.id);
        await connection.query(
          `UPDATE addresses SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`, 
          values
        );
      }
      
      await connection.commit();
      
      const [updated] = await pool.query(
        'SELECT * FROM addresses WHERE id = ? AND user_id = ?', 
        [req.params.id, req.user.id]
      );
      
      res.json(updated[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Update address error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete address
router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM addresses WHERE id = ? AND user_id = ?', 
      [req.params.id, req.user.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    console.error('Delete address error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
