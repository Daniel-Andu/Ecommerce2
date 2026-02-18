



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { seller } from '../../api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './SellerDashboard.css';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    totalSales: 0,
    orders: 0,
    earnings: 0,
    pendingBalance: 0,
    pendingOrders: 0,
    products: []
  });
  const [loading, setLoading] = useState(true);
  const [sellerStatus, setSellerStatus] = useState(null);

  useEffect(() => {
    if (user?.seller) {
      setSellerStatus(user.seller.status);
    }
    if (user?.seller?.status === 'approved') {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      const dashboardData = await seller.dashboard();
      setData(dashboardData);
    } catch (error) {
      console.error('Dashboard load error:', error);
      if (!error.message.includes('pending approval')) {
        toast.error('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (sellerStatus === 'pending') {
    return (
      <div className="pending-approval">
        <div className="pending-card">
          <span className="pending-icon">⏳</span>
          <h2>Account Pending Approval</h2>
          <p>Your seller account is currently being reviewed by our admin team.</p>
          <p>You'll be able to access your dashboard once your account is approved.</p>
          <div className="pending-status">
            Status: <span className="badge badge-warning">Pending Approval</span>
          </div>
        </div>
      </div>
    );
  }

  if (sellerStatus === 'rejected') {
    return (
      <div className="pending-approval">
        <div className="pending-card rejected">
          <span className="pending-icon">❌</span>
          <h2>Application Rejected</h2>
          <p>Your seller application has been rejected.</p>
          <p>Please contact support for more information.</p>
        </div>
      </div>
    );
  }

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
          <span className="stat-label">Available Earnings</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-value">{data.pendingOrders || 0}</span>
          <span className="stat-label">Pending Orders</span>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/seller/products" className="action-card">
          <h3>📦 Manage Products</h3>
          <p>Add, edit or remove your products</p>
        </Link>
        
        <Link to="/seller/orders" className="action-card">
          <h3>📋 View Orders</h3>
          <p>Manage and update order status</p>
        </Link>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Products</h2>
          <Link to="/seller/products" className="btn btn-outline btn-small">View All</Link>
        </div>
        
        {data.products.length === 0 ? (
          <p className="empty-state">No products yet. <Link to="/seller/products">Add your first product</Link></p>
        ) : (
          <div className="products-table">
            <div className="table-header">
              <span>Product</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Status</span>
            </div>
            
            {data.products.slice(0, 5).map((product) => (
              <div key={product.id} className="table-row">
                <span className="product-name">{product.name}</span>
                <span>{Number(product.sale_price || product.base_price).toFixed(2)} birr</span>
                <span>{product.stock_quantity}</span>
                <span className={`status-badge ${product.status}`}>{product.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}