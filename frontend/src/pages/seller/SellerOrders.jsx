


import React, { useState, useEffect } from 'react';
import { seller } from '../../api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './SellerOrders.css';

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export default function SellerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [sellerStatus, setSellerStatus] = useState(null);

  useEffect(() => {
    if (user?.seller) {
      setSellerStatus(user.seller.status);
    }
    if (user?.seller?.status === 'approved') {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const data = await seller.orders();
      setOrders(data || []);
    } catch (error) {
      console.error('Load orders error:', error);
      if (!error.message.includes('pending approval')) {
        toast.error('Failed to load orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await seller.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${STATUS_LABELS[newStatus]}`);
      await loadOrders();
      setSelectedOrder(null);
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
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
          <p>Your seller account is currently being reviewed.</p>
          <p>You'll be able to manage orders once approved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-orders-page">
      <h1>Order Management</h1>
      
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="orders-table">
          <div className="table-header">
            <span>Order #</span>
            <span>Customer</span>
            <span>Total</span>
            <span>Status</span>
            <span>Date</span>
            <span>Actions</span>
          </div>
          
          {orders.map(order => (
            <div key={order.id} className="table-row">
              <span className="order-number">{order.order_number}</span>
              <span>{order.first_name} {order.last_name}</span>
              <span>{Number(order.total).toFixed(2)} birr</span>
              <span className={`status-badge ${order.status}`}>
                {STATUS_LABELS[order.status] || order.status}
              </span>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
              <button 
                className="btn-small"
                onClick={() => setSelectedOrder(order)}
              >
                Update
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Update Order Status</h3>
            <p className="order-info">
              Order: {selectedOrder.order_number}<br />
              Current Status: <span className={`status-badge ${selectedOrder.status}`}>
                {STATUS_LABELS[selectedOrder.status] || selectedOrder.status}
              </span>
            </p>
            
            <div className="status-options">
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <button
                  key={value}
                  className={`status-option ${value === selectedOrder.status ? 'active' : ''}`}
                  onClick={() => handleStatusUpdate(selectedOrder.id, value)}
                  disabled={updating || value === selectedOrder.status}
                >
                  {label}
                </button>
              ))}
            </div>
            
            <button 
              className="btn btn-outline btn-block"
              onClick={() => setSelectedOrder(null)}
              disabled={updating}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}