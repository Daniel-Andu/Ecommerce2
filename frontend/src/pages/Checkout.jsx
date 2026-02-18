

// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { cart as cartApi, addresses, orders, payment, products } from '../api';
// import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';
// import './Checkout.css';

// export default function Checkout() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [cartData, setCartData] = useState({ items: [], subtotal: 0, sessionId: null });
//   const [addressList, setAddressList] = useState([]);
//   const [shippingAddressId, setShippingAddressId] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState('chapa');
//   const [shippingMethod, setShippingMethod] = useState('standard');
//   const [loading, setLoading] = useState(true);
//   const [placing, setPlacing] = useState(false);
//   const [orderComplete, setOrderComplete] = useState(false);
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [addressError, setAddressError] = useState('');
//   const [fixingCart, setFixingCart] = useState(false);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // Check if user is logged in
//         if (!user) {
//           toast.error('Please log in to checkout');
//           navigate('/login');
//           return;
//         }

//         // Get current cart session from localStorage
//         const currentSession = localStorage.getItem('cartSession');
//         console.log('Current cart session from localStorage:', currentSession);

//         // Load cart
//         const cart = await cartApi.get();
//         console.log('Cart data from API:', cart);
        
//         setCartData({ 
//           items: cart.items || [], 
//           subtotal: parseFloat(cart.subtotal || 0), 
//           sessionId: cart.sessionId || currentSession
//         });
        
//         // Load addresses
//         try {
//           const addr = await addresses.list();
//           console.log('Addresses loaded:', addr);
          
//           const validAddresses = addr.filter(a => a && a.id) || [];
//           setAddressList(validAddresses);
          
//           if (validAddresses.length > 0) {
//             const defaultAddr = validAddresses.find(a => a.is_default);
//             if (defaultAddr) {
//               setShippingAddressId(String(defaultAddr.id));
//             } else {
//               setShippingAddressId(String(validAddresses[0].id));
//             }
//           } else {
//             setAddressError('No addresses found. Please add an address.');
//           }
//         } catch (addrError) {
//           console.error('Error loading addresses:', addrError);
//           setAddressList([]);
//         }
//       } catch (error) {
//         console.error('Checkout load error:', error);
//         toast.error('Failed to load checkout data');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadData();
//   }, [navigate, user]);

//   // Debug effect
//   useEffect(() => {
//     console.log('Current state:', {
//       itemsCount: cartData.items.length,
//       addressListLength: addressList.length,
//       shippingAddressId: shippingAddressId,
//       sessionId: cartData.sessionId,
//       placing: placing
//     });
//   }, [cartData, addressList, shippingAddressId, placing]);

//   // SIMPLE FIX BUTTON FUNCTION - One click fixes everything for any seller!
//   const handleFixCart = async () => {
//     setFixingCart(true);
//     const fixToast = toast.loading('🔧 Fixing your cart...');
    
//     try {
//       // Step 1: Clear old cart session
//       localStorage.removeItem('cartSession');
      
//       // Step 2: Create new session
//       const newSession = 'sess_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
//       localStorage.setItem('cartSession', newSession);
      
//       // Step 3: Get some products to add
//       const productsList = await products.list({ limit: 10 });
      
//       if (!productsList.products || productsList.products.length === 0) {
//         toast.dismiss(fixToast);
//         toast.error('No products found in store');
//         setFixingCart(false);
//         return;
//       }
      
//       // Step 4: Add first 3 products to cart
//       const productsToAdd = productsList.products.slice(0, 3);
//       let addedCount = 0;
      
//       for (const product of productsToAdd) {
//         try {
//           await cartApi.addItem({
//             product_id: product.id,
//             quantity: 1
//           });
//           addedCount++;
//         } catch (err) {
//           console.error(`Failed to add product ${product.id}:`, err);
//         }
//       }
      
//       toast.dismiss(fixToast);
      
//       if (addedCount > 0) {
//         toast.success(`✅ Success! Added ${addedCount} products to your cart. Refreshing...`);
        
