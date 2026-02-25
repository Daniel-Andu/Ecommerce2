import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://e-commerce-backend-3i6r.onrender.com/api';

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0.00';
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  // ===== CRITICAL FIX: NO REDIRECT TO LOGIN =====
  // We handle everything inside the component
  
  useEffect(() => {
    console.log('📦 OrderConfirmation mounted with ID:', id);
    
    // Check for demo mode first
    const params = new URLSearchParams(location.search);
    if (params.get('demo') === 'true') {
      loadDemoOrder();
      return;
    }

    // Check payment status from URL
    if (params.get('status') === 'success') {
      toast.success('✅ Payment successful!');
    } else if (params.get('status') === 'failed') {
      toast.error('❌ Payment failed');
    }

    // Try to load from sessionStorage first (backup from checkout)
    const loadFromBackup = () => {
      try {
        const lastOrder = sessionStorage.getItem('lastOrder');
        if (lastOrder) {
          const parsed = JSON.parse(lastOrder);
          if (parsed.id == id) {
            console.log('✅ Found backup order:', parsed);
            const backupOrder = {
              id: parsed.id,
              order_number: `ORD-${parsed.id}`,
              created_at: new Date().toISOString(),
              status: 'confirmed',
              total: parsed.total,
              payment_status: 'pending',
              payment_method: 'Chapa',
              items: [],
              message: 'Your order has been placed successfully! Full details will appear here shortly.'
            };
            setOrder(backupOrder);
            setLoading(false);
            return true;
          }
        }
        return false;
      } catch (e) {
        console.error('Error loading backup:', e);
        return false;
      }
    };

    // Try backup first
    const backupLoaded = loadFromBackup();

    // Then try to fetch from API if we have a token
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found, showing backup order');
          if (!backupLoaded) {
            // Create a basic order so user sees something
            setOrder({
              id: id,
              order_number: `ORD-${id}`,
              created_at: new Date().toISOString(),
              status: 'confirmed',
              total: 0,
              payment_status: 'pending',
              message: 'Your order has been placed! Please check your email for details.'
            });
          }
          setLoading(false);
          return;
        }

        console.log('Fetching order from API:', `${API_BASE_URL}/orders/${id}`);
        
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Order loaded from API:', data);
          setOrder(data);
          setError(null);
        } else {
          console.log('API error:', response.status);
          if (!backupLoaded) {
            // Still show a basic order
            setOrder({
              id: id,
              order_number: `ORD-${id}`,
              created_at: new Date().toISOString(),
              status: 'confirmed',
              total: 0,
              payment_status: 'pending',
              message: 'Order details are being processed. Please check back later.'
            });
          }
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

  }, [id, location.search]);

  const loadDemoOrder = () => {
    const demoOrder = {
      id: id || 12,
      order_number: 'ORD-DEMO-123456',
      created_at: new Date().toISOString(),
      status: 'confirmed',
      total: 299.99,
      payment_status: 'paid',
      payment_method: 'Chapa',
      shipping_address: '123 Demo Street',
      city: 'Demo City',
      zip_code: '12345',
      country: 'Demo Country',
      items: [
        { id: 1, product_name: 'Demo Product 1', quantity: 2, price: 49.99 },
        { id: 2, product_name: 'Demo Product 2', quantity: 1, price: 199.99 }
      ]
    };
    
    console.log('📱 Demo order loaded:', demoOrder);
    setOrder(demoOrder);
    setLoading(false);
  };

  const retryLoading = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  // ===== NEVER REDIRECT TO LOGIN - ALWAYS SHOW SOMETHING =====

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your order confirmation...</p>
        <p className="loading-hint">
          If this takes too long,{' '}
          <button onClick={retryLoading} className="link-button">click here</button>
        </p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <p>But don't worry - your order may still have been placed!</p>
        <div className="action-buttons">
          <button onClick={retryLoading} className="btn-primary">Try Again</button>
          <button onClick={() => navigate('/products')} className="btn-secondary">Continue Shopping</button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <h2>Order #{id}</h2>
        <p>Your order has been placed successfully!</p>
        <p className="info-text">We're processing your order and will send you an email confirmation shortly.</p>
        <div className="action-buttons">
          <button onClick={() => navigate('/products')} className="btn-primary">Continue Shopping</button>
          <button onClick={() => navigate('/')} className="btn-secondary">Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="confirmation-header">
        <h1>Order Confirmation</h1>
        <div className="success-icon">✅</div>
        {location.search.includes('status=success') && (
          <div className="payment-success-badge">Payment Successful</div>
        )}
        {location.search.includes('demo=true') && (
          <div className="demo-badge">Demo Mode</div>
        )}
      </div>

      <div className="order-summary">
        <h2>Thank You for Your Order!</h2>
        <p><strong>Order Number:</strong> {order.order_number || order.id}</p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
        <p><strong>Status:</strong> 
          <span className={`status-badge ${order.status || 'pending'}`}>
            {order.status || 'Processing'}
          </span>
        </p>
        <p><strong>Total Amount:</strong> ETB {formatPrice(order.total)}</p>
      </div>

      {order.items && order.items.length > 0 ? (
        <div className="order-items">
          <h3>Items</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name || item.name || `Product ${index + 1}`}</td>
                  <td>{item.quantity}</td>
                  <td>ETB {formatPrice(item.price)}</td>
                  <td>ETB {formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : order.message ? (
        <div className="info-message">
          <p>{order.message}</p>
        </div>
      ) : null}

      {(order.shipping_address || order.city) && (
        <div className="shipping-info">
          <h3>Shipping Information</h3>
          <p><strong>Address:</strong> {order.shipping_address || 'N/A'}</p>
          <p><strong>City:</strong> {order.city || 'N/A'}</p>
          <p><strong>Country:</strong> {order.country || 'Ethiopia'}</p>
        </div>
      )}

      <div className="payment-info">
        <h3>Payment Information</h3>
        <p><strong>Payment Method:</strong> {order.payment_method || 'Chapa'}</p>
        <p><strong>Payment Status:</strong> 
          <span className={`status-badge ${order.payment_status || 'pending'}`}>
            {order.payment_status || 'Pending'}
          </span>
        </p>
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate('/products')} className="btn-primary">
          Continue Shopping
        </button>
        <button onClick={() => navigate('/')} className="btn-secondary">
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;



// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import * as api from '../api';
// import toast from 'react-hot-toast';
// import './OrderConfirmation.css';

// const OrderConfirmation = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useAuth();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const [error, setError] = useState(null);

//   // Helper function to safely format price
//   const formatPrice = (price) => {
//     if (price === null || price === undefined) return '0.00';
//     const numPrice = typeof price === 'number' ? price : parseFloat(price);
//     return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
//   };

//   useEffect(() => {
//     console.log('OrderConfirmation mounted with ID:', id);
//     console.log('Location search:', location.search);
    
//     if (!id) {
//       const params = new URLSearchParams(location.search);
//       const isDemo = params.get('demo') === 'true';
      
//       if (isDemo) {
//         console.log('📱 Demo mode activated');
//         loadDemoOrder();
//       } else {
//         setError('No order ID provided');
//         setLoading(false);
//       }
//       return;
//     }

//     const params = new URLSearchParams(location.search);
//     const isDemo = params.get('demo') === 'true';
    
//     if (isDemo) {
//       console.log('📱 Demo mode activated');
//       loadDemoOrder();
//     } else {
//       fetchOrderDetails();
//     }
//   }, [id, location]);

//   const loadDemoOrder = () => {
//     const demoOrder = {
//       id: 12,
//       order_number: 'ORD-DEMO-123456',
//       created_at: new Date().toISOString(),
//       status: 'confirmed',
//       total: 299.99,
//       payment_status: 'paid',
//       payment_method: 'Chapa',
//       shipping_address: '123 Demo Street',
//       city: 'Demo City',
//       zip_code: '12345',
//       country: 'Demo Country',
//       items: [
//         {
//           id: 1,
//           product_name: 'Demo Product 1',
//           quantity: 2,
//           price: 49.99
//         },
//         {
//           id: 2,
//           product_name: 'Demo Product 2',
//           quantity: 1,
//           price: 199.99
//         }
//       ]
//     };
    
//     console.log('📱 Demo order loaded:', demoOrder);
//     setOrder(demoOrder);
//     setPaymentStatus('success');
//     setLoading(false);
//   };

//   const fetchOrderDetails = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('🔍 Fetching order details for ID:', id);
      
//       // Try to get from session storage first
//       const pendingOrder = sessionStorage.getItem('pendingOrder');
//       if (pendingOrder) {
//         try {
//           const parsedOrder = JSON.parse(pendingOrder);
//           if (parsedOrder.id == id) {
//             console.log('✅ Order data from session:', parsedOrder);
//             setOrder(parsedOrder);
//             setLoading(false);
//             return;
//           }
//         } catch (e) {
//           console.error('Error parsing session order:', e);
//         }
//       }

//       const token = localStorage.getItem('token');
      
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       // Check payment status from URL
//       const params = new URLSearchParams(location.search);
//       const status = params.get('status');
      
//       if (status === 'success') {
//         setPaymentStatus('success');
//         toast.success('Payment successful!');
//       } else if (status === 'failed') {
//         setPaymentStatus('failed');
//         toast.error('Payment failed. Please try again.');
//       }

//       // Fetch order from API
//       console.log('🔍 Fetching from API:', `http://localhost:5000/api/orders/${id}`);
      
//       const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('📡 API Response status:', response.status);

//       // Clone the response for error handling
//       const clone = response.clone();
      
//       let errorData;
//       try {
//         errorData = await clone.json();
//       } catch (e) {
//         errorData = { message: 'Unknown error' };
//       }

//       if (!response.ok) {
//         console.error('API Error Details:', errorData);
        
