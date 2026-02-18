import React, { useState, useEffect } from 'react';
import { admin } from '../api';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [data, setData] = useState({ totalUsers: 0, totalSellers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin.dashboard().then(setData).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner" /> Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{Number(data.totalUsers || 0).toLocaleString()}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{Number(data.totalSellers || 0).toLocaleString()}</span>
          <span className="stat-label">Total Sellers</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{Number(data.totalOrders || 0).toLocaleString()}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{Number(data.totalRevenue || 0).toLocaleString()} birr</span>
          <span className="stat-label">Total Revenue</span>
        </div>
      </div>
      <section className="dashboard-section">
        <h2>Sales Overview</h2>
        <p className="muted">Sales reports (daily, monthly, yearly) can be added here.</p>
      </section>
    </div>
  );
}
