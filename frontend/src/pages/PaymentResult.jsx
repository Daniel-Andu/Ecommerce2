
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import './PaymentResult.css';

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');

    if (status === 'success') {
      toast.success('Payment successful!');
      setTimeout(() => navigate('/orders'), 3000);
    } else if (status === 'failed') {
      toast.error('Payment failed. Please try again.');
      setTimeout(() => navigate('/checkout'), 3000);
    } else {
      toast.error('Payment cancelled.');
      setTimeout(() => navigate('/checkout'), 3000);
    }
  }, [location, navigate]);

  return (
    <div className="payment-result">
      <div className="result-card">
        <div className="spinner"></div>
        <h3>Processing Payment Result...</h3>
        <p>You will be redirected shortly.</p>
      </div>
    </div>
  );
};

export default PaymentResult;