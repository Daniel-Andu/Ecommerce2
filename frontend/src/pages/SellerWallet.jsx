import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './SellerWallet.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function SellerWallet() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [wallet, setWallet] = useState(null);
    const [withdrawals, setWithdrawals] = useState([]);
    const [showWithdrawForm, setShowWithdrawForm] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [bankDetails, setBankDetails] = useState({
        bank_name: '',
        account_number: '',
        account_holder_name: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadWalletData();
    }, []);

    const loadWalletData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Fetch wallet balance
            const walletRes = await fetch(`${API_URL}/withdrawals/balance`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const walletData = await walletRes.json();
            setWallet(walletData);

            // Fetch withdrawal history
            const withdrawalsRes = await fetch(`${API_URL}/withdrawals`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const withdrawalsData = await withdrawalsRes.json();
            setWithdrawals(withdrawalsData);
        } catch (error) {
            console.error('Error loading wallet:', error);
            toast.error('Failed to load wallet data');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdrawRequest = async (e) => {
        e.preventDefault();

        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (amount > wallet.available_balance) {
            toast.error('Insufficient balance');
            return;
        }

        if (!bankDetails.bank_name || !bankDetails.account_number || !bankDetails.account_holder_name) {
            toast.error('Please fill in all bank details');
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/withdrawals/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount,
                    bank_details: bankDetails
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to request withdrawal');
            }

            toast.success('Withdrawal request submitted successfully');
            setShowWithdrawForm(false);
            setWithdrawAmount('');
            setBankDetails({
                bank_name: '',
                account_number: '',
                account_holder_name: ''
            });
            loadWalletData();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'badge-pending', text: 'Pending' },
            approved: { class: 'badge-approved', text: 'Approved' },
            processing: { class: 'badge-processing', text: 'Processing' },
            completed: { class: 'badge-completed', text: 'Completed' },
            rejected: { class: 'badge-rejected', text: 'Rejected' }
        };
        const badge = badges[status] || { class: 'badge-default', text: status };
        return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
    };

    if (loading) {
        return (
            <div className="wallet-loading">
                <div className="spinner"></div>
                <p>Loading wallet...</p>
            </div>
        );
    }

    return (
        <div className="seller-wallet-page">
            <div className="container">
                <h1>My Wallet</h1>

                {/* Wallet Balance Cards */}
                <div className="wallet-cards">
                    <div className="wallet-card balance-card">
                        <div className="card-icon">💰</div>
                        <div className="card-content">
                            <h3>Available Balance</h3>
                            <p className="amount">ETB {wallet?.available_balance?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>

                    <div className="wallet-card pending-card">
                        <div className="card-icon">⏳</div>
                        <div className="card-content">
                            <h3>Pending Balance</h3>
                            <p className="amount">ETB {wallet?.pending_balance?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>

                    <div className="wallet-card total-card">
                        <div className="card-icon">📊</div>
                        <div className="card-content">
                            <h3>Total Earnings</h3>
                            <p className="amount">ETB {wallet?.total_earnings?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>
                </div>

                {/* Withdraw Button */}
                <div className="wallet-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowWithdrawForm(!showWithdrawForm)}
                        disabled={!wallet || wallet.available_balance <= 0}
                    >
                        {showWithdrawForm ? 'Cancel' : 'Request Withdrawal'}
                    </button>
                </div>

                {/* Withdrawal Form */}
                {showWithdrawForm && (
                    <div className="withdraw-form-container">
                        <h2>Request Withdrawal</h2>
                        <form onSubmit={handleWithdrawRequest} className="withdraw-form">
                            <div className="form-group">
                                <label>Amount (ETB) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    max={wallet?.available_balance || 0}
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    required
                                />
                                <small>Available: ETB {wallet?.available_balance?.toFixed(2) || '0.00'}</small>
                            </div>

                            <div className="form-group">
                                <label>Bank Name *</label>
                                <input
                                    type="text"
                                    value={bankDetails.bank_name}
                                    onChange={(e) => setBankDetails({ ...bankDetails, bank_name: e.target.value })}
                                    placeholder="e.g., Commercial Bank of Ethiopia"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Account Number *</label>
                                <input
                                    type="text"
                                    value={bankDetails.account_number}
                                    onChange={(e) => setBankDetails({ ...bankDetails, account_number: e.target.value })}
                                    placeholder="Enter account number"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Account Holder Name *</label>
                                <input
                                    type="text"
                                    value={bankDetails.account_holder_name}
                                    onChange={(e) => setBankDetails({ ...bankDetails, account_holder_name: e.target.value })}
                                    placeholder="Full name as per bank account"
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Request'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowWithdrawForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Withdrawal History */}
                <div className="withdrawal-history">
                    <h2>Withdrawal History</h2>
                    {withdrawals.length === 0 ? (
                        <p className="no-data">No withdrawal requests yet</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="withdrawals-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Bank Details</th>
                                        <th>Status</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {withdrawals.map((withdrawal) => (
                                        <tr key={withdrawal.id}>
                                            <td>{new Date(withdrawal.created_at).toLocaleDateString()}</td>
                                            <td className="amount-cell">ETB {withdrawal.amount.toFixed(2)}</td>
                                            <td>
                                                <div className="bank-info">
                                                    <div>{withdrawal.bank_name}</div>
                                                    <div className="account-number">{withdrawal.account_number}</div>
                                                    <div className="account-holder">{withdrawal.account_holder_name}</div>
                                                </div>
                                            </td>
                                            <td>{getStatusBadge(withdrawal.status)}</td>
                                            <td>{withdrawal.admin_notes || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
