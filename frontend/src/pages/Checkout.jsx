// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import * as api from '../api';
// import toast from 'react-hot-toast';
// import './Checkout.css';

// export default function Checkout() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [showNewAddressForm, setShowNewAddressForm] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('chapa');
//   const [stockVerified, setStockVerified] = useState(false);
  
//   const [newAddress, setNewAddress] = useState({
//     address_line1: '',
//     address_line2: '',
//     city: '',
//     state: '',
//     postal_code: '',
//     country: 'Ethiopia',
//     phone: user?.phone || '',
//     is_default: false
//   });

//   useEffect(() => {
//     // Redirect if not logged in
//     if (!user) {
//       toast.error('Please login to checkout');
//       navigate('/login');
//       return;
//     }

//     verifyStockAndLoadData();
//   }, [user, navigate]);

//   const verifyStockAndLoadData = async () => {
//     try {
//       setLoading(true);
      
//       // First check stock
//       const stockCheck = await api.cart.checkStock();
      
//       if (stockCheck.has_issues) {
//         // Auto-fix cart
//         await api.cart.autoFix();
//         toast.success('Cart updated to available stock');
//       }
      
//       // Load cart
//       const cartData = await api.cart.get();
      
//       // Final check for out of stock items
//       const hasOutOfStock = cartData.items.some(item => !item.in_stock);
      
//       if (hasOutOfStock) {
//         toast.error('Some items are out of stock. Please review your cart.');
//         navigate('/cart');
//         return;
//       }
      
//       if (cartData.items.length === 0) {
//         toast.error('Your cart is empty');
//         navigate('/cart');
//         return;
//       }
      
//       setCart(cartData);
//       setStockVerified(true);
      
//       // Load addresses
//       const addressesData = await api.addresses.list();
//       setAddresses(addressesData);
      
//       // Select default address if exists
//       const defaultAddr = addressesData.find(addr => addr.is_default);
//       if (defaultAddr) {
//         setSelectedAddress(defaultAddr.id);
//       }
      
//     } catch (error) {
//       console.error('Checkout error:', error);
//       toast.error('Failed to load checkout data');
//       navigate('/cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNewAddressChange = (e) => {
//     setNewAddress({
//       ...newAddress,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleAddAddress = async (e) => {
//     e.preventDefault();
    
//     // Validate required fields
//     if (!newAddress.address_line1 || !newAddress.city || !newAddress.phone) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     try {
//       const added = await api.addresses.create(newAddress);
//       setAddresses([...addresses, added]);
//       setSelectedAddress(added.id);
//       setShowNewAddressForm(false);
//       setNewAddress({
//         address_line1: '',
//         address_line2: '',
//         city: '',
//         state: '',
//         postal_code: '',
//         country: 'Ethiopia',
//         phone: user?.phone || '',
//         is_default: false
//       });
//       toast.success('Address added successfully');
//     } catch (error) {
//       console.error('Error adding address:', error);
//       toast.error('Failed to add address');
//     }
//   };

//   const handlePlaceOrder = async () => {
//     // Validate address selection
//     if (!selectedAddress && addresses.length === 0 && !showNewAddressForm) {
//       toast.error('Please select or add a shipping address');
//       return;
//     }
  
//     let addressId = selectedAddress;
  
//     // If adding new address
//     if (showNewAddressForm) {
//       if (!newAddress.address_line1 || !newAddress.city || !newAddress.phone) {
//         toast.error('Please fill in all address fields');
//         return;
//       }
      
//       try {
//         const added = await api.addresses.create(newAddress);
//         addressId = added.id;
//       } catch (error) {
//         console.error('Error adding address:', error);
//         toast.error('Failed to add address');
//         return;
//       }
//     }
  
//     setProcessing(true);
  
//     try {
//       // Final stock verification
//       const stockCheck = await api.cart.checkStock();
//       if (stockCheck.has_issues) {
//         toast.error('Some items are no longer in stock. Please review your cart.');
//         navigate('/cart');
//         return;
//       }
  
//       // Create order - only send required fields
//       const orderData = {
//         shipping_address_id: addressId,
//         payment_method: paymentMethod,
//         notes: ''
//       };
  
//       console.log('Creating order with:', orderData);
//       const order = await api.orders.create(orderData);
//       console.log('Order created:', order);
  
