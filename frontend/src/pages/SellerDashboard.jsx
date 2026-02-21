// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import * as api from '../api';
// import toast from 'react-hot-toast';
// import './SellerDashboard.css';

// export default function SellerDashboard() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     totalOrders: 0,
//     totalRevenue: 0,
//     pendingOrders: 0
//   });
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [recentProducts, setRecentProducts] = useState([]);

//   useEffect(() => {
//     // Redirect if not seller
//     if (user && user.role !== 'seller') {
//       toast.error('Access denied. Seller only.');
//       navigate('/');
//       return;
//     }

//     loadDashboardData();
//   }, [user, navigate]);

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true);
      
//       // Load seller dashboard data from API
//       const dashboardData = await api.seller.dashboard();
//       setStats(dashboardData.stats);
//       setRecentOrders(dashboardData.recentOrders || []);
//       setRecentProducts(dashboardData.recentProducts || []);
      
//     } catch (error) {
//       console.error('Error loading dashboard:', error);
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   if (loading) {
//     return (
//       <div className="seller-loading">
//         <div className="loader"></div>
//         <p>Loading your dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="seller-dashboard">
//       {/* Sidebar */}
//       <aside className="dashboard-sidebar">
//         <div className="sidebar-header">
//           <div className="seller-avatar">
//             {user?.first_name?.charAt(0) || 'S'}
//           </div>
//           <div className="seller-info">
//             <h3>{user?.first_name} {user?.last_name}</h3>
//             <p>{user?.email}</p>
//             <span className="seller-badge">Seller</span>
//           </div>
//         </div>

//         <nav className="sidebar-nav">
//           <Link to="/seller/dashboard" className="nav-link active">
//             <span className="nav-icon">📊</span>
//             Dashboard
//           </Link>
//           <Link to="/seller/products" className="nav-link">
//             <span className="nav-icon">📦</span>
//             My Products
//           </Link>
//           <Link to="/seller/products/add" className="nav-link">
//             <span className="nav-icon">➕</span>
//             Add Product
//           </Link>
//           <Link to="/seller/orders" className="nav-link">
//             <span className="nav-icon">🛍️</span>
//             Orders
//           </Link>
//           <Link to="/seller/earnings" className="nav-link">
//             <span className="nav-icon">💰</span>
//             Earnings
//           </Link>
//           <Link to="/seller/profile" className="nav-link">
//             <span className="nav-icon">👤</span>
//             Profile
//           </Link>
//           <button onClick={handleLogout} className="nav-link logout-btn">
//             <span className="nav-icon">🚪</span>
//             Logout
//           </button>
//         </nav>

//         <div className="sidebar-footer">
//           <div className="seller-status">
//             <span className="status-dot"></span>
//             <span>Online</span>
//           </div>
//           <p className="seller-help">Need help? <Link to="/support">Contact support</Link></p>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="dashboard-main">
//         <div className="dashboard-header">
//           <h1>Welcome back, {user?.first_name}! 👋</h1>
//           <p>Here's what's happening with your store today.</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-icon">📦</div>
//             <div className="stat-content">
//               <h3>Total Products</h3>
//               <p className="stat-number">{stats.totalProducts}</p>
//               <Link to="/seller/products" className="stat-link">View all →</Link>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">🛍️</div>
//             <div className="stat-content">
//               <h3>Total Orders</h3>
//               <p className="stat-number">{stats.totalOrders}</p>
//               <Link to="/seller/orders" className="stat-link">View all →</Link>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">💰</div>
//             <div className="stat-content">
//               <h3>Total Revenue</h3>
//               <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
//               <Link to="/seller/earnings" className="stat-link">View earnings →</Link>
//             </div>
//           </div>

//           <div className="stat-card warning">
//             <div className="stat-icon">⏳</div>
//             <div className="stat-content">
//               <h3>Pending Orders</h3>
//               <p className="stat-number">{stats.pendingOrders}</p>
//               <Link to="/seller/orders?status=pending" className="stat-link">Process →</Link>
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders */}
//         <div className="dashboard-section">
//           <div className="section-header">
//             <h2>Recent Orders</h2>
//             <Link to="/seller/orders" className="view-all">View all →</Link>
//           </div>
          