//         // Reload the page after 1.5 seconds
//         setTimeout(() => {
//           window.location.reload();
//         }, 1500);
//       } else {
//         toast.error('Could not add products. Please try again.');
//         setFixingCart(false);
//       }
      
//     } catch (error) {
//       toast.dismiss(fixToast);
//       toast.error('Could not fix cart. Please add products manually.');
//       console.error('Fix cart error:', error);
//       setFixingCart(false);
//     }
//   };

//   const calculateTotals = () => {
//     const subtotal = cartData.subtotal || 0;
//     const shipping = shippingMethod === 'express' ? 10 : 5;
//     const tax = subtotal * 0.15;
//     const total = subtotal + shipping + tax;
//     return { subtotal, shipping, tax, total };
//   };

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();
    
//     // Validate
//     if (!shippingAddressId) { 
//       toast.error('Please select a shipping address'); 
//       return; 
//     }

//     if (addressList.length === 0) {
//       toast.error('Please add a shipping address first');
//       return;
//     }

//     if (!cartData.items || cartData.items.length === 0) {
//       toast.error('Your cart is empty');
//       return;
//     }
    
//     setPlacing(true);
    
//     try {
//       // Get session ID
//       const sessionId = localStorage.getItem('cartSession');
      
//       if (!sessionId) {
//         throw new Error('No cart session found');
//       }

//       const orderData = {
//         shipping_address_id: Number(shippingAddressId),
//         shipping_method: shippingMethod,
//         payment_method: paymentMethod,
//         cart_session_id: sessionId,
//       };
      
//       console.log('Placing order with data:', orderData);
      
//       const response = await orders.create(orderData);
//       console.log('Order response:', response);
      
//       if (response && response.order) {
//         setOrderDetails(response.order);
//         setOrderComplete(true);
//         toast.success('Order placed successfully!');
        
//         // Clear cart
//         localStorage.removeItem('cartSession');
//         window.dispatchEvent(new Event('cart-updated'));
        
//         // Handle payment
//         if (paymentMethod === 'chapa') {
//           try {
//             const pay = await payment.initialize({
//               order_id: response.order.id,
//               return_url: window.location.origin + '/orders/' + response.order.id,
//               cancel_url: window.location.origin + '/cart',
//             });
            
//             if (pay && pay.checkout_url && !pay.demo) {
//               window.location.href = pay.checkout_url;
//               return;
//             }
//           } catch (paymentError) {
//             console.error('Payment error:', paymentError);
//           }
//         }
        
//         setTimeout(() => {
//           navigate('/orders/' + response.order.id);
//         }, 2000);
//       }
//     } catch (err) {
//       console.error('Order placement error:', err);
//       toast.error(err.message || 'Failed to place order');
//       setPlacing(false);
//     }
//   };

//   const goToAddAddress = () => {
//     navigate('/profile?tab=addresses');
//   };

//   const goToProducts = () => {
//     navigate('/products');
//   };

//   if (loading) {
//     return (
//       <div className="loading-screen">
//         <div className="spinner" />
//         <p>Loading checkout...</p>
//       </div>
//     );
//   }

//   if (orderComplete) {
//     return (
//       <div className="order-success">
//         <div className="success-card">
//           <div className="success-icon">✓</div>
//           <h2>Order Placed Successfully!</h2>
//           <p>Your order has been confirmed.</p>
//           <p className="order-number">Order #{orderDetails?.order_number || orderDetails?.id}</p>
//           <p>Redirecting to order details...</p>
//           <Link to="/orders" className="btn btn-primary">
//             View My Orders
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const totals = calculateTotals();

//   return (
//     <div className="checkout-page">
//       <div className="container">
//         <h1>Checkout</h1>
        
