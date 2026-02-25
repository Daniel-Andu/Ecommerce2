import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './MyReturns.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function MyReturns() {
    const { user } = useAuth();
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadReturns();
        }
    }, [user]);

    const loadReturns = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/returns/my-returns`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to load returns');
            const data = await response.json();
            setReturns(data);
        } catch (error) {
            console.error('Load returns error:', error);
            toast.error('Failed to load returns');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#FFA500',
            approved: '#4CAF50',
            rejected: '#f44336',
            processing: '#2196F3',
            completed: '#4CAF50'
        };
        return colors[status] || '#999';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: '⏳',
            approved: '✅',
            rejected: '❌',
            processing: '🔄',
            completed: '✓'
        };
        return icons[status] || '📦';
    };

    if (loading) {
        return (
            <div className="returns-loading">
                <div className="spinner"></div>
                <p>Loading returns...</p>
            </div>
        );
    }

    return (
        <div className="my-returns">
            <div className="returns-header">
                <h1>↩️ My Returns</h1>
                <p>Track and manage your return requests</p>
            </div>

            {returns.length === 0 ? (
                <div className="no-returns">
                    <div className="empty-icon">📦</div>
                    <h3>No Returns Yet</h3>
                    <p>You haven't requested any returns</p>
                    <Link to="/orders" className="btn-view-orders">
                        View My Orders
                    </Link>
                </div>
            ) : (
                <div className="returns-grid">
                    {returns.map(returnItem => (
                        <div key={returnItem.id} className="return-card">
                            <div className="return-header">
                                <div className="return-number">
                                    <span className="label">Return #</span>
                                    <span className="value">{returnItem.return_number}</span>
                                </div>
                                <div
                                    className="return-status"
                                    style={{
                                        background: getStatusColor(returnItem.status),
                                        color: 'white'
                                    }}
                                >
                                    {getStatusIcon(returnItem.status)} {returnItem.status.toUpperCase()}
                                </div>
                            </div>

                            <div className="return-info">
                                <div className="info-row">
                                    <span className="label">Order #:</span>
                                    <span className="value">{returnItem.order_number}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Amount:</span>
                                    <span className="value">ETB {returnItem.total}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Reason:</span>
                                    <span className="value">{returnItem.reason}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Requested:</span>
                                    <span className="value">
                                        {new Date(returnItem.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {returnItem.description && (
                                <div className="return-description">
                                    <strong>Description:</strong>
                                    <p>{returnItem.description}</p>
                                </div>
                            )}

                            {returnItem.images && returnItem.images.length > 0 && (
                                <div className="return-images">
                                    <strong>Proof Images:</strong>
                                    <div className="images-grid">
                                        {returnItem.images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${img}`}
                                                alt={`Return proof ${index + 1}`}
                                                className="return-image"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {returnItem.admin_notes && (
                                <div className="admin-notes">
                                    <strong>Admin Notes:</strong>
                                    <p>{returnItem.admin_notes}</p>
                                </div>
                            )}

                            <div className="return-actions">
                                <Link
                                    to={`/returns/${returnItem.id}`}
                                    className="btn-view-details"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
