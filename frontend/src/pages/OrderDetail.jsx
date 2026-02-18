


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orders } from '../api';
import toast from 'react-hot-toast';
import './OrderDetail.css';

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned'
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await orders.get(id);
      setOrder(data);
    } catch (error) {
      console.error('Load order error:', error);
      toast.error('Order not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading container">
        <div className="spinner" /> Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container not-found">
        <h1>Order Not Found</h1>
        <Link to="/orders" className="btn btn-primary">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="container">
        <Link to="/orders" className="back-link">← Back to Orders</Link>
        
        <h1>Order {order.order_number}</h1>
        
        <div className="order-detail-layout">
          <div className="order-info">
            <div className="info-card">
              <h3>Order Status</h3>
              <p className={`status-badge ${order.status}`}>
                {STATUS_LABELS[order.status] || order.status}
              </p>
              
              <h3>Payment Status</h3>
              <p className={`status-badge ${order.payment_status}`}>
                {order.payment_status}
              </p>
              
              <h3>Order Date</h3>
              <p>{new Date(order.created_at).toLocaleString()}</p>
            </div>
            
            {order.address && (
              <div className="info-card">
                <h3>Shipping Address</h3>
                <p>{order.address.full_name}</p>
                <p>{order.address.address_line1}</p>
                {order.address.address_line2 && <p>{order.address.address_line2}</p>}
                <p>{order.address.city}, {order.address.state} {order.address.postal_code}</p>
                <p>{order.address.country}</p>
                <p>Phone: {order.address.phone}</p>
              </div>
            )}
          </div>
          
          <div className="order-items">
            <h2>Order Items</h2>
            
            {(order.items || []).map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-details">
                  <h4>{item.product_name}</h4>
                  <p>SKU: {item.sku}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="item-price">
                  {Number(item.unit_price).toFixed(2)} × {item.quantity}
                  <br />
                  <strong>{Number(item.total_price).toFixed(2)} birr</strong>

                  birr
                </div>
              </div>
            ))}
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{Number(order.subtotal).toFixed(2)} birr</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>{Number(order.shipping_cost || 0).toFixed(2)} birr</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>{Number(order.total).toFixed(2)} birr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}