//         {/* EASY FIX BUTTON - Visible for everyone when cart is empty */}
//         {(!cartData.items || cartData.items.length === 0) && (
//           <div className="cart-fix-section">
//             <div className="cart-fix-card">
//               <div className="fix-icon">🛒</div>
//               <h3>Your cart is empty</h3>
//               <p>Click the button below to automatically add sample products to your cart</p>
//               <button 
//                 onClick={handleFixCart}
//                 disabled={fixingCart}
//                 className="btn-fix-cart"
//               >
//                 {fixingCart ? '⏳ Fixing...' : '🔧 Fix My Cart (Auto-Add Products)'}
//               </button>
//               <p className="fix-note">
//                 <small>This will add 3 products to your cart so you can test checkout</small>
//               </p>
//             </div>
//           </div>
//         )}
        
//         <div className="checkout-layout">
//           <div className="checkout-main">
//             {/* Shipping Address Section */}
//             <section className="checkout-section">
//               <h2>Shipping Address</h2>
//               {addressList.length > 0 ? (
//                 <>
//                   <div className="address-options">
//                     {addressList.map((address) => (
//                       <label key={address.id} className="address-option">
//                         <input
//                           type="radio"
//                           name="address"
//                           value={address.id}
//                           checked={shippingAddressId === String(address.id)}
//                           onChange={() => {
//                             setShippingAddressId(String(address.id));
//                             setAddressError('');
//                           }}
//                         />
//                         <div className="address-details">
//                           <strong>{address.full_name || address.recipient_name}</strong>
//                           <p>{address.address_line1}</p>
//                           {address.address_line2 && <p>{address.address_line2}</p>}
//                           <p>{address.city}, {address.state} {address.postal_code}</p>
//                           <p>{address.country}</p>
//                           {address.phone && <p className="address-phone">📞 {address.phone}</p>}
//                           {address.is_default && <span className="default-badge">Default</span>}
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                   {addressError && <p className="text-warning">{addressError}</p>}
//                   <Link to="/profile?tab=addresses" className="link-small">
//                     Manage Addresses →
//                   </Link>
//                 </>
//               ) : (
//                 <div className="no-address">
//                   <p>No saved addresses found.</p>
//                   <p className="text-muted">Please add a shipping address to continue.</p>
//                   <button 
//                     type="button" 
//                     className="btn btn-primary" 
//                     onClick={goToAddAddress}
//                   >
//                     Add New Address
//                   </button>
//                 </div>
//               )}
//             </section>

//             {/* Shipping Method Section */}
//             <section className="checkout-section">
//               <h2>Shipping Method</h2>
//               <div className="shipping-options">
//                 <label className="shipping-option">
//                   <input
//                     type="radio"
//                     name="shipping"
//                     value="standard"
//                     checked={shippingMethod === 'standard'}
//                     onChange={() => setShippingMethod('standard')}
//                   />
//                   <div>
//                     <strong>Standard Shipping</strong>
//                     <p>Delivery in 5-7 business days</p>
//                     <span className="shipping-price">5.00 birr</span>
//                   </div>
//                 </label>
                
//                 <label className="shipping-option">
//                   <input
//                     type="radio"
//                     name="shipping"
//                     value="express"
//                     checked={shippingMethod === 'express'}
//                     onChange={() => setShippingMethod('express')}
//                   />
//                   <div>
//                     <strong>Express Shipping</strong>
//                     <p>Delivery in 2-3 business days</p>
//                     <span className="shipping-price">10.00 birr</span>
//                   </div>
//                 </label>
//               </div>
//             </section>

//             {/* Payment Method Section */}
//             <section className="checkout-section">
//               <h2>Payment Method</h2>
//               <div className="payment-options">
//                 <label className="payment-option">
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="chapa"
//                     checked={paymentMethod === 'chapa'}
//                     onChange={() => setPaymentMethod('chapa')}
//                   />
//                   <div>
//                     <strong>Chapa</strong>
//                     <p>Pay with mobile money or bank transfer</p>
//                   </div>
//                 </label>
                
