
import React, { useState, useEffect } from 'react';
import { admin } from '../../api';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await admin.dashboard();
      setStats(data);
    } catch (error) {
      console.error('Dashboard load error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" /> Loading dashboard...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.totalUsers?.toLocaleString() || 0}</span>
          <span className="stat-label">Total Users</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-value">{stats.totalSellers?.toLocaleString() || 0}</span>
          <span className="stat-label">Approved Sellers</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-value">{stats.totalProducts?.toLocaleString() || 0}</span>
          <span className="stat-label">Total Products</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-value">{stats.totalOrders?.toLocaleString() || 0}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        
        <div className="stat-card revenue">
          <span className="stat-value">{Number(stats.totalRevenue || 0).toLocaleString()} birr</span>
          <span className="stat-label">Total Revenue</span>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <a href="/admin/sellers" className="action-card">
            <h3>👥 Pending Sellers</h3>
            <p>Review and approve seller applications</p>
          </a>
          
          <a href="/admin/products" className="action-card">
            <h3>📦 Pending Products</h3>
            <p>Review and approve products</p>
          </a>
          
          <a href="/admin/categories" className="action-card">
            <h3>📁 Manage Categories</h3>
            <p>Add or edit product categories</p>
          </a>
          
          <a href="/admin/banners" className="action-card">
            <h3>🖼️ Manage Banners</h3>
            <p>Update homepage banners</p>
          </a>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Activity</h2>
        <div className="activity-placeholder">
          <p>Sales reports and charts will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}