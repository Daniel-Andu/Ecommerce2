import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { seller } from '../api';
import toast from 'react-hot-toast';
import './SellerDashboard.css';

export default function SellerDashboard() {
  const [data, setData] = useState({ totalSales: 0, orders: 0, earnings: 0, pendingOrders: 0, products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seller.dashboard().then(setData).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="spinner" /> Loading...</div>;

  return (
    <div className="seller-dashboard">
      <h1>Seller Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{Number(data.totalSales || 0).toLocaleString()} birr</span>
          <span className="stat-label">Total Sales</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{data.orders || 0}</span>
          <span className="stat-label">Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{Number(data.earnings || 0).toLocaleString()} birr</span>
          <span className="stat-label">Earnings</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{data.pendingOrders || 0}</span>
          <span className="stat-label">Pending Orders</span>
        </div>
      </div>
      <section className="dashboard-section">
        <h2>Recent Products</h2>
        <Link to="/seller/products" className="btn btn-outline">Manage Products</Link>
        {(data.products || []).length === 0 ? (
          <p className="empty-state">No products yet. <Link to="/seller/products">Add product</Link>.</p>
        ) : (
          <div className="products-table">
            {(data.products || []).slice(0, 10).map((p) => (
              <div key={p.id} className="product-row">
                <span>{p.name}</span>
                <span>{Number(p.sale_price || p.base_price).toFixed(2)} birr </span>
                <span>{p.stock_quantity} in stock</span>
                <span className="status-badge">{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
