import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log(' Attempting login with email:', formData.email);
      // console.log('🌐 API URL:', api.defaults.baseURL);
      
      const response = await api.post('/auth/login', formData);
      
      console.log('✅ Login response:', response.data);
      
      if (!response.data || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      if (response.data.user.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      navigate('/admin/dashboard');

    } catch (err) {
      console.error('❌ Login error:', err);
      
      if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } 
      else if (err.response?.status === 404) {
        setError('Login service unavailable. Please try again later.');
        // console.error('API endpoint not found. URL:', `${api.defaults.baseURL}/auth/login`);
      }
      else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check your internet connection.');
      } 
      else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to login.');
      } 
      else {
        setError(
          err.response?.data?.message || 
          'Login failed. Please check your credentials and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const testApiConnection = async () => {
    try {
      const testResponse = await api.get('/test');
      console.log('✅ API test response:', testResponse.data);
      alert(`API connection successful! Server: ${api.defaults.baseURL}`);
    } catch (error) {
      console.error('❌ API test failed:', error);
      alert(`API connection failed. URL: ${api.defaults.baseURL}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Admin Panel</h1>
          <p>Sign in to manage your marketplace</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon"></span>
            <div className="error-content">
              <strong>Login Failed</strong>
              <p>{error}</p>
              <div className="error-help">
                <p>API URL: <strong>{api.defaults.baseURL}</strong></p>
                <button onClick={testApiConnection} className="test-btn">
                  Test API Connection
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@example.com"
              disabled={loading}
              className={error ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              disabled={loading}
              className={error ? 'error' : ''}
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            {/* <p>Email: admin@example.com</p>
            <p>Password: admin123</p> */}
          </div>
        </div>
      </div>
    </div>
  );
}







// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';
// import './Login.css';

// export default function Login() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       console.log('Attempting login with email:', formData.email);
      
//       const response = await api.post('/auth/login', formData);
      
//       console.log('Login response:', response.data);
      
//       if (!response.data || !response.data.user) {
//         throw new Error('Invalid response from server');
//       }

//       if (response.data.user.role !== 'admin') {
//         setError('Access denied. Admin privileges required.');
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem('adminToken', response.data.token);
//       localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      
//       api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
//       navigate('/admin/dashboard');

//     } catch (err) {
//       console.error('Login error details:', {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//         config: err.config
//       });

//       // 🔥 FIX: Treat 401 AND 404 as invalid credentials
//       if (
//         err.response?.status === 401 ||
//         err.response?.status === 404
//       ) {
//         setError('Invalid email or password. Please try again.');
//       } 
//       else if (err.code === 'ERR_NETWORK') {
//         setError('Network error. Please check your internet connection.');
//       } 
//       else if (err.response?.status === 403) {
//         setError('Access denied. You do not have permission to login.');
//       } 
//       else {
//         setError(
//           err.response?.data?.message || 
//           'Login failed. Please check your credentials and try again.'
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const testApiConnection = async () => {
//     try {
//       const testResponse = await api.get('/test');
//       console.log('API test response:', testResponse.data);
//       alert('API connection successful!');
//     } catch (error) {
//       console.error('API test failed:', error);
//       alert('API connection failed. Check console for details.');
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <div className="login-header">
//           <h1>Admin Panel</h1>
//           <p>Sign in to manage your marketplace</p>
//         </div>

//         {error && (
//           <div className="error-message">
//             <span className="error-icon">⚠️</span>
//             <div className="error-content">
//               <strong>Login Failed</strong>
//               <p>{error}</p>
//               {error.includes('404') && (
//                 <div className="error-help">
//                   <p>Possible solutions:</p>
//                   <ul>
//                     <li>Check if backend server is running on port 5000</li>
//                     <li>Verify the API URL in your .env file</li>
//                     <li>Check if the /auth/login endpoint exists</li>
//                   </ul>
//                   <button onClick={testApiConnection} className="test-btn">
//                     Test API Connection
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="login-form">
//           <div className="form-group">
//             <label htmlFor="email">Email Address</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder="admin@example.com"
//               disabled={loading}
//               className={error ? 'error' : ''}
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               placeholder="••••••••"
//               disabled={loading}
//               className={error ? 'error' : ''}
//             />
//           </div>

//           <button 
//             type="submit" 
//             className="login-btn"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <span className="spinner-small"></span>
//                 Signing in...
//               </>
//             ) : (
//               'Sign In'
//             )}
//           </button>
//         </form>

//         <div className="login-footer">
//           <div className="demo-credentials">
//             <p><strong>Demo Credentials:</strong></p>
//           </div>
//           <p className="note">
//             For customer login, go to 
//             <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
//               {' '}customer site
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }