


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function RegisterSeller() {
  const navigate = useNavigate();
  const { registerSeller } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    business_name: '',
    business_email: '',
    business_phone: '',
    business_address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await registerSeller(formData);
      toast.success('Application submitted! Pending approval.');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <div className="auth-logo">S</div>
          <h2>Become a Seller</h2>
          <p>Start selling your products today</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="First name"
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Last name"
              />
            </div>
          </div>
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email address"
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password (min 6 characters)"
              minLength={6}
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              required
              placeholder="Business name"
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              name="business_email"
              value={formData.business_email}
              onChange={handleChange}
              placeholder="Business email (optional)"
            />
          </div>
          
          <div className="form-group">
            <input
              type="tel"
              name="business_phone"
              value={formData.business_phone}
              onChange={handleChange}
              placeholder="Business phone (optional)"
            />
          </div>
          
          <div className="form-group">
            <textarea
              name="business_address"
              value={formData.business_address}
              onChange={handleChange}
              placeholder="Business address (optional)"
              rows="3"
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit' }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
          <p>Register as <Link to="/register">customer</Link></p>
        </div>
      </div>
    </div>
  );
}