


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orders } from '../api';
import toast from 'react-hot-toast';
import './MyOrders.css';

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned'
};

export default function MyOrders() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orders.my();
      setList(data || []);
    } catch (error) {
      console.error('Load orders error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading container">
        <div className="spinner" /> Loading orders...
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <h1>My Orders</h1>
        {list.length === 0 ? (
          <div className="empty-state">
            <p>No orders yet.</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {list.map((order) => (
              <Link to={'/orders/' + order.id} key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-number">{order.order_number}</span>
                  <span className={`order-status status-${order.status}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <div className="order-meta">
                  <span>Total: {Number(order.total).toFixed(2)} birr</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}