//                 <label className="payment-option">
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="cod"
//                     checked={paymentMethod === 'cod'}
//                     onChange={() => setPaymentMethod('cod')}
//                   />
//                   <div>
//                     <strong>Cash on Delivery</strong>
//                     <p>Pay when you receive your order</p>
//                   </div>
//                 </label>
//               </div>
//             </section>
//           </div>

//           {/* Order Summary Sidebar */}
//           <aside className="order-summary">
//             <h2>Order Summary</h2>
            
//             {cartData.items && cartData.items.length > 0 ? (
//               <>
//                 <div className="summary-items">
//                   {cartData.items.map(item => (
//                     <div key={item.id} className="summary-item">
//                       <span className="item-name">
//                         {item.name} × {item.quantity}
//                       </span>
//                       <span className="item-price">
//                         {(item.price * item.quantity).toFixed(2)} birr
//                       </span>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="summary-row">
//                   <span>Subtotal</span>
//                   <span>{totals.subtotal.toFixed(2)} birr</span>
//                 </div>
                
//                 <div className="summary-row">
//                   <span>Shipping</span>
//                   <span>{totals.shipping.toFixed(2)} birr</span>
//                 </div>
                
//                 <div className="summary-row">
//                   <span>Tax (15%)</span>
//                   <span>{totals.tax.toFixed(2)} birr</span>
//                 </div>
                
//                 <div className="summary-total">
//                   <span>Total</span>
//                   <span>{totals.total.toFixed(2)} birr</span>
//                 </div>
//               </>
//             ) : (
//               <div className="empty-summary">
//                 <p>Your cart is empty</p>
//               </div>
//             )}
            
//             {/* Button */}
//             {addressList.length === 0 ? (
//               <div className="button-message">
//                 <button 
//                   type="button" 
//                   className="btn-place-order disabled"
//                   onClick={goToAddAddress}
//                 >
//                   Add Shipping Address First
//                 </button>
//                 <p className="text-warning small">
//                   You need to add a shipping address before placing an order.
//                 </p>
//               </div>
//             ) : !shippingAddressId ? (
//               <div className="button-message">
//                 <button 
//                   type="button" 
//                   className="btn-place-order disabled"
//                   disabled={true}
//                 >
//                   Select Shipping Address
//                 </button>
//                 <p className="text-warning small">
//                   Please select a shipping address to continue.
//                 </p>
//               </div>
//             ) : cartData.items && cartData.items.length > 0 ? (
//               <button 
//                 type="submit" 
//                 className="btn-place-order"
//                 onClick={handlePlaceOrder}
//                 disabled={placing}
//               >
//                 {placing ? 'Processing...' : 'Place Order'}
//               </button>
//             ) : (
//               <button 
//                 type="button" 
//                 className="btn-browse-products"
//                 onClick={goToProducts}
//               >
//                 Browse Products
//               </button>
//             )}
            
//             <p className="checkout-terms">
//               By placing your order, you agree to our 
//               <Link to="/terms"> Terms of Service</Link> and 
//               <Link to="/privacy"> Privacy Policy</Link>.
//             </p>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cart as cartApi, addresses, orders, payment, products } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartData, setCartData] = useState({ items: [], subtotal: 0, sessionId: null });
  const [addressList, setAddressList] = useState([]);
  const [shippingAddressId, setShippingAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('chapa');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [addressError, setAddressError] = useState('');
  const [fixingCart, setFixingCart] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user) {
          toast.error('Please log in to checkout');
          navigate('/login');
          return;
        }

        const currentSession = localStorage.getItem('cartSession');
        console.log('Current cart session:', currentSession);

        const cart = await cartApi.get();
        console.log('Cart data:', cart);
        
        setCartData({ 
          items: cart.items || [], 
          subtotal: parseFloat(cart.subtotal || 0), 
          sessionId: cart.sessionId || currentSession
        });
        
        try {
          const addr = await addresses.list();
          console.log('Addresses:', addr);
          
          const validAddresses = addr.filter(a => a && a.id) || [];
          setAddressList(validAddresses);
          
          if (validAddresses.length > 0) {
            const defaultAddr = validAddresses.find(a => a.is_default);
            if (defaultAddr) {
              setShippingAddressId(String(defaultAddr.id));
            } else {
              setShippingAddressId(String(validAddresses[0].id));
            }
          }
        } catch (addrError) {
          console.error('Address error:', addrError);
          setAddressList([]);
        }
      } catch (error) {
        console.error('Load error:', error);
        toast.error('Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [navigate, user]);

  // 🔥🔥🔥 THE MAGIC FIX BUTTON FUNCTION 🔥🔥🔥
  const forceFixCart = async () => {
    setFixingCart(true);
    const fixToast = toast.loading('🔧 Force fixing your cart...');
    
    try {
      // Step 1: Clear everything
      localStorage.removeItem('cartSession');
      
      // Step 2: Create brand new session
      const newSession = 'sess_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
      localStorage.setItem('cartSession', newSession);
      console.log('New session created:', newSession);
      
      // Step 3: Add products one by one (these are your actual products)
      const productsToAdd = [
        { id: 1, name: 'Samsung Galaxy S23', qty: 1 },
        { id: 2, name: 'Closes', qty: 2 },
        { id: 3, name: 'djhhfvh', qty: 1 },
        { id: 4, name: 'phone', qty: 2 }
      ];
      
      let successCount = 0;
      
      for (const product of productsToAdd) {
        try {
          const response = await fetch('/api/cart/items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Cart-Session': newSession
            },
            body: JSON.stringify({
              product_id: product.id,
              quantity: product.qty
            })
          });
          
          if (response.ok) {
            successCount++;
            console.log(`✅ Added ${product.name}`);
          } else {
            console.log(`❌ Failed to add ${product.name}`);
          }
        } catch (err) {
          console.error(`Error adding product ${product.id}:`, err);
        }
      }
      
      toast.dismiss(fixToast);
      
      if (successCount > 0) {
        toast.success(`✅ Success! Added ${successCount} products to your cart. Refreshing...`);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error('❌ Could not add products. Please try again.');
        setFixingCart(false);
      }
      
    } catch (error) {
      toast.dismiss(fixToast);
      toast.error('❌ Fix failed. Please try again.');
      console.error('Fix error:', error);
      setFixingCart(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartData.subtotal || 0;
    const shipping = shippingMethod === 'express' ? 10 : 5;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!shippingAddressId) { 
      toast.error('Please select a shipping address'); 
      return; 
    }

    if (addressList.length === 0) {
      toast.error('Please add a shipping address first');
      return;
    }

    if (!cartData.items || cartData.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setPlacing(true);
    
    try {
      const sessionId = localStorage.getItem('cartSession');
      
      if (!sessionId) {
        throw new Error('No cart session found');
      }

      const orderData = {
        shipping_address_id: Number(shippingAddressId),
        shipping_method: shippingMethod,
        payment_method: paymentMethod,
        cart_session_id: sessionId,
      };
      
      console.log('Placing order:', orderData);
      
      const response = await orders.create(orderData);
      
      if (response && response.order) {
        setOrderDetails(response.order);
        setOrderComplete(true);
        toast.success('Order placed successfully!');
        
        localStorage.removeItem('cartSession');
        window.dispatchEvent(new Event('cart-updated'));
        
        if (paymentMethod === 'chapa') {
          try {
            const pay = await payment.initialize({
              order_id: response.order.id,
              return_url: window.location.origin + '/orders/' + response.order.id,
              cancel_url: window.location.origin + '/cart',
            });
            
            if (pay && pay.checkout_url && !pay.demo) {
              window.location.href = pay.checkout_url;
              return;
            }
          } catch (paymentError) {
            console.error('Payment error:', paymentError);
          }
        }
        
        setTimeout(() => {
          navigate('/orders/' + response.order.id);
        }, 2000);
      }
    } catch (err) {
      console.error('Order error:', err);
      toast.error(err.message || 'Failed to place order');
      setPlacing(false);
    }
  };

  const goToAddAddress = () => {
    navigate('/profile?tab=addresses');
  };

  const goToProducts = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="order-success">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Your order has been confirmed.</p>
          <p className="order-number">Order #{orderDetails?.order_number || orderDetails?.id}</p>
          <p>Redirecting to order details...</p>
          <Link to="/orders" className="btn btn-primary">
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        
        {/* 🔥 BIG RED FIX BUTTON - CLICK THIS IF CART IS EMPTY 🔥 */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <button 
            onClick={forceFixCart}
            disabled={fixingCart}
            style={{
              background: '#EF4444',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '50px',
              cursor: fixingCart ? 'not-allowed' : 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)',
              opacity: fixingCart ? 0.7 : 1,
              transition: 'all 0.3s'
            }}
          >
            {fixingCart ? '⏳ FIXING...' : ' CLICK HERE IF CART IS EMPTY '}
          </button>
          <p style={{ color: '#6B7280', marginTop: '10px', fontSize: '0.9rem' }}>
           
          </p>
        </div>
        
        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Shipping Address Section */}
            <section className="checkout-section">
              <h2>Shipping Address</h2>
              {addressList.length > 0 ? (
                <>
                  <div className="address-options">
                    {addressList.map((address) => (
                      <label key={address.id} className="address-option">
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={shippingAddressId === String(address.id)}
                          onChange={() => setShippingAddressId(String(address.id))}
                        />
                        <div className="address-details">
                          <strong>{address.full_name}</strong>
                          <p>{address.address_line1}</p>
                          <p>{address.city}, {address.country}</p>
                          {address.is_default && <span className="default-badge">Default</span>}
                        </div>
                      </label>
                    ))}
                  </div>
                  <Link to="/profile?tab=addresses" className="link-small">
                    Manage Addresses →
                  </Link>
                </>
              ) : (
                <div className="no-address">
                  <p>No saved addresses found.</p>
                  <button onClick={goToAddAddress} className="btn btn-primary">
                    Add New Address
                  </button>
                </div>
              )}
            </section>

            {/* Payment Method Section */}
            <section className="checkout-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="chapa"
                    checked={paymentMethod === 'chapa'}
                    onChange={() => setPaymentMethod('chapa')}
                  />
                  <div>
                    <strong>Chapa</strong>
                    <p>Pay with mobile money or bank transfer</p>
                  </div>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div>
                    <strong>Cash on Delivery</strong>
                    <p>Pay when you receive your order</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <aside className="order-summary">
            <h2>Order Summary</h2>
            
            {cartData.items && cartData.items.length > 0 ? (
              <>
                <div className="summary-items">
                  {cartData.items.map(item => (
                    <div key={item.id} className="summary-item">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)} birr</span>
                    </div>
                  ))}
                </div>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{totals.subtotal.toFixed(2)} birr</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{totals.shipping.toFixed(2)} birr</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax (15%)</span>
                  <span>{totals.tax.toFixed(2)} birr</span>
                </div>
                
                <div className="summary-total">
                  <span>Total</span>
                  <span>{totals.total.toFixed(2)} birr</span>
                </div>
              </>
            ) : (
              <div className="empty-summary">
                <p>Your cart is empty</p>
              </div>
            )}
            
            {addressList.length === 0 ? (
              <button 
                onClick={goToAddAddress}
                className="btn-place-order"
                style={{ background: '#9CA3AF' }}
              >
                Add Address First
              </button>
            ) : !shippingAddressId ? (
              <button 
                className="btn-place-order"
                style={{ background: '#9CA3AF' }}
                disabled
              >
                Select Address
              </button>
            ) : cartData.items && cartData.items.length > 0 ? (
              <button 
                onClick={handlePlaceOrder}
                className="btn-place-order"
                disabled={placing}
              >
                {placing ? 'Processing...' : 'Place Order'}
              </button>
            ) : (
              <button 
                onClick={goToProducts}
                className="btn-place-order"
                style={{ background: '#3B82F6' }}
              >
                Browse Products
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
