

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './OrderManagement.css';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      let url = '/admin/orders';
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }
      const response = await api.get(url);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      setSelectedOrder(response.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error loading order details:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({...selectedOrder, status: newStatus});
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      processing: '#17a2b8',
      shipped: '#007bff',
      delivered: '#28a745',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h1>Order Management</h1>
      </div>

      <div className="filter-bar">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button onClick={loadOrders} className="btn-refresh">
          Refresh
        </button>
      </div>

      {showDetails && selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Order Details #{selectedOrder.id}</h2>
              <button onClick={closeDetails} className="btn-close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="order-info">
                <h3>Customer Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Name:</label>
                    <span>{selectedOrder.first_name} {selectedOrder.last_name}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{selectedOrder.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Order Date:</label>
                    <span>{new Date(selectedOrder.created_at).toLocaleString()}</span>
                  </div>
                  <div className="info-item">
                    <label>Status:</label>
                    <span className="status-badge" style={{
                      background: getStatusColor(selectedOrder.status),
                      color: 'white'
                    }}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedOrder.address && (
                <div className="shipping-info">
                  <h3>Shipping Address</h3>
                  <p>{selectedOrder.address.address_line1}</p>
                  {selectedOrder.address.address_line2 && <p>{selectedOrder.address.address_line2}</p>}
                  <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.postal_code}</p>
                  <p>{selectedOrder.address.country}</p>
                  <p>Phone: {selectedOrder.address.phone}</p>
                </div>
              )}

              <div className="order-items">
                <h3>Order Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map(item => (
                      <tr key={item.id}>
                        <td>{item.product_name}</td>
                        <td>ETB{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>ETB{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-right"><strong>Total:</strong></td>
                      <td><strong>ETB{selectedOrder.total}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="order-actions">
                <h3>Update Status</h3>
                <div className="status-buttons">
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    className="status-btn processing"
                    disabled={selectedOrder.status === 'processing'}
                  >
                    Processing
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                    className="status-btn shipped"
                    disabled={selectedOrder.status === 'shipped'}
                  >
                    Shipped
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    className="status-btn delivered"
                    disabled={selectedOrder.status === 'delivered'}
                  >
                    Delivered
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    className="status-btn cancelled"
                    disabled={selectedOrder.status === 'cancelled'}
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <div>
                      <strong>{order.first_name} {order.last_name}</strong>
                      <br />
                      <small>{order.email}</small>
                    </div>
                  </td>
                  <td>ETB{order.total}</td>
                  <td>
                    <span className="status-badge" style={{
                      background: getStatusColor(order.status),
                      color: 'white'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-status ${order.payment_status}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => viewOrderDetails(order.id)}
                      className="btn-view"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}