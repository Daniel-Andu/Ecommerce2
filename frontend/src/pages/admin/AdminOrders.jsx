import React, { useState, useEffect } from 'react';
import { admin } from '../../api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AdminOrders.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await admin.orders(filter !== 'all' ? filter : null);
      setOrders(data || []);
    } catch (error) {
      console.error('Load orders error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await admin.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      loadOrders();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'badge-warning';
      case 'confirmed': return 'badge-info';
      case 'processing': return 'badge-primary';
      case 'shipped': return 'badge-info';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="page-header">
        <h1>Manage Orders</h1>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button 
            className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
            onClick={() => setFilter('processing')}
          >
            Processing
          </button>
          <button 
            className={`filter-btn ${filter === 'shipped' ? 'active' : ''}`}
            onClick={() => setFilter('shipped')}
          >
            Shipped
          </button>
          <button 
            className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered
          </button>
          <button 
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No orders found</h3>
          <p>There are no orders matching your filter.</p>
        </div>
      ) : (
        <div className="orders-table">
          <div className="table-header">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Total</span>
            <span>Status</span>
            <span>Payment</span>
            <span>Actions</span>
          </div>
          
          {orders.map(order => (
            <div key={order.id} className="table-row">
              <span className="order-id">#{order.order_number || order.id}</span>
              <span className="customer">
                {order.user?.first_name} {order.user?.last_name}
                <br />
                <small>{order.user?.email}</small>
              </span>
              <span>{formatDate(order.created_at)}</span>
              <span className="total">{Number(order.total).toFixed(2)} birr</span>
              <span>
                <select 
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={`status-select ${getStatusBadgeClass(order.status)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </span>
              <span>
                <span className={`payment-badge ${order.payment_status}`}>
                  {order.payment_status}
                </span>
              </span>
              <span>
                <Link to={`/admin/orders/${order.id}`} className="btn-view">
                  View
                </Link>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}