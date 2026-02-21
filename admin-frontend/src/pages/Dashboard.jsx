import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    pendingSellers: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      console.log('Dashboard data:', response.data); // For debugging
      setStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely format revenue
  const formatRevenue = (revenue) => {
    if (revenue === null || revenue === undefined) return '0.00';
    
    // Convert to number if it's a string
    const num = typeof revenue === 'string' ? parseFloat(revenue) : revenue;
    
    // Check if it's a valid number
    if (isNaN(num)) return '0.00';
    
    return num.toFixed(2);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="stats-grid">
        {/* Total Users */}
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats?.totalUsers || 0}</p>
            <Link to="/admin/sellers" className="stat-link">View All Users →</Link>
          </div>
        </div>

        {/* Total Sellers */}
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Sellers</h3>
            <p className="stat-number">{stats?.totalSellers || 0}</p>
            <Link to="/admin/sellers" className="stat-link">Manage Sellers →</Link>
          </div>
        </div>

        {/* Pending Sellers */}
        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Sellers</h3>
            <p className="stat-number">{stats?.pendingSellers || 0}</p>
            <Link to="/admin/sellers?status=pending" className="stat-link">Review →</Link>
          </div>
        </div>

        {/* Total Products */}
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-number">{stats?.totalProducts || 0}</p>
            <Link to="/admin/products" className="stat-link">Manage Products →</Link>
          </div>
        </div>

        {/* Pending Products */}
        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Products</h3>
            <p className="stat-number">{stats?.pendingProducts || 0}</p>
            <Link to="/admin/products?status=pending" className="stat-link">Review →</Link>
          </div>
        </div>

        {/* Total Orders */}
        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats?.totalOrders || 0}</p>
            <Link to="/admin/orders" className="stat-link">View Orders →</Link>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="stat-card success">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-number">ETB{formatRevenue(stats?.totalRevenue)}</p>
            <span className="stat-label">Lifetime earnings</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/admin/products?status=pending" className="action-card">
            <span className="action-icon">📦</span>
            <h4>Review Pending Products</h4>
            <p>{stats?.pendingProducts || 0} products awaiting approval</p>
          </Link>

          <Link to="/admin/sellers?status=pending" className="action-card">
            <span className="action-icon">👥</span>
            <h4>Review Seller Applications</h4>
            <p>{stats?.pendingSellers || 0} sellers awaiting approval</p>
          </Link>

          <Link to="/admin/categories" className="action-card">
            <span className="action-icon">📁</span>
            <h4>Manage Categories</h4>
            <p>Add, edit, or delete categories</p>
          </Link>

          <Link to="/admin/banners" className="action-card">
            <span className="action-icon">🖼️</span>
            <h4>Manage Banners</h4>
            <p>Update homepage banners</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity - Optional */}
      <div className="recent-activity">
        <h2>System Overview</h2>
        <div className="activity-stats">
          <div className="activity-item">
            <span className="activity-label">Users:</span>
            <span className="activity-value">{stats?.totalUsers || 0}</span>
          </div>
          <div className="activity-item">
            <span className="activity-label">Sellers:</span>
            <span className="activity-value">{stats?.totalSellers || 0}</span>
          </div>
          <div className="activity-item">
            <span className="activity-label">Products:</span>
            <span className="activity-value">{stats?.totalProducts || 0}</span>
          </div>
          <div className="activity-item">
            <span className="activity-label">Orders:</span>
            <span className="activity-value">{stats?.totalOrders || 0}</span>
          </div>
          <div className="activity-item">
            <span className="activity-label">Revenue:</span>
            <span className="activity-value">ETB{formatRevenue(stats?.totalRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}