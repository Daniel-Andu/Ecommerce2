const API = '/api';


// const API = process.env.REACT_APP_API_URL || '/api';

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
    
    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    
    if (!res.ok) {
      throw new Error(data.message || data || 'Request failed');
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
    return request('/auth/profile/image', { 
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

// Cart API
export const cart = { 
  get: () => request('/cart'), 
  addItem: (b) => request('/cart/items', { method: 'POST', body: JSON.stringify(b) }), 
  updateItem: (id, q) => request('/cart/items/' + id, { method: 'PATCH', body: JSON.stringify({ quantity: q }) }), 
  removeItem: (id) => request('/cart/items/' + id, { method: 'DELETE' }) 
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

// Payment API
export const payment = { 
  initialize: (b) => request('/payment/initialize', { method: 'POST', body: JSON.stringify(b) }),
  verify: (txRef) => request('/payment/verify/' + txRef),
  webhook: (b) => request('/payment/webhook', { method: 'POST', body: JSON.stringify(b) })
};

// Reviews API
export const reviews = { 
  create: (b) => request('/reviews', { method: 'POST', body: JSON.stringify(b) }),
  getProductReviews: (productId) => request('/reviews/product/' + productId),
  getUserReviews: () => request('/reviews/user')
};

// Seller API - UPDATED with proper image handling
export const seller = { 
  dashboard: () => request('/seller/dashboard'), 
  products: () => request('/seller/products'), 
  
  // Add product with images
  addProduct: (b) => {
    // Ensure images are properly formatted
    const productData = {
      ...b,
      images: b.images || [] // Ensure images array exists
    };
    return request('/seller/products', { 
      method: 'POST', 
      body: JSON.stringify(productData) 
    });
  }, 
  
  // Update product with images
  updateProduct: (id, b) => {
    const productData = {
      ...b,
      images: b.images || []
    };
    return request('/seller/products/' + id, { 
      method: 'PATCH', 
      body: JSON.stringify(productData) 
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

// Admin API - FIXED: Added missing deleteBanner function
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
  
  // Banner management - FIXED: Added deleteBanner function
  banners: () => request('/admin/banners'), 
  addBanner: (b) => request('/admin/banners', { method: 'POST', body: JSON.stringify(b) }), 
  updateBanner: (id, b) => request('/admin/banners/' + id, { method: 'PATCH', body: JSON.stringify(b) }), 
  deleteBanner: (id) => request('/admin/banners/' + id, { method: 'DELETE' }) // Added this line
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