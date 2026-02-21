

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SellerPending from '../pages/SellerPending';

export default function SellerRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'seller' && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Check if seller is pending
  if (user.role === 'seller' && user.seller_status === 'pending') {
    return <SellerPending />;
  }

  return children;
}