//         if (response.status === 500) {
//           throw new Error(`Server error: ${errorData.message || 'Internal server error'}`);
//         } else if (response.status === 404) {
//           throw new Error('Order not found');
//         } else if (response.status === 401) {
//           throw new Error('Unauthorized - please login again');
//         } else {
//           throw new Error(`Failed to fetch order: ${response.status}`);
//         }
//       }

//       // Read the original response
//       const data = await response.json();
//       console.log('✅ Order data from API:', data);
      
//       setOrder(data);
      
//     } catch (error) {
//       console.error('❌ Error fetching order:', error);
//       setError(error.message);
//       toast.error(error.message || 'Failed to load order details');
      
//       // If order not found, show demo option
//       if (error.message.includes('404') || error.message.includes('not found')) {
//         setTimeout(() => {
//           if (window.confirm('Order not found. Would you like to view a demo order?')) {
//             loadDemoOrder();
//           }
//         }, 1000);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const retryLoading = () => {
//     setLoading(true);
//     setError(null);
    
//     if (id) {
//       fetchOrderDetails();
//     } else {
//       const params = new URLSearchParams(location.search);
//       const isDemo = params.get('demo') === 'true';
//       if (isDemo) {
//         loadDemoOrder();
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading order details...</p>
//         <p className="loading-hint">If this takes too long, try <button onClick={retryLoading} className="link-button">retrying</button></p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <h2>❌ Error Loading Order</h2>
//         <p>{error}</p>
//         <div className="action-buttons">
//           <button onClick={retryLoading} className="btn-primary">
//             Try Again
//           </button>
//           <button onClick={() => navigate('/orders?demo=true')} className="btn-secondary">
//             View Demo Order
//           </button>
//           <button onClick={() => navigate('/products')} className="btn-secondary">
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="error-container">
//         <h2>Order Not Found</h2>
//         <p>The order you're looking for doesn't exist.</p>
//         <div className="action-buttons">
//           <button onClick={() => navigate('/orders')} className="btn-primary">
//             View My Orders
//           </button>
//           <button onClick={() => navigate('/orders?demo=true')} className="btn-secondary">
//             View Demo Order
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="order-confirmation">
//       <div className="confirmation-header">
//         <h1>Order Confirmation</h1>
//         {paymentStatus === 'success' && (
//           <div className="payment-success-badge">
//             ✅ Payment Successful
//           </div>
//         )}
//         {order.payment_method === 'chapa' && order.payment_status === 'paid' && (
//           <div className="chapa-payment-badge">
//             💳 Paid via Chapa
//           </div>
//         )}
//         {location.search.includes('demo=true') && (
//           <div className="demo-badge">
//             🧪 Demo Mode
//           </div>
//         )}
//       </div>

//       <div className="order-summary">
//         <h2>Order Summary</h2>
//         <p><strong>Order Number:</strong> {order.order_number || order.id}</p>
//         <p><strong>Date:</strong> {new Date(order.created_at || order.date || Date.now()).toLocaleDateString()}</p>
//         <p><strong>Status:</strong> 
//           <span className={`status-badge ${order.status}`}>
//             {order.status}
//           </span>
//         </p>
//         <p><strong>Total Amount:</strong> ETB {formatPrice(order.total)}</p>
//       </div>

//       <div className="order-items">
//         <h3>Items</h3>
//         {order.items && order.items.length > 0 ? (
//           <table className="items-table">
//             <thead>
//               <tr>
//                 <th>Product</th>
//                 <th>Quantity</th>
//                 <th>Price</th>
//                 <th>Subtotal</th>
//               </tr>
//             </thead>
//             <tbody>
//               {order.items.map((item, index) => (
//                 <tr key={index}>
//                   <td>{item.product_name || item.name}</td>
//                   <td>{item.quantity}</td>
//                   <td>ETB {formatPrice(item.price)}</td>
//                   <td>ETB {formatPrice(item.price * item.quantity)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>No items found</p>
//         )}
//       </div>

//       <div className="shipping-info">
//         <h3>Shipping Information</h3>
//         <p><strong>Address:</strong> {order.shipping_address || 'N/A'}</p>
//         <p><strong>City:</strong> {order.city || 'N/A'}</p>
//         <p><strong>ZIP Code:</strong> {order.zip_code || 'N/A'}</p>
//         <p><strong>Country:</strong> {order.country || 'N/A'}</p>
//       </div>

//       <div className="payment-info">
//         <h3>Payment Information</h3>
//         <p><strong>Payment Method:</strong> {order.payment_method === 'chapa' ? 'Chapa' : order.payment_method || 'N/A'}</p>
//         <p><strong>Payment Status:</strong> 
//           <span className={`status-badge ${order.payment_status || 'pending'}`}>
//             {order.payment_status || 'Pending'}
//           </span>
//         </p>
//         {order.chapa_txn_ref && (
//           <p><strong>Transaction Reference:</strong> {order.chapa_txn_ref}</p>
//         )}
//       </div>

//       <div className="action-buttons">
//         <button onClick={() => navigate('/orders')} className="btn-secondary">
//           View All Orders
//         </button>
//         <button onClick={() => navigate('/products')} className="btn-primary">
//           Continue Shopping
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmation;