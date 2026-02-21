

// admin-frontend/src/pages/SellerManagement.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './SellerManagement.css';

export default function SellerManagement() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadSellers();
  }, [filter]);

  const loadSellers = async () => {
    try {
      setLoading(true);
      let url = '/admin/sellers';
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }
      const response = await api.get(url);
      setSellers(response.data);
    } catch (error) {
      console.error('Error loading sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/sellers/${id}/approve`);
      loadSellers();
      if (selectedSeller?.id === id) {
        setSelectedSeller(null);
        setShowDetails(false);
      }
    } catch (error) {
      console.error('Error approving seller:', error);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Please enter rejection reason:');
    if (reason === null) return; // User cancelled
    
    try {
      await api.patch(`/admin/sellers/${id}/reject`, { reason });
      loadSellers();
      if (selectedSeller?.id === id) {
        setSelectedSeller(null);
        setShowDetails(false);
      }
    } catch (error) {
      console.error('Error rejecting seller:', error);
    }
  };

  const viewDetails = (seller) => {
    setSelectedSeller(seller);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedSeller(null);
  };

  if (loading) {
    return <div className="loading">Loading sellers...</div>;
  }

  return (
    <div className="seller-management">
      <div className="page-header">
        <h1>Seller Management</h1>
      </div>

      <div className="filter-bar">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Sellers</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button onClick={loadSellers} className="btn-refresh">
          Refresh
        </button>
      </div>

      {showDetails && selectedSeller && (
        <div className="seller-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Seller Details</h2>
              <button onClick={closeDetails} className="btn-close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <label>Business Name:</label>
                  <span>{selectedSeller.business_name}</span>
                </div>
                <div className="detail-item">
                  <label>Owner Name:</label>
                  <span>{selectedSeller.first_name} {selectedSeller.last_name}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedSeller.email}</span>
                </div>
                <div className="detail-item">
                  <label>Phone:</label>
                  <span>{selectedSeller.phone || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <label>Address:</label>
                  <span>{selectedSeller.address || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <label>Business License:</label>
                  {selectedSeller.license_number ? (
                    <span>{selectedSeller.license_number}</span>
                  ) : (
                    <span className="text-muted">Not provided</span>
                  )}
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedSeller.status}`}>
                    {selectedSeller.status}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Applied On:</label>
                  <span>{new Date(selectedSeller.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {selectedSeller.status === 'pending' && (
                <div className="modal-actions">
                  <button 
                    onClick={() => handleApprove(selectedSeller.id)}
                    className="btn-approve"
                  >
                    Approve Seller
                  </button>
                  <button 
                    onClick={() => handleReject(selectedSeller.id)}
                    className="btn-reject"
                  >
                    Reject Seller
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Business Name</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No sellers found
                </td>
              </tr>
            ) : (
              sellers.map(seller => (
                <tr key={seller.id}>
                  <td>{seller.id}</td>
                  <td>
                    <strong>{seller.business_name}</strong>
                  </td>
                  <td>{seller.first_name} {seller.last_name}</td>
                  <td>{seller.email}</td>
                  <td>{seller.phone || '-'}</td>
                  <td>
                    <span className={`status-badge ${seller.status}`}>
                      {seller.status}
                    </span>
                  </td>
                  <td>{new Date(seller.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => viewDetails(seller)}
                        className="btn-view"
                      >
                        View
                      </button>
                      {seller.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(seller.id)}
                            className="btn-approve"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(seller.id)}
                            className="btn-reject"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
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