//           <div className="table-responsive">
//             <table className="orders-table">
//               <thead>
//                 <tr>
//                   <th>Order ID</th>
//                   <th>Customer</th>
//                   <th>Product</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                   <th>Date</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentOrders.length > 0 ? (
//                   recentOrders.map(order => (
//                     <tr key={order.id}>
//                       <td>#{order.id}</td>
//                       <td>{order.customer_name}</td>
//                       <td>{order.product_name}</td>
//                       <td>${order.amount}</td>
//                       <td>
//                         <span className={`status-badge ${order.status}`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td>{new Date(order.created_at).toLocaleDateString()}</td>
//                       <td>
//                         <Link to={`/seller/orders/${order.id}`} className="btn-view">
//                           View
//                         </Link>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="text-center">
//                       No orders yet
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Recent Products */}
//         <div className="dashboard-section">
//           <div className="section-header">
//             <h2>Your Products</h2>
//             <Link to="/seller/products" className="view-all">Manage products →</Link>
//           </div>
          
//           <div className="products-grid">
//             {recentProducts.length > 0 ? (
//               recentProducts.map(product => (
//                 <div key={product.id} className="product-card">
//                   <div className="product-image">
//                     {product.images && product.images[0] ? (
//                       <img src={product.images[0]} alt={product.name} />
//                     ) : (
//                       <div className="no-image">📷</div>
//                     )}
//                   </div>
//                   <div className="product-info">
//                     <h4>{product.name}</h4>
//                     <p className="product-price">${product.price}</p>
//                     <p className="product-stock">Stock: {product.stock}</p>
//                     <div className="product-actions">
//                       <Link to={`/seller/products/edit/${product.id}`} className="btn-edit">
//                         Edit
//                       </Link>
//                       <Link to={`/products/${product.slug}`} className="btn-view">
//                         View
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="no-products">
//                 <p>You haven't added any products yet.</p>
//                 <Link to="/seller/products/add" className="btn-add-product">
//                   + Add Your First Product
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="quick-actions">
//           <h3>Quick Actions</h3>
//           <div className="action-buttons">
//             <Link to="/seller/products/add" className="action-btn">
//               <span className="action-icon">➕</span>
//               Add New Product
//             </Link>
//             <Link to="/seller/orders" className="action-btn">
//               <span className="action-icon">📋</span>
//               Process Orders
//             </Link>
//             <Link to="/seller/earnings/withdraw" className="action-btn">
//               <span className="action-icon">💰</span>
//               Withdraw Earnings
//             </Link>
//             <Link to="/seller/profile/edit" className="action-btn">
//               <span className="action-icon">⚙️</span>
//               Store Settings
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }





// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import * as api from '../api';
// import toast from 'react-hot-toast';
// import './SellerDashboard.css';

// export default function SellerDashboard() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Initialize stats with default values to prevent undefined errors
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     totalOrders: 0,
//     totalRevenue: 0,
//     pendingOrders: 0,
//     balance: 0,
//     pendingBalance: 0
//   });
  
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [recentProducts, setRecentProducts] = useState([]);

//   useEffect(() => {
//     // Redirect if not seller
//     if (user && user.role !== 'seller') {
//       toast.error('Access denied. Seller only.');
//       navigate('/');
//       return;
//     }

//     loadDashboardData();
//   }, [user, navigate]);

//   const loadDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('Loading dashboard data...');
//       const dashboardData = await api.seller.dashboard();
//       console.log('Dashboard data received:', dashboardData);
      
//       // Safely update state with default values if data is missing
//       setStats({
//         totalProducts: dashboardData?.totalProducts ?? 0,
//         totalOrders: dashboardData?.totalOrders ?? 0,
//         totalRevenue: dashboardData?.totalRevenue ?? 0,
//         pendingOrders: dashboardData?.pendingOrders ?? 0,
//         balance: dashboardData?.balance ?? 0,
//         pendingBalance: dashboardData?.pendingBalance ?? 0
//       });
      
//       setRecentOrders(dashboardData?.recentOrders || []);
//       setRecentProducts(dashboardData?.recentProducts || []);
      
