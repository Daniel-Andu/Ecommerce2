// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Request interceptor to add token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       // Handle 401 Unauthorized
//       if (error.response.status === 401) {
//         localStorage.removeItem('adminToken');
//         localStorage.removeItem('adminUser');
//         window.location.href = '/login';
//       }
      
//       // Handle 403 Forbidden
//       if (error.response.status === 403) {
//         console.error('Access denied. Admin only.');
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;




import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🌐 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('📤 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('📥 Response Error:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server not responding');
    }
    
    if (error.response) {
      console.error('Server responded with:', error.response.status, error.response.data);
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/login';
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error('Access denied. Admin only.');
      }
      
      // Handle 404 Not Found
      if (error.response.status === 404) {
        console.error('API endpoint not found:', error.config.url);
      }
    } else if (error.request) {
      console.error('No response from server. Make sure backend is running.');
    }
    
    return Promise.reject(error);
  }
);

export default api;