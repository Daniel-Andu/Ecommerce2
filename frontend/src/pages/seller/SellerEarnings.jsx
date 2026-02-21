

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import toast from 'react-hot-toast';
import './SellerEarnings.css';

export default function SellerEarnings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState({
    total: 0,
    available: 0,
    pending: 0,
    withdrawn: 0
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      const data = await api.seller.earnings();
      setEarnings(data.stats || { total: 0, available: 0, pending: 0, withdrawn: 0 });
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error loading earnings:', error);
      toast.error('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (earnings.available < 100) {
      toast.error('Minimum withdrawal amount is $100');
      return;
    }

    const amount = window.prompt('Enter amount to withdraw (max $' + earnings.available + '):');
    if (!amount) return;

    try {
      await api.seller.withdraw(parseFloat(amount));
      toast.success('Withdrawal request submitted successfully');
      loadEarnings();
    } catch (error) {
      console.error('Error withdrawing:', error);
      toast.error(error.message || 'Failed to withdraw');
    }
  };

  if (loading) {
    return (
      <div className="earnings-loading">
        <div className="spinner"></div>
        <p>Loading earnings data...</p>
      </div>
    );
  }

  return (
    <div className="seller-earnings">
      <h1>My Earnings</h1>

      {/* Stats Cards */}
      <div className="earnings-stats">
        <div className="stat-card total">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Earnings</h3>
            <p className="stat-value">${earnings.total.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card available">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <h3>Available Balance</h3>
            <p className="stat-value">${earnings.available.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">${earnings.pending.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card withdrawn">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <h3>Withdrawn</h3>
            <p className="stat-value">${earnings.withdrawn.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Withdraw Button */}
      {earnings.available > 0 && (
        <div className="withdraw-section">
          <button 
            onClick={handleWithdraw}
            className="btn-withdraw"
            disabled={earnings.available < 100}
          >
            Withdraw Funds
          </button>
          {earnings.available < 100 && (
            <p className="withdraw-note">Minimum withdrawal: $100</p>
          )}
        </div>
      )}

      {/* Transactions Table */}
      <div className="transactions-section">
        <h2>Transaction History</h2>
        
        {transactions.length === 0 ? (
          <p className="no-transactions">No transactions yet</p>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                  <td>{tx.description}</td>
                  <td className={tx.amount > 0 ? 'positive' : 'negative'}>
                    ${Math.abs(tx.amount).toFixed(2)}
                  </td>
                  <td>
                    <span className={`status-badge ${tx.status}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}