//     } catch (error) {
//       console.error('Error loading dashboard:', error);
//       setError(error.message || 'Failed to load dashboard data');
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   // Format price helper
//   const formatPrice = (price) => {
//     if (price === null || price === undefined) return '0.00';
//     const num = parseFloat(price);
//     return isNaN(num) ? '0.00' : num.toFixed(2);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="seller-loading">
//         <div className="loader"></div>
//         <p>Loading your dashboard...</p>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="seller-error">
//         <div className="error-icon">⚠️</div>
//         <h3>Something went wrong</h3>
//         <p>{error}</p>
//         <div className="error-actions">
//           <button onClick={loadDashboardData} className="btn-retry">
//             Try Again
//           </button>
//           <button onClick={handleLogout} className="btn-logout-error">
//             Logout
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="seller-dashboard">
//       {/* Sidebar */}
//       <aside className="dashboard-sidebar">
//         <div className="sidebar-header">
//           <div className="seller-avatar">
//             {user?.first_name?.charAt(0) || 'S'}
//           </div>
//           <div className="seller-info">
//             <h3>{user?.first_name} {user?.last_name}</h3>
//             <p>{user?.email}</p>
//             <span className="seller-badge">Seller</span>
//           </div>
//         </div>

//         <nav className="sidebar-nav">
//           <Link to="/seller/dashboard" className="nav-link active">
//             <span className="nav-icon">📊</span>
//             Dashboard
//           </Link>
//           <Link to="/seller/products" className="nav-link">
//             <span className="nav-icon">📦</span>
//             My Products
//           </Link>
//           <Link to="/seller/products/add" className="nav-link">
//             <span className="nav-icon">➕</span>
//             Add Product
//           </Link>
//           <Link to="/seller/orders" className="nav-link">
//             <span className="nav-icon">🛍️</span>
//             Orders
//           </Link>
//           <Link to="/seller/earnings" className="nav-link">
//             <span className="nav-icon">💰</span>
//             Earnings
//           </Link>
//           <Link to="/seller/profile" className="nav-link">
//             <span className="nav-icon">👤</span>
//             Profile
//           </Link>
//           <button onClick={handleLogout} className="nav-link logout-btn">
//             <span className="nav-icon">🚪</span>
//             Logout
//           </button>
//         </nav>

//         <div className="sidebar-footer">
//           <div className="seller-status">
//             <span className="status-dot"></span>
//             <span>Online</span>
//           </div>
//           <p className="seller-help">Need help? <Link to="/support">Contact support</Link></p>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="dashboard-main">
//         <div className="dashboard-header">
//           <h1>Welcome back, {user?.first_name || 'Seller'}! 👋</h1>
//           <p>Here's what's happening with your store today.</p>
//         </div>

//         {/* Stats Cards - Using safe values from stats state */}
//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-icon">📦</div>
//             <div className="stat-content">
//               <h3>Total Products</h3>
//               <p className="stat-number">{stats.totalProducts}</p>
//               <Link to="/seller/products" className="stat-link">View all →</Link>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">🛍️</div>
//             <div className="stat-content">
//               <h3>Total Orders</h3>
//               <p className="stat-number">{stats.totalOrders}</p>
//               <Link to="/seller/orders" className="stat-link">View all →</Link>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">💰</div>
//             <div className="stat-content">
//               <h3>Total Revenue</h3>
//               <p className="stat-number">${formatPrice(stats.totalRevenue)}</p>
//               <Link to="/seller/earnings" className="stat-link">View earnings →</Link>
//             </div>
//           </div>

//           <div className="stat-card warning">
//             <div className="stat-icon">⏳</div>
//             <div className="stat-content">
//               <h3>Pending Orders</h3>
//               <p className="stat-number">{stats.pendingOrders}</p>
//               <Link to="/seller/orders?status=pending" className="stat-link">Process →</Link>
//             </div>
//           </div>
//         </div>

//         {/* Balance Cards */}
//         <div className="balance-grid">
//           <div className="balance-card">
//             <h4>Available Balance</h4>
//             <p className="balance-amount">${formatPrice(stats.balance)}</p>
//             <button className="btn-withdraw">Withdraw</button>
//           </div>
//           <div className="balance-card pending">
//             <h4>Pending Balance</h4>
//             <p className="balance-amount">${formatPrice(stats.pendingBalance)}</p>
//             <p className="balance-note">Will be available after delivery</p>
//           </div>
//         </div>

//         {/* Recent Orders */}
//         <div className="dashboard-section">
//           <div className="section-header">
//             <h2>Recent Orders</h2>
//             <Link to="/seller/orders" className="view-all">View all →</Link>
//           </div>
          
