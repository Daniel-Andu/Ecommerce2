// API Base URL - Use environment variable or fallback to localhost for development
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() { 
  return localStorage.getItem('token'); 
}

function getCartSession() { 
  let session = localStorage.getItem('cartSession');
  if (!session) {
    session = 'sess_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('cartSession', session);
  }
  return session;
}

export async function request(path, options = {}) {
  // Don't set Content-Type for FormData
  const headers = { 
    ...options.headers 
  };
  
  // Only set Content-Type to application/json if we're sending JSON
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = getToken();
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  
  const cartSession = getCartSession();
  if (cartSession) {
    headers['X-Cart-Session'] = cartSession;
  }
  
  try {
    const res = await fetch(API + path, { 
      ...options, 
      headers 
    });
    
    // Clone the response for error handling
    const clone = res.clone();
    
    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    let data;
    let errorData;
    
    if (contentType && contentType.includes('application/json')) {
      // Read the clone for error data if needed
      if (!res.ok) {
        try {
          errorData = await clone.json();
        } catch (e) {
          errorData = { message: 'Unknown error' };
        }
      }
      // Read the original for the actual data
      data = await res.json();
    } else {
      data = await res.text();
      errorData = data;
    }
    
    if (!res.ok) {
      // Better error handling
      const errorMessage = errorData?.message || errorData?.error || data || 'Request failed';
      console.error('API Error Response:', errorData || data);
      throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Auth API
export const auth = { 
  login: (b) => request('/auth/login', { method: 'POST', body: JSON.stringify(b) }), 
  register: (b) => request('/auth/register', { method: 'POST', body: JSON.stringify(b) }), 
  registerSeller: (b) => request('/auth/register/seller', { method: 'POST', body: JSON.stringify(b) }), 
  me: () => request('/auth/me'), 
  updateProfile: (b) => request('/auth/profile', { method: 'PATCH', body: JSON.stringify(b) }), 
  changePassword: (b) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(b) }),
  
  // Proper FormData upload - don't set Content-Type header
  uploadProfileImage: (formData) => {
    return request('/auth/profile/upload', { 
      method: 'POST', 
      body: formData
    });
  }
};

// Products API
export const products = { 
  list: (params) => request('/products?' + new URLSearchParams(params || {}).toString()), 
  featured: () => request('/products/featured'), 
  newArrivals: () => request('/products/new-arrivals'), 
  get: (id) => request('/products/' + id),
  getAll: (params) => request('/products?' + new URLSearchParams(params || {}).toString()),
  getBySlug: (slug) => request('/products/' + slug)
};

// Categories API
export const categories = { 
  list: () => request('/categories'),
  getFlat: () => request('/categories/flat'),
  getBySlug: (slug) => request('/categories/' + slug),
  getAll: () => request('/categories')
};

// Banners API
export const banners = { 
  list: () => request('/banners') 
};

// Cart API - COMPLETE WITH ALL METHODS
export const cart = { 
  get: () => request('/cart'), 
  addItem: (b) => request('/cart/items', { method: 'POST', body: JSON.stringify(b) }), 
  updateItem: (id, q) => request('/cart/items/' + id, { method: 'PATCH', body: JSON.stringify({ quantity: q }) }), 
  removeItem: (id) => request('/cart/items/' + id, { method: 'DELETE' }),
  
  // Stock management methods
  checkStock: () => request('/cart/check-stock'),
  autoFix: () => request('/cart/auto-fix', { method: 'POST' }),
  removeOutOfStock: () => request('/cart/remove-out-of-stock', { method: 'POST' })
};

// Orders API
export const orders = { 
  create: (orderData) => request('/orders', { 
    method: 'POST', 
    body: JSON.stringify(orderData) 
  }), 
  my: () => request('/orders/my'), 
  get: (id) => request('/orders/' + id),
  cancel: (id) => request('/orders/' + id + '/cancel', { 
    method: 'PATCH' 
  }),
  track: (id) => request('/orders/' + id + '/track')
};

// Addresses API
export const addresses = { 
  list: () => request('/addresses'), 
  create: (b) => request('/addresses', { method: 'POST', body: JSON.stringify(b) }), 
  update: (id, b) => request('/addresses/' + id, { method: 'PATCH', body: JSON.stringify(b) }), 
  delete: (id) => request('/addresses/' + id, { method: 'DELETE' }) 
};

// Wishlist API
export const wishlist = { 
  list: () => request('/wishlist'), 
  add: (id) => request('/wishlist', { method: 'POST', body: JSON.stringify({ product_id: id }) }), 
  remove: (id) => request('/wishlist/' + id, { method: 'DELETE' }) 
};
// ========== CHAPA PAYMENT API - FIXED ==========
export const payment = { 
  // Initialize payment with Chapa
  initialize: async (data) => {
    try {
      console.log('Initializing payment with data:', data);
      
      // Make sure we're sending the correct order_id
      const requestData = {
        order_id: data.order_id || data.orderId
      };
      
      console.log('Sending to backend:', requestData);
      
      const response = await request('/payment/initialize', { 
        method: 'POST', 
        body: JSON.stringify(requestData)
      });
      
      console.log('Payment initialize response:', response);
      return response;
    } catch (error) {
      console.error('Payment initialize error:', error);
      throw error;
    }
  },
  
  // Verify payment (called by Chapa redirect)
  verify: (txRef) => request('/payment/verify/' + txRef),
  
  // Chapa webhook handler
  webhook: (data) => request('/payment/webhook', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  // Get payment status for an order
  getStatus: (orderId) => request('/payment/status/' + orderId),
  
  // Manual confirm payment (for demo)
  confirm: (orderId) => request('/payment/confirm/' + orderId, { 
    method: 'POST' 
  })
};



// Reviews API
export const reviews = { 
  create: (b) => request('/reviews', { method: 'POST', body: JSON.stringify(b) }),
  getProductReviews: (productId) => request('/reviews/product/' + productId),
  getUserReviews: () => request('/reviews/user')
};

// ========== SELLER API - FIXED FOR FORMDATA ==========
export const seller = { 
  dashboard: () => request('/seller/dashboard'), 
  products: () => request('/seller/products'), 
  
  // Add product with images - ACCEPTS FORMDATA DIRECTLY
  addProduct: (formData) => {
    // IMPORTANT: Pass FormData directly, don't stringify
    return request('/seller/products', { 
      method: 'POST', 
      body: formData
      // Don't set Content-Type - browser will set it with boundary
    });
  }, 
  
  // Update product with images - ACCEPTS FORMDATA DIRECTLY
  updateProduct: (id, formData) => {
    return request('/seller/products/' + id, { 
      method: 'PATCH', 
      body: formData
    });
  }, 
  
  deleteProduct: (id) => request('/seller/products/' + id, { method: 'DELETE' }), 
  orders: () => request('/seller/orders'),
  getOrder: (id) => request('/seller/orders/' + id),
  updateOrderStatus: (id, status) => request('/seller/orders/' + id + '/status', { 
    method: 'PATCH', 
    body: JSON.stringify({ status }) 
  }),
  earnings: () => request('/seller/earnings'),
  withdraw: (amount) => request('/seller/withdraw', { 
    method: 'POST', 
    body: JSON.stringify({ amount }) 
  })
};

// Admin API
export const admin = { 
  // Dashboard
  dashboard: () => request('/admin/dashboard'), 
  
  // Seller management
  pendingSellers: () => request('/admin/sellers/pending'), 
  getAllSellers: (status) => request('/admin/sellers' + (status ? '?status=' + status : '')), 
  approveSeller: (id) => request('/admin/sellers/' + id + '/approve', { method: 'PATCH' }), 
  rejectSeller: (id, reason) => request('/admin/sellers/' + id + '/reject', { 
    method: 'PATCH', 
    body: JSON.stringify({ reason }) 
  }), 
  
  // Product management
  pendingProducts: () => request('/admin/products/pending'), 
  getAllProducts: (status) => request('/admin/products' + (status ? '?status=' + status : '')), 
  approveProduct: (id) => request('/admin/products/' + id + '/approve', { method: 'PATCH' }), 
  rejectProduct: (id, reason) => request('/admin/products/' + id + '/reject', { 
    method: 'PATCH', 
    body: JSON.stringify({ reason }) 
  }), 
  featureProduct: (id, featured) => request('/admin/products/' + id + '/feature', { 
    method: 'PATCH', 
    body: JSON.stringify({ featured }) 
  }), 
  
  // Category management
  categories: () => request('/admin/categories'), 
  addCategory: (b) => request('/admin/categories', { method: 'POST', body: JSON.stringify(b) }), 
  updateCategory: (id, b) => request('/admin/categories/' + id, { method: 'PATCH', body: JSON.stringify(b) }), 
  deleteCategory: (id) => request('/admin/categories/' + id, { method: 'DELETE' }), 
  
  // Order management
  orders: (status) => request('/admin/orders' + (status ? '?status=' + status : '')), 
  getOrder: (id) => request('/admin/orders/' + id), 
  updateOrderStatus: (id, status) => request('/admin/orders/' + id + '/status', { 
    method: 'PATCH', 
    body: JSON.stringify({ status }) 
  }), 
  
  // Banner management
  banners: () => request('/admin/banners'), 
  addBanner: (b) => request('/admin/banners', { method: 'POST', body: JSON.stringify(b) }), 
  updateBanner: (id, b) => request('/admin/banners/' + id, { method: 'PATCH', body: JSON.stringify(b) }), 
  deleteBanner: (id) => request('/admin/banners/' + id, { method: 'DELETE' })
};

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Utility function to get current user from localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Utility function to logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Don't remove cart session on logout
};








// // API Base URL - Change this to your backend URL
// const API = 'http://localhost:5000/api';

// // const API = process.env.REACT_APP_API_URL || '/api';

// function getToken() { 
//   return localStorage.getItem('token'); 
// }

// function getCartSession() { 
//   let session = localStorage.getItem('cartSession');
//   if (!session) {
//     session = 'sess_' + Math.random().toString(36).substring(2, 15);
//     localStorage.setItem('cartSession', session);
//   }
//   return session;
// }

// export async function request(path, options = {}) {
//   // Don't set Content-Type for FormData
//   const headers = { 
//     ...options.headers 
//   };
  
//   // Only set Content-Type to application/json if we're sending JSON
//   if (!(options.body instanceof FormData)) {
//     headers['Content-Type'] = 'application/json';
//   }
  
//   const token = getToken();
//   if (token) {
//     headers.Authorization = 'Bearer ' + token;
//   }
  
//   const cartSession = getCartSession();
//   if (cartSession) {
//     headers['X-Cart-Session'] = cartSession;
//   }
  
//   try {
//     const res = await fetch(API + path, { 
//       ...options, 
//       headers 
//     });
    
//     // Check if response is JSON
//     const contentType = res.headers.get('content-type');
//     let data;
    
//     if (contentType && contentType.includes('application/json')) {
//       data = await res.json();
//     } else {
//       data = await res.text();
//     }
    
//     if (!res.ok) {
//       throw new Error(data.message || data || 'Request failed');
//     }
    
//     return data;
//   } catch (error) {
//     console.error('API request error:', error);
//     throw error;
//   }
// }

// // Auth API
// export const auth = { 
//   login: (b) => request('/auth/login', { method: 'POST', body: JSON.stringify(b) }), 
//   register: (b) => request('/auth/register', { method: 'POST', body: JSON.stringify(b) }), 
//   registerSeller: (b) => request('/auth/register/seller', { method: 'POST', body: JSON.stringify(b) }), 
//   me: () => request('/auth/me'), 
//   updateProfile: (b) => request('/auth/profile', { method: 'PATCH', body: JSON.stringify(b) }), 
//   changePassword: (b) => request('/auth/change-password', { method: 'POST', body: JSON.stringify(b) }),
  
//   // Proper FormData upload - don't set Content-Type header
//   uploadProfileImage: (formData) => {
//     return request('/auth/profile/image', { 
//       method: 'POST', 
//       body: formData
//     });
//   }
// };

// // Products API
// export const products = { 
//   list: (params) => request('/products?' + new URLSearchParams(params || {}).toString()), 
//   featured: () => request('/products/featured'), 
//   newArrivals: () => request('/products/new-arrivals'), 
//   get: (id) => request('/products/' + id),
//   getAll: (params) => request('/products?' + new URLSearchParams(params || {}).toString()),
//   getBySlug: (slug) => request('/products/' + slug)
// };

// // Categories API
// export const categories = { 
//   list: () => request('/categories'),
//   getFlat: () => request('/categories/flat'),
//   getBySlug: (slug) => request('/categories/' + slug),
//   getAll: () => request('/categories')
// };

// // Banners API
// export const banners = { 
//   list: () => request('/banners') 
// };

// // Cart API - COMPLETE WITH ALL METHODS
// export const cart = { 
//   get: () => request('/cart'), 
//   addItem: (b) => request('/cart/items', { method: 'POST', body: JSON.stringify(b) }), 
//   updateItem: (id, q) => request('/cart/items/' + id, { method: 'PATCH', body: JSON.stringify({ quantity: q }) }), 
//   removeItem: (id) => request('/cart/items/' + id, { method: 'DELETE' }),
  
//   // Stock management methods
//   checkStock: () => request('/cart/check-stock'),
//   autoFix: () => request('/cart/auto-fix', { method: 'POST' }),
//   removeOutOfStock: () => request('/cart/remove-out-of-stock', { method: 'POST' })
// };

// // Orders API
// export const orders = { 
//   create: (orderData) => request('/orders', { 
//     method: 'POST', 
//     body: JSON.stringify(orderData) 
//   }), 
//   my: () => request('/orders/my'), 
//   get: (id) => request('/orders/' + id),
//   cancel: (id) => request('/orders/' + id + '/cancel', { 
//     method: 'PATCH' 
//   }),
//   track: (id) => request('/orders/' + id + '/track')
// };

// // Addresses API
// export const addresses = { 
//   list: () => request('/addresses'), 
//   create: (b) => request('/addresses', { method: 'POST', body: JSON.stringify(b) }), 
//   update: (id, b) => request('/addresses/' + id, { method: 'PATCH', body: JSON.stringify(b) }), 
//   delete: (id) => request('/addresses/' + id, { method: 'DELETE' }) 
// };

// // Wishlist API
// export const wishlist = { 
//   list: () => request('/wishlist'), 
//   add: (id) => request('/wishlist', { method: 'POST', body: JSON.stringify({ product_id: id }) }), 
//   remove: (id) => request('/wishlist/' + id, { method: 'DELETE' }) 
// };

// // ========== CHAPA PAYMENT API ==========
// export const payment = { 
//   // Initialize payment with Chapa
//   initialize: async (data) => {
//     try {
//       // Only send order_id - backend will fetch other details from database
//       const response = await request('/payment/initialize', { 
//         method: 'POST', 
//         body: JSON.stringify({
//           order_id: data.order_id || data.orderId
//         }) 
//       });
//       return response;
//     } catch (error) {
//       console.error('Payment initialize error:', error);
//       throw error;
//     }
//   },
  
//   // Verify payment (called by Chapa redirect)
//   verify: (txRef) => request('/payment/verify/' + txRef),
  
//   // Chapa webhook handler
//   webhook: (data) => request('/payment/webhook', { 
//     method: 'POST', 
//     body: JSON.stringify(data) 
//   }),
  
//   // Get payment status for an order
//   getStatus: (orderId) => request('/payment/status/' + orderId),
  
//   // Manual confirm payment (for demo)
//   confirm: (orderId) => request('/payment/confirm/' + orderId, { 
//     method: 'POST' 
//   })
// };




// // Reviews API
// export const reviews = { 
//   create: (b) => request('/reviews', { method: 'POST', body: JSON.stringify(b) }),
//   getProductReviews: (productId) => request('/reviews/product/' + productId),
//   getUserReviews: () => request('/reviews/user')
// };

// // ========== SELLER API - FIXED FOR FORMDATA ==========
// export const seller = { 
//   dashboard: () => request('/seller/dashboard'), 
//   products: () => request('/seller/products'), 
  
//   // Add product with images - ACCEPTS FORMDATA DIRECTLY
//   addProduct: (formData) => {
//     // IMPORTANT: Pass FormData directly, don't stringify
//     return request('/seller/products', { 
//       method: 'POST', 
//       body: formData
//       // Don't set Content-Type - browser will set it with boundary
//     });
//   }, 
  
//   // Update product with images - ACCEPTS FORMDATA DIRECTLY
//   updateProduct: (id, formData) => {
//     return request('/seller/products/' + id, { 
//       method: 'PATCH', 
//       body: formData
//     });
//   }, 
  
//   deleteProduct: (id) => request('/seller/products/' + id, { method: 'DELETE' }), 
//   orders: () => request('/seller/orders'),
//   getOrder: (id) => request('/seller/orders/' + id),
//   updateOrderStatus: (id, status) => request('/seller/orders/' + id + '/status', { 
//     method: 'PATCH', 
//     body: JSON.stringify({ status }) 
//   }),
//   earnings: () => request('/seller/earnings'),
//   withdraw: (amount) => request('/seller/withdraw', { 
//     method: 'POST', 
//     body: JSON.stringify({ amount }) 
//   })
// };

// // Admin API
// export const admin = { 
//   // Dashboard
//   dashboard: () => request('/admin/dashboard'), 
  
//   // Seller management
//   pendingSellers: () => request('/admin/sellers/pending'), 
//   getAllSellers: (status) => request('/admin/sellers' + (status ? '?status=' + status : '')), 
//   approveSeller: (id) => request('/admin/sellers/' + id + '/approve', { method: 'PATCH' }), 
//   rejectSeller: (id, reason) => request('/admin/sellers/' + id + '/reject', { 
//     method: 'PATCH', 
//     body: JSON.stringify({ reason }) 
//   }), 
  
//   // Product management
//   pendingProducts: () => request('/admin/products/pending'), 
//   getAllProducts: (status) => request('/admin/products' + (status ? '?status=' + status : '')), 
//   approveProduct: (id) => request('/admin/products/' + id + '/approve', { method: 'PATCH' }), 
//   rejectProduct: (id, reason) => request('/admin/products/' + id + '/reject', { 
//     method: 'PATCH', 
//     body: JSON.stringify({ reason }) 
//   }), 
//   featureProduct: (id, featured) => request('/admin/products/' + id + '/feature', { 
//     method: 'PATCH', 
//     body: JSON.stringify({ featured }) 
//   }), 
  
//   // Category management
//   categories: () => request('/admin/categories'), 
//   addCategory: (b) => request('/admin/categories', { method: 'POST', body: JSON.stringify(b) }), 
//   updateCategory: (id, b) => request('/admin/categories/' + id, { method: 'PATCH', body: JSON.stringify(b) }), 
//   deleteCategory: (id) => request('/admin/categories/' + id, { method: 'DELETE' }), 
  
//   // Order management
//   orders: (status) => request('/admin/orders' + (status ? '?status=' + status : '')), 
//   getOrder: (id) => request('/admin/orders/' + id), 
//   updateOrderStatus: (id, status) => request('/admin/orders/' + id + '/status', { 
//     method: 'PATCH', 
//     body: JSON.stringify({ status }) 
//   }), 
  
//   // Banner management
//   banners: () => request('/admin/banners'), 
//   addBanner: (b) => request('/admin/banners', { method: 'POST', body: JSON.stringify(b) }), 
//   updateBanner: (id, b) => request('/admin/banners/' + id, { method: 'PATCH', body: JSON.stringify(b) }), 
//   deleteBanner: (id) => request('/admin/banners/' + id, { method: 'DELETE' })
// };

// // Utility function to check if user is authenticated
// export const isAuthenticated = () => {
//   return !!getToken();
// };

// // Utility function to get current user from localStorage
// export const getCurrentUser = () => {
//   try {
//     const userStr = localStorage.getItem('user');
//     return userStr ? JSON.parse(userStr) : null;
//   } catch {
//     return null;
//   }
// };

// // Utility function to logout
// export const logout = () => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
//   // Don't remove cart session on logout
// };