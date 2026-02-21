

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SellerPending.css';

export default function SellerPending() {
  const { user, logout } = useAuth();

  return (
    <div className="pending-container">
      {/* Animated Background */}
      <div className="pending-bg">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>

      {/* Main Content */}
      <div className="pending-card">
        <div className="pending-icon">
          <span className="hourglass">⏳</span>
          <span className="checkmark">✓</span>
        </div>

        <h1>Application Pending Approval</h1>
        
        <div className="seller-info">
          <div className="info-item">
            <span className="info-label">Business Name:</span>
            <span className="info-value">{user?.business_name || 'Your Business'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className="status-badge pending">Pending Review</span>
          </div>
        </div>

        <div className="progress-steps">
          <div className="step completed">
            <div className="step-number">1</div>
            <div className="step-label">Application Submitted</div>
          </div>
          <div className="step active">
            <div className="step-number">2</div>
            <div className="step-label">Under Review</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-label">Approved</div>
          </div>
        </div>

        <div className="pending-message">
          <p>Thank you for applying to become a seller on our marketplace!</p>
          <p>Our team is currently reviewing your application. This process usually takes 1-2 business days.</p>
          <p>You'll receive an email notification once your account is approved.</p>
        </div>

        <div className="estimated-time">
          <span className="time-icon">⏱️</span>
          <span>Estimated review time: <strong>24-48 hours</strong></span>
        </div>

        <div className="action-buttons">
          <Link to="/" className="btn-home">
            <span className="btn-icon">🏠</span>
            Go to Homepage
          </Link>
          <button onClick={logout} className="btn-logout">
            <span className="btn-icon">🚪</span>
            Logout
          </button>
        </div>

        <div className="support-info">
          <p>Need help? <Link to="/contact">Contact Support</Link></p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="floating-elements">
        <div className="float-icon icon-1">📦</div>
        <div className="float-icon icon-2">🛍️</div>
        <div className="float-icon icon-3">💰</div>
        <div className="float-icon icon-4">⭐</div>
      </div>
    </div>
  );
}