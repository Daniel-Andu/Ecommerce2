
import React, { useState, useEffect } from 'react';
import { admin } from '../../api';
import toast from 'react-hot-toast';
import './AdminSellers.css';

export default function AdminSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      const data = await admin.pendingSellers();
      setSellers(data || []);
    } catch (error) {
      console.error('Load sellers error:', error);
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessing(true);
    try {
      await admin.approveSeller(id);
      toast.success('Seller approved successfully');
      setSellers(sellers.filter(s => s.id !== id));
    } catch (error) {
      toast.error(error.message || 'Failed to approve seller');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this seller?')) return;
    
    setProcessing(true);
    try {
      await admin.rejectSeller(id);
      toast.success('Seller rejected');
      setSellers(sellers.filter(s => s.id !== id));
    } catch (error) {
      toast.error(error.message || 'Failed to reject seller');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" /> Loading sellers...
      </div>
    );
  }

  return (
    <div className="admin-sellers">
      <h1>Pending Seller Applications</h1>
      
      {sellers.length === 0 ? (
        <div className="empty-state">
          <p>No pending seller applications.</p>
        </div>
      ) : (
        <div className="sellers-list">
          {sellers.map(seller => (
            <div key={seller.id} className="seller-card">
              <div className="seller-info">
                <h3>{seller.business_name}</h3>
                <p className="seller-name">
                  <strong>Owner:</strong> {seller.first_name} {seller.last_name}
                </p>
                <p><strong>Email:</strong> {seller.email}</p>
                {seller.business_email && (
                  <p><strong>Business Email:</strong> {seller.business_email}</p>
                )}
                {seller.business_phone && (
                  <p><strong>Phone:</strong> {seller.business_phone}</p>
                )}
                {seller.business_address && (
                  <p><strong>Address:</strong> {seller.business_address}</p>
                )}
              </div>
              
              <div className="seller-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleApprove(seller.id)}
                  disabled={processing}
                >
                  Approve
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => handleReject(seller.id)}
                  disabled={processing}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}