//           <div className="table-responsive">
//             <table className="orders-table">
//               <thead>
//                 <tr>
//                   <th>Order ID</th>
//                   <th>Customer</th>
//                   <th>Product</th>
//                   <th>Quantity</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                   <th>Date</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recentOrders.length > 0 ? (
//                   recentOrders.map(order => (
//                     <tr key={order.id}>
//                       <td>#{order.order_number || order.id}</td>
//                       <td>{order.customer_name || 'N/A'}</td>
//                       <td>{order.product_name || 'N/A'}</td>
//                       <td>{order.quantity || 1}</td>
//                       <td>${formatPrice(order.amount)}</td>
//                       <td>
//                         <span className={`status-badge ${order.status || 'pending'}`}>
//                           {order.status || 'pending'}
//                         </span>
//                       </td>
//                       <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</td>
//                       <td>
//                         <Link to={`/seller/orders/${order.id}`} className="btn-view">
//                           View
//                         </Link>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="text-center">
//                       No orders yet
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Recent Products */}
//         <div className="dashboard-section">
//           <div className="section-header">
//             <h2>Your Products</h2>
//             <Link to="/seller/products" className="view-all">Manage products →</Link>
//           </div>
          
//           <div className="products-grid">
//             {recentProducts.length > 0 ? (
//               recentProducts.map(product => (
//                 <div key={product.id} className="product-card">
//                   <div className="product-image">
//                     {product.images && product.images.length > 0 ? (
//                       <img src={product.images[0]} alt={product.name} />
//                     ) : (
//                       <div className="no-image">📷</div>
//                     )}
//                   </div>
//                   <div className="product-info">
//                     <h4>{product.name || 'Unnamed Product'}</h4>
//                     <p className="product-price">${formatPrice(product.price)}</p>
//                     <p className="product-stock">Stock: {product.stock || 0}</p>
//                     <div className="product-status">
//                       <span className={`status-badge ${product.status || 'pending'}`}>
//                         {product.status || 'pending'}
//                       </span>
//                     </div>
//                     <div className="product-actions">
//                       <Link to={`/seller/products/edit/${product.id}`} className="btn-edit">
//                         Edit
//                       </Link>
//                       <Link to={`/products/${product.slug}`} className="btn-view">
//                         View
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="no-products">
//                 <p>You haven't added any products yet.</p>
//                 <Link to="/seller/products/add" className="btn-add-product">
//                   + Add Your First Product
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="quick-actions">
//           <h3>Quick Actions</h3>
//           <div className="action-buttons">
//             <Link to="/seller/products/add" className="action-btn">
//               <span className="action-icon">➕</span>
//               Add New Product
//             </Link>
//             <Link to="/seller/orders" className="action-btn">
//               <span className="action-icon">📋</span>
//               Process Orders
//             </Link>
//             <Link to="/seller/earnings" className="action-btn">
//               <span className="action-icon">💰</span>
//               View Earnings
//             </Link>
//             <Link to="/seller/profile" className="action-btn">
//               <span className="action-icon">⚙️</span>
//               Store Settings
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }





import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import toast from 'react-hot-toast';
import './SellerDashboard.css';

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize stats with default values to prevent undefined errors
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    balance: 0,
    pendingBalance: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    // Redirect if not seller
    if (user && user.role !== 'seller') {
      toast.error('Access denied. Seller only.');
      navigate('/');
      return;
    }

    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading dashboard data...');
      const dashboardData = await api.seller.dashboard();
      console.log('Dashboard data received:', dashboardData);
      
      // Safely update state with nullish coalescing to handle undefined values
      setStats({
        totalProducts: dashboardData?.totalProducts ?? 0,
        totalOrders: dashboardData?.totalOrders ?? 0,
        totalRevenue: dashboardData?.totalRevenue ?? 0,
        pendingOrders: dashboardData?.pendingOrders ?? 0,
        balance: dashboardData?.balance ?? 0,
        pendingBalance: dashboardData?.pendingBalance ?? 0
      });
      
      setRecentOrders(dashboardData?.recentOrders || []);
      setRecentProducts(dashboardData?.recentProducts || []);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError(error.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Format price helper
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0.00';
    const num = parseFloat(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Loading state
  if (loading) {
    return (
      <div className="seller-loading">
        <div className="loader"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="seller-error">
        <div className="error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={loadDashboardData} className="btn-retry">
            Try Again
          </button>
          <button onClick={handleLogout} className="btn-logout-error">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="seller-avatar">
            {user?.first_name?.charAt(0) || 'S'}
          </div>
          <div className="seller-info">
            <h3>{user?.first_name} {user?.last_name}</h3>
            <p>{user?.email}</p>
            <span className="seller-badge">Seller</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/seller/dashboard" className="nav-link active">
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
          <Link to="/seller/products" className="nav-link">
            <span className="nav-icon"></span>
            My Products
          </Link>
          <Link to="/seller/products/add" className="nav-link">
            <span className="nav-icon"></span>
            Add Product
          </Link>
          <Link to="/seller/orders" className="nav-link">
            <span className="nav-icon"></span>
            Orders
          </Link>
          <Link to="/seller/earnings" className="nav-link">
            <span className="nav-icon"></span>
            Earnings
          </Link>
          <Link to="/seller/profile" className="nav-link">
            <span className="nav-icon">👤</span>
            Profile
          </Link>
          <button onClick={handleLogout} className="nav-link logout-btn">
            <span className="nav-icon"></span>
            Logout
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="seller-status">
            <span className="status-dot"></span>
            <span>Online</span>
          </div>
          <p className="seller-help">Need help? <Link to="/support">Contact support</Link></p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.first_name || 'Seller'}! </h1>
          <p>Here's what's happening with your store today.</p>
        </div>

        {/* Stats Cards - Using safe values from stats state */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>Total Products</h3>
              <p className="stat-number">{stats.totalProducts}</p>
              <Link to="/seller/products" className="stat-link">View all →</Link>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p className="stat-number">{stats.totalOrders}</p>
              <Link to="/seller/orders" className="stat-link">View all →</Link>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-number">${formatPrice(stats.totalRevenue)}</p>
              <Link to="/seller/earnings" className="stat-link">View earnings →</Link>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>Pending Orders</h3>
              <p className="stat-number">{stats.pendingOrders}</p>
              <Link to="/seller/orders?status=pending" className="stat-link">Process →</Link>
            </div>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="balance-grid">
          <div className="balance-card">
            <h4>Available Balance</h4>
            <p className="balance-amount">ETB{formatPrice(stats.balance)}</p>
            <button className="btn-withdraw">Withdraw</button>
          </div>
          <div className="balance-card pending">
            <h4>Pending Balance</h4>
            <p className="balance-amount">ETB{formatPrice(stats.pendingBalance)}</p>
            <p className="balance-note">Will be available after delivery</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/seller/orders" className="view-all">View all →</Link>
          </div>
          
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.order_number || order.id}</td>
                      <td>{order.customer_name || 'N/A'}</td>
                      <td>{order.product_name || 'N/A'}</td>
                      <td>{order.quantity || 1}</td>
                      <td>ETB{formatPrice(order.amount)}</td>
                      <td>
                        <span className={`status-badge ${order.status || 'pending'}`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <Link to={`/seller/orders/${order.id}`} className="btn-view">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Products */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Your Products</h2>
            <Link to="/seller/products" className="view-all">Manage products →</Link>
          </div>
          
          <div className="products-grid">
            {recentProducts.length > 0 ? (
              recentProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} />
                    ) : (
                      <div className="no-image"></div>
                    )}
                  </div>
                  <div className="product-info">
                    <h4>{product.name || 'Unnamed Product'}</h4>
                    <p className="product-price">ETB{formatPrice(product.price)}</p>
                    <p className="product-stock">Stock: {product.stock || 0}</p>
                    <div className="product-status">
                      <span className={`status-badge ${product.status || 'pending'}`}>
                        {product.status || 'pending'}
                      </span>
                    </div>
                    <div className="product-actions">
                      <Link to={`/seller/products/edit/${product.id}`} className="btn-edit">
                        Edit
                      </Link>
                      <Link to={`/products/${product.slug}`} className="btn-view">
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">
                <p>You haven't added any products yet.</p>
                <Link to="/seller/products/add" className="btn-add-product">
                  + Add Your First Product
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/seller/products/add" className="action-btn">
              <span className="action-icon"></span>
              Add New Product
            </Link>
            <Link to="/seller/orders" className="action-btn">
              <span className="action-icon"></span>
              Process Orders
            </Link>
            <Link to="/seller/earnings" className="action-btn">
              <span className="action-icon"></span>
              View Earnings
            </Link>
            <Link to="/seller/profile" className="action-btn">
              <span className="action-icon"></span>
              Store Settings
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}