//       // Initialize Chapa payment
//       if (paymentMethod === 'chapa') {
//         console.log('Initializing payment for order:', order.id);
        
//         // Only send order_id - backend will fetch other details
//         const payment = await api.payment.initialize({
//           order_id: order.id
//         });
  
//         console.log('Payment initialized:', payment);
  
//         // Redirect to Chapa payment page
//         if (payment.checkout_url) {
//           window.location.href = payment.checkout_url;
//         } else {
//           // Fallback to order confirmation
//           toast.success('Order placed successfully!');
//           navigate(`/order-confirmation/${order.id}`);
//         }
//       } else {
//         // Cash on delivery
//         toast.success('Order placed successfully!');
//         navigate(`/order-confirmation/${order.id}`);
//       }
      
//     } catch (error) {
//       console.error('Order placement error:', error);
//       toast.error(error.message || 'Failed to place order');
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="checkout-loading">
//         <div className="spinner"></div>
//         <p>Preparing checkout...</p>
//       </div>
//     );
//   }

//   if (!stockVerified) {
//     return (
//       <div className="checkout-error">
//         <h2>Unable to proceed</h2>
//         <p>Please check your cart and try again.</p>
//         <button onClick={() => navigate('/cart')} className="btn-primary">
//           Go to Cart
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="checkout-container">
//       <h1 className="checkout-title">Checkout</h1>

//       <div className="checkout-grid">
//         {/* Left Column - Forms */}
//         <div className="checkout-form-section">
//           {/* Shipping Address */}
//           <div className="checkout-section">
//             <h2>Shipping Address</h2>
            
//             {addresses.length > 0 && !showNewAddressForm ? (
//               <>
//                 <div className="address-list">
//                   {addresses.map(addr => (
//                     <label key={addr.id} className="address-option">
//                       <input
//                         type="radio"
//                         name="address"
//                         value={addr.id}
//                         checked={selectedAddress === addr.id}
//                         onChange={() => setSelectedAddress(addr.id)}
//                       />
//                       <div className="address-details">
//                         <div className="address-line">
//                           {addr.address_line1}
//                           {addr.address_line2 && `, ${addr.address_line2}`}
//                         </div>
//                         <div className="address-line">
//                           {addr.city}, {addr.state} {addr.postal_code}
//                         </div>
//                         <div className="address-line">{addr.country}</div>
//                         <div className="address-phone">Phone: {addr.phone}</div>
//                         {addr.is_default && (
//                           <span className="default-badge">Default</span>
//                         )}
//                       </div>
//                     </label>
//                   ))}
//                 </div>
                
//                 <button
//                   onClick={() => setShowNewAddressForm(true)}
//                   className="btn-add-address"
//                 >
//                   + Add New Address
//                 </button>
//               </>
//             ) : (
//               <form onSubmit={handleAddAddress} className="address-form">
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Address Line 1 *</label>
//                     <input
//                       type="text"
//                       name="address_line1"
//                       value={newAddress.address_line1}
//                       onChange={handleNewAddressChange}
//                       required
//                       placeholder="Street address"
//                     />
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Address Line 2</label>
//                     <input
//                       type="text"
//                       name="address_line2"
//                       value={newAddress.address_line2}
//                       onChange={handleNewAddressChange}
//                       placeholder="Apartment, suite, etc."
//                     />
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>City *</label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={newAddress.city}
//                       onChange={handleNewAddressChange}
//                       required
//                       placeholder="City"
//                     />
//                   </div>
                  
//                   <div className="form-group">
//                     <label>State/Region</label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={newAddress.state}
//                       onChange={handleNewAddressChange}
//                       placeholder="State"
//                     />
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Postal Code</label>
//                     <input
//                       type="text"
//                       name="postal_code"
//                       value={newAddress.postal_code}
//                       onChange={handleNewAddressChange}
//                       placeholder="Postal code"
//                     />
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Country</label>
//                     <select
//                       name="country"
//                       value={newAddress.country}
//                       onChange={handleNewAddressChange}
//                     >
//                       <option value="Ethiopia">Ethiopia</option>
//                       <option value="Kenya">Kenya</option>
//                       <option value="Tanzania">Tanzania</option>
//                       <option value="Uganda">Uganda</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Phone Number *</label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={newAddress.phone}
//                       onChange={handleNewAddressChange}
//                       required
//                       placeholder="Phone number"
//                     />
//                   </div>
//                 </div>

//                 <div className="form-checkbox">
//                   <label>
//                     <input
//                       type="checkbox"
//                       name="is_default"
//                       checked={newAddress.is_default}
//                       onChange={(e) => setNewAddress({
//                         ...newAddress,
//                         is_default: e.target.checked
//                       })}
//                     />
//                     Set as default address
//                   </label>
//                 </div>

//                 <div className="form-actions">
//                   <button type="submit" className="btn-save-address">
//                     Save Address
//                   </button>
//                   {addresses.length > 0 && (
//                     <button
//                       type="button"
//                       onClick={() => setShowNewAddressForm(false)}
//                       className="btn-cancel"
//                     >
//                       Cancel
//                     </button>
//                   )}
//                 </div>
//               </form>
//             )}
//           </div>

//           {/* Payment Method */}
//           <div className="checkout-section">
//             <h2>Payment Method</h2>
            
//             <div className="payment-methods">
//               <label className="payment-option">
//                 <input
//                   type="radio"
//                   name="payment"
//                   value="chapa"
//                   checked={paymentMethod === 'chapa'}
//                   onChange={() => setPaymentMethod('chapa')}
//                 />
//                 <div className="payment-details">
//                   <span className="payment-name">Chapa Payment</span>
//                   <span className="payment-description">
//                     Pay with Telebirr, CBE, Amole, or Credit Card
//                   </span>
//                 </div>
//               </label>

//               <label className="payment-option">
//                 <input
//                   type="radio"
//                   name="payment"
//                   value="cod"
//                   checked={paymentMethod === 'cod'}
//                   onChange={() => setPaymentMethod('cod')}
//                 />
//                 <div className="payment-details">
//                   <span className="payment-name">Cash on Delivery</span>
//                   <span className="payment-description">
//                     Pay when you receive your order
//                   </span>
//                 </div>
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Order Summary */}
//         <div className="checkout-summary">
//           <h2>Order Summary</h2>
          
//           <div className="summary-items">
//             {cart.items.map(item => (
//               <div key={item.id} className="summary-item">
//                 <div className="item-info">
//                   <span className="item-name">{item.name}</span>
//                   <span className="item-quantity">x{item.quantity}</span>
//                 </div>
//                 <span className="item-price">
//                   ${(item.price * item.quantity).toFixed(2)}
//                 </span>
//               </div>
//             ))}
//           </div>

//           <div className="summary-divider"></div>

//           <div className="summary-row">
//             <span>Subtotal</span>
//             <span>${cart.subtotal.toFixed(2)}</span>
//           </div>

//           <div className="summary-row">
//             <span>Shipping</span>
//             <span>Calculated at delivery</span>
//           </div>

//           <div className="summary-total">
//             <span>Total</span>
//             <span>${cart.total.toFixed(2)}</span>
//           </div>

//           <button
//             onClick={handlePlaceOrder}
//             className="btn-place-order"
//             disabled={processing || (!selectedAddress && addresses.length === 0 && !showNewAddressForm)}
//           >
//             {processing ? (
//               <>
//                 <span className="spinner-small"></span>
//                 Processing...
//               </>
//             ) : (
//               'Place Order'
//             )}
//           </button>

//           <p className="secure-checkout">
//             🔒 Secure Checkout - Your information is protected
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('chapa');
  const [stockVerified, setStockVerified] = useState(false);
  
  // New address form state - matching backend field names
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    label: 'Home',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Ethiopia',
    phone: user?.phone || '',
    is_default: false
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    verifyStockAndLoadData();
  }, [user, navigate]);

  const verifyStockAndLoadData = async () => {
    try {
      setLoading(true);
      
      // First check stock
      const stockCheck = await api.cart.checkStock();
      console.log('Stock check:', stockCheck);
      
      if (stockCheck.has_issues) {
        // Auto-fix cart
        await api.cart.autoFix();
        toast.success('Cart updated to available stock');
      }
      
      // Load cart
      const cartData = await api.cart.get();
      console.log('Cart data:', cartData);
      
      // Final check for out of stock items
      const hasOutOfStock = cartData.items.some(item => !item.in_stock);
      
      if (hasOutOfStock) {
        toast.error('Some items are out of stock. Please review your cart.');
        navigate('/cart');
        return;
      }
      
      if (cartData.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }
      
      setCart(cartData);
      setStockVerified(true);
      
      // Load addresses
      const addressesData = await api.addresses.list();
      console.log('Addresses:', addressesData);
      setAddresses(addressesData);
      
      // Select default address if exists
      const defaultAddr = addressesData.find(addr => addr.is_default);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id);
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to load checkout data');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateAddressForm = () => {
    const errors = {};
    
    if (!newAddress.full_name?.trim()) {
      errors.full_name = 'Full name is required';
    }
    
    if (!newAddress.address_line1?.trim()) {
      errors.address_line1 = 'Address line 1 is required';
    }
    
    if (!newAddress.city?.trim()) {
      errors.city = 'City is required';
    }
    
    if (!newAddress.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(newAddress.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number (e.g., +251912345678)';
    }
    
    return errors;
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateAddressForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      // Prepare data with EXACT field names backend expects
      const addressData = {
        full_name: newAddress.full_name.trim(),
        label: newAddress.label || 'Home',
        address_line1: newAddress.address_line1.trim(),
        address_line2: newAddress.address_line2?.trim() || null,
        city: newAddress.city.trim(),
        state: newAddress.state?.trim() || null,
        postal_code: newAddress.postal_code?.trim() || null,
        country: newAddress.country,
        phone: newAddress.phone.trim(),
        is_default: newAddress.is_default ? 1 : 0
      };

      console.log('Sending address data:', addressData);
      
      const added = await api.addresses.create(addressData);
      console.log('Address added:', added);
      
      setAddresses([...addresses, added]);
      setSelectedAddress(added.id);
      setShowNewAddressForm(false);
      
      // Reset form
      setNewAddress({
        full_name: '',
        label: 'Home',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Ethiopia',
        phone: user?.phone || '',
        is_default: false
      });
      setFormErrors({});
      toast.success('Address added successfully');
    } catch (error) {
      console.error('Error adding address:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Failed to add address';
      toast.error(errorMessage);
    }
  };

  // FIXED: Updated handlePlaceOrder with amount validation for Chapa
  const handlePlaceOrder = async () => {
    // Validate address selection
    if (!selectedAddress && addresses.length === 0 && !showNewAddressForm) {
      toast.error('Please select or add a shipping address');
      return;
    }

    let addressId = selectedAddress;

    // If adding new address
    if (showNewAddressForm) {
      const errors = validateAddressForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        toast.error('Please complete the address form correctly');
        return;
      }
      
      try {
        const addressData = {
          full_name: newAddress.full_name.trim(),
          label: newAddress.label || 'Home',
          address_line1: newAddress.address_line1.trim(),
          address_line2: newAddress.address_line2?.trim() || null,
          city: newAddress.city.trim(),
          state: newAddress.state?.trim() || null,
          postal_code: newAddress.postal_code?.trim() || null,
          country: newAddress.country,
          phone: newAddress.phone.trim(),
          is_default: newAddress.is_default ? 1 : 0
        };
        
        console.log('Creating new address for order:', addressData);
        const added = await api.addresses.create(addressData);
        addressId = added.id;
      } catch (error) {
        console.error('Error adding address:', error);
        toast.error('Failed to add address');
        return;
      }
    }

    setProcessing(true);

    try {
      // Final stock verification
      console.log('Checking stock before order...');
      const stockCheck = await api.cart.checkStock();
      console.log('Stock check result:', stockCheck);
      
      if (stockCheck.has_issues) {
        toast.error('Some items are no longer in stock. Please review your cart.');
        navigate('/cart');
        return;
      }

      // IMPORTANT: Your backend only needs these fields
      // It calculates subtotal, tax, shipping, and total automatically
      const orderData = {
        shipping_address_id: addressId,
        payment_method: paymentMethod, // 'chapa' or 'cod'
        notes: ''
      };

      console.log('Creating order with data:', orderData);
      
      const order = await api.orders.create(orderData);
      console.log('Order created successfully:', order);

      // FIX: Check if amount exceeds Chapa limit (1,000,000 ETB)
      if (paymentMethod === 'chapa' && order.total > 1000000) {
        toast.error(`Order total ETB ${order.total.toFixed(2)} exceeds Chapa's limit of 1,000,000 ETB. Please reduce your cart total or choose Cash on Delivery.`);
        setProcessing(false);
        return;
      }

      // Handle payment based on method
      if (paymentMethod === 'chapa') {
        console.log('Initializing Chapa payment for order:', order.id);
        
        try {
          // Initialize Chapa payment - send only order_id
          const paymentData = {
            order_id: order.id
          };
          
          console.log('Sending payment initialization:', paymentData);
          
          const payment = await api.payment.initialize(paymentData);
          console.log('Payment initialized:', payment);

          // Check if we have a checkout URL
          if (payment.checkout_url) {
            // Redirect to Chapa payment page
            window.location.href = payment.checkout_url;
          } else if (payment.url) {
            // Alternative field name
            window.location.href = payment.url;
          } else if (payment.data && payment.data.checkout_url) {
            // Nested data
            window.location.href = payment.data.checkout_url;
          } else {
            // If no checkout URL, go to order confirmation
            console.warn('No checkout URL in response:', payment);
            toast.success('Order placed successfully!');
            navigate(`/order-confirmation/${order.id}`);
          }
        } catch (paymentError) {
          console.error('Payment initialization error:', paymentError);
          console.error('Payment error response:', paymentError.response?.data);
          
          // Check if error is about amount limit
          const errorMsg = paymentError.message || '';
          if (errorMsg.includes('amount must not exceed') || errorMsg.includes('1000000')) {
            toast.error('Order total exceeds Chapa payment limit. Please choose Cash on Delivery or reduce cart total.');
          } else {
            toast.error('Payment initialization failed. Please try again or choose Cash on Delivery.');
          }
          
          // Still show order confirmation
          navigate(`/order-confirmation/${order.id}`);
        }
      } else {
        // Cash on delivery
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${order.id}`);
      }
      
    } catch (error) {
      console.error('===== ORDER PLACEMENT ERROR =====');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error message:', error.message);
      
      // Show specific error from backend
      let errorMessage = 'Failed to place order';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelAddressForm = () => {
    setShowNewAddressForm(false);
    setNewAddress({
      full_name: '',
      label: 'Home',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Ethiopia',
      phone: user?.phone || '',
      is_default: false
    });
    setFormErrors({});
  };

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="spinner"></div>
        <p>Preparing checkout...</p>
      </div>
    );
  }

  if (!stockVerified) {
    return (
      <div className="checkout-error">
        <h2>Unable to proceed</h2>
        <p>Please check your cart and try again.</p>
        <button onClick={() => navigate('/cart')} className="btn-primary">
          Go to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-grid">
        {/* Left Column - Forms */}
        <div className="checkout-form-section">
          {/* Shipping Address */}
          <div className="checkout-section">
            <div className="section-header">
              <h2>Shipping Address</h2>
              {addresses.length > 0 && !showNewAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  className="btn-add-address"
                >
                  + Add New Address
                </button>
              )}
            </div>
            
            {addresses.length > 0 && !showNewAddressForm ? (
              <>
                <div className="address-list">
                  {addresses.map(addr => (
                    <label key={addr.id} className={`address-card ${selectedAddress === addr.id ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        className="address-radio"
                      />
                      <div className="address-details">
                        <div className="address-name">
                          {addr.full_name || 'Shipping Address'}
                        </div>
                        <div className="address-text">
                          {addr.address_line1}
                          {addr.address_line2 && `, ${addr.address_line2}`}
                        </div>
                        <div className="address-text">
                          {addr.city}, {addr.state} {addr.postal_code}
                        </div>
                        <div className="address-text">{addr.country}</div>
                        <div className="address-phone">📞 {addr.phone}</div>
                        {addr.is_default && (
                          <span className="default-badge">Default</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <div className="address-form-container">
                <div className="form-header">
                  <h3>Add New Shipping Address</h3>
                  {addresses.length > 0 && (
                    <button 
                      type="button"
                      onClick={handleCancelAddressForm}
                      className="close-form-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
                <form onSubmit={handleAddAddress} className="address-form">
                  {/* Full Name Field */}
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>
                        Full Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={newAddress.full_name}
                        onChange={handleNewAddressChange}
                        placeholder="John Doe"
                        className={formErrors.full_name ? 'error' : ''}
                      />
                      {formErrors.full_name && (
                        <span className="error-message">{formErrors.full_name}</span>
                      )}
                    </div>
                  </div>

                  {/* Hidden label field */}
                  <input
                    type="hidden"
                    name="label"
                    value={newAddress.label}
                  />

                  {/* Address Line 1 */}
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>
                        Address Line 1 <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="address_line1"
                        value={newAddress.address_line1}
                        onChange={handleNewAddressChange}
                        placeholder="Street address, P.O. box"
                        className={formErrors.address_line1 ? 'error' : ''}
                      />
                      {formErrors.address_line1 && (
                        <span className="error-message">{formErrors.address_line1}</span>
                      )}
                    </div>
                  </div>

                  {/* Address Line 2 */}
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        name="address_line2"
                        value={newAddress.address_line2}
                        onChange={handleNewAddressChange}
                        placeholder="Apartment, suite, unit, building"
                      />
                    </div>
                  </div>

                  {/* City and State */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        City <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleNewAddressChange}
                        placeholder="City"
                        className={formErrors.city ? 'error' : ''}
                      />
                      {formErrors.city && (
                        <span className="error-message">{formErrors.city}</span>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label>State/Region</label>
                      <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleNewAddressChange}
                        placeholder="State or region"
                      />
                    </div>
                  </div>

                  {/* Postal Code and Country */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={newAddress.postal_code}
                        onChange={handleNewAddressChange}
                        placeholder="Postal code"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Country</label>
                      <select
                        name="country"
                        value={newAddress.country}
                        onChange={handleNewAddressChange}
                      >
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Rwanda">Rwanda</option>
                      </select>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>
                        Phone Number <span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleNewAddressChange}
                        placeholder="+251 912 345 678"
                        className={formErrors.phone ? 'error' : ''}
                      />
                      {formErrors.phone && (
                        <span className="error-message">{formErrors.phone}</span>
                      )}
                      <span className="helper-text">Include country code (e.g., +251 for Ethiopia)</span>
                    </div>
                  </div>

                  {/* Default Address Checkbox */}
                  <div className="form-checkbox">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={newAddress.is_default}
                        onChange={handleNewAddressChange}
                      />
                      <span className="checkbox-text">Set as default address</span>
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="form-actions">
                    <button type="submit" className="btn-save-address">
                      Save Address
                    </button>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={handleCancelAddressForm}
                        className="btn-cancel"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <h2>Payment Method</h2>
            
            <div className="payment-methods">
              <label className={`payment-option ${paymentMethod === 'chapa' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="chapa"
                  checked={paymentMethod === 'chapa'}
                  onChange={() => setPaymentMethod('chapa')}
                />
                <div className="payment-details">
                  <span className="payment-name">Chapa Payment</span>
                  <span className="payment-description">
                    Pay with Telebirr, CBE, Amole, or Credit Card
                  </span>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <div className="payment-details">
                  <span className="payment-name">Cash on Delivery</span>
                  <span className="payment-description">
                    Pay when you receive your order
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-items">
            {cart.items.map(item => (
              <div key={item.id} className="summary-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">
                  ETB {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>ETB {cart.subtotal?.toFixed(2) || '0.00'}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span className="shipping-estimate">Calculated at delivery</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>ETB {cart.total?.toFixed(2) || '0.00'}</span>
          </div>

          {/* FIX: Show warning for large orders */}
          {paymentMethod === 'chapa' && cart.total > 1000000 && (
            <div className="chapa-limit-warning">
              ⚠️ Order total exceeds Chapa's 1,000,000 ETB limit. Please choose Cash on Delivery or reduce cart total.
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            className="btn-place-order"
            disabled={processing || (!selectedAddress && addresses.length === 0 && !showNewAddressForm)}
          >
            {processing ? (
              <>
                <span className="spinner-small"></span>
                Processing...
              </>
            ) : (
              'Place Order'
            )}
          </button>

          <p className="secure-checkout">
            <span className="secure-icon">🔒</span>
            Secure Checkout - Your information is protected
          </p>
        </div>
      </div>
    </div>
  );
}