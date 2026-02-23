// // import React, { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import api from '../services/api';
// // import './Dashboard.css';

// // export default function Dashboard() {
// //   const [stats, setStats] = useState({
// //     totalUsers: 0,
// //     totalSellers: 0,
// //     pendingSellers: 0,
// //     totalProducts: 0,
// //     pendingProducts: 0,
// //     totalOrders: 0,
// //     totalRevenue: 0
// //   });
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     loadDashboard();
// //   }, []);

// //   const loadDashboard = async () => {
// //     try {
// //       const response = await api.get('/admin/dashboard');
// //       console.log('Dashboard data:', response.data); // For debugging
// //       setStats(response.data);
// //     } catch (error) {
// //       console.error('Error loading dashboard:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Helper function to safely format revenue
// //   const formatRevenue = (revenue) => {
// //     if (revenue === null || revenue === undefined) return '0.00';
    
// //     // Convert to number if it's a string
// //     const num = typeof revenue === 'string' ? parseFloat(revenue) : revenue;
    
// //     // Check if it's a valid number
// //     if (isNaN(num)) return '0.00';
    
// //     return num.toFixed(2);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="dashboard-loading">
// //         <div className="spinner"></div>
// //         <p>Loading dashboard...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="dashboard">
// //       <h1 className="dashboard-title">Admin Dashboard</h1>

// //       <div className="stats-grid">
// //         {/* Total Users */}
// //         <div className="stat-card">
// //           <div className="stat-icon">👥</div>
// //           <div className="stat-content">
// //             <h3>Total Users</h3>
// //             <p className="stat-number">{stats?.totalUsers || 0}</p>
// //             <Link to="/admin/sellers" className="stat-link">View All Users →</Link>
// //           </div>
// //         </div>

// //         {/* Total Sellers */}
// //         <div className="stat-card">
// //           <div className="stat-icon">🛒</div>
// //           <div className="stat-content">
// //             <h3>Total Sellers</h3>
// //             <p className="stat-number">{stats?.totalSellers || 0}</p>
// //             <Link to="/admin/sellers" className="stat-link">Manage Sellers →</Link>
// //           </div>
// //         </div>

// //         {/* Pending Sellers */}
// //         <div className="stat-card warning">
// //           <div className="stat-icon">⏳</div>
// //           <div className="stat-content">
// //             <h3>Pending Sellers</h3>
// //             <p className="stat-number">{stats?.pendingSellers || 0}</p>
// //             <Link to="/admin/sellers?status=pending" className="stat-link">Review →</Link>
// //           </div>
// //         </div>

// //         {/* Total Products */}
// //         <div className="stat-card">
// //           <div className="stat-icon">📦</div>
// //           <div className="stat-content">
// //             <h3>Total Products</h3>
// //             <p className="stat-number">{stats?.totalProducts || 0}</p>
// //             <Link to="/admin/products" className="stat-link">Manage Products →</Link>
// //           </div>
// //         </div>

// //         {/* Pending Products */}
// //         <div className="stat-card warning">
// //           <div className="stat-icon">⏳</div>
// //           <div className="stat-content">
// //             <h3>Pending Products</h3>
// //             <p className="stat-number">{stats?.pendingProducts || 0}</p>
// //             <Link to="/admin/products?status=pending" className="stat-link">Review →</Link>
// //           </div>
// //         </div>

// //         {/* Total Orders */}
// //         <div className="stat-card">
// //           <div className="stat-icon">🛍️</div>
// //           <div className="stat-content">
// //             <h3>Total Orders</h3>
// //             <p className="stat-number">{stats?.totalOrders || 0}</p>
// //             <Link to="/admin/orders" className="stat-link">View Orders →</Link>
// //           </div>
// //         </div>

// //         {/* Total Revenue */}
// //         <div className="stat-card success">
// //           <div className="stat-icon"></div>
// //           <div className="stat-content">
// //             <h3>Total Revenue</h3>
// //             <p className="stat-number">ETB{formatRevenue(stats?.totalRevenue)}</p>
// //             <span className="stat-label">Lifetime earnings</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Quick Actions */}
// //       <div className="quick-actions">
// //         <h2>Quick Actions</h2>
// //         <div className="action-grid">
// //           <Link to="/admin/products?status=pending" className="action-card">
// //             <span className="action-icon">📦</span>
// //             <h4>Review Pending Products</h4>
// //             <p>{stats?.pendingProducts || 0} products awaiting approval</p>
// //           </Link>

// //           <Link to="/admin/sellers?status=pending" className="action-card">
// //             <span className="action-icon">👥</span>
// //             <h4>Review Seller Applications</h4>
// //             <p>{stats?.pendingSellers || 0} sellers awaiting approval</p>
// //           </Link>

// //           <Link to="/admin/categories" className="action-card">
// //             <span className="action-icon">📁</span>
// //             <h4>Manage Categories</h4>
// //             <p>Add, edit, or delete categories</p>
// //           </Link>

// //           <Link to="/admin/banners" className="action-card">
// //             <span className="action-icon">🖼️</span>
// //             <h4>Manage Banners</h4>
// //             <p>Update homepage banners</p>
// //           </Link>
// //         </div>
// //       </div>

// //       {/* Recent Activity - Optional */}
// //       <div className="recent-activity">
// //         <h2>System Overview</h2>
// //         <div className="activity-stats">
// //           <div className="activity-item">
// //             <span className="activity-label">Users:</span>
// //             <span className="activity-value">{stats?.totalUsers || 0}</span>
// //           </div>
// //           <div className="activity-item">
// //             <span className="activity-label">Sellers:</span>
// //             <span className="activity-value">{stats?.totalSellers || 0}</span>
// //           </div>
// //           <div className="activity-item">
// //             <span className="activity-label">Products:</span>
// //             <span className="activity-value">{stats?.totalProducts || 0}</span>
// //           </div>
// //           <div className="activity-item">
// //             <span className="activity-label">Orders:</span>
// //             <span className="activity-value">{stats?.totalOrders || 0}</span>
// //           </div>
// //           <div className="activity-item">
// //             <span className="activity-label">Revenue:</span>
// //             <span className="activity-value">ETB{formatRevenue(stats?.totalRevenue)}</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   AreaChart,
//   Area
// } from 'recharts';
// import api from '../services/api';
// import './Dashboard.css';

// export default function Dashboard() {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalSellers: 0,
//     pendingSellers: 0,
//     totalProducts: 0,
//     pendingProducts: 0,
//     totalOrders: 0,
//     totalRevenue: 0,
//     recentOrders: [],
//     monthlyData: [],
//     categoryDistribution: [],
//     orderStatusData: [],
//     revenueChange: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState('month');

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6384', '#36A2EB'];

//   useEffect(() => {
//     loadDashboard();
//   }, [timeRange]);

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(`/admin/dashboard?range=${timeRange}`);
//       console.log('✅ Dashboard data received:', response.data);
      
//       // Log each data array to check
//       console.log('📊 monthlyData:', response.data.monthlyData);
//       console.log('📊 categoryDistribution:', response.data.categoryDistribution);
//       console.log('📊 orderStatusData:', response.data.orderStatusData);
//       console.log('📊 recentOrders:', response.data.recentOrders);
      
//       setStats({
//         totalUsers: response.data.totalUsers || 0,
//         totalSellers: response.data.totalSellers || 0,
//         pendingSellers: response.data.pendingSellers || 0,
//         totalProducts: response.data.totalProducts || 0,
//         pendingProducts: response.data.pendingProducts || 0,
//         totalOrders: response.data.totalOrders || 0,
//         totalRevenue: response.data.totalRevenue || 0,
//         recentOrders: response.data.recentOrders || [],
//         monthlyData: response.data.monthlyData || [],
//         categoryDistribution: response.data.categoryDistribution || [],
//         orderStatusData: response.data.orderStatusData || [],
//         revenueChange: response.data.revenueChange || 0
//       });
//     } catch (error) {
//       console.error('❌ Error loading dashboard:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatRevenue = (revenue) => {
//     if (revenue === null || revenue === undefined) return '0.00';
//     const num = typeof revenue === 'string' ? parseFloat(revenue) : revenue;
//     if (isNaN(num)) return '0.00';
//     return num.toFixed(2);
//   };

//   if (loading) {
//     return (
//       <div className="dashboard-loading">
//         <div className="spinner"></div>
//         <p>Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <h1 className="dashboard-title">Admin Dashboard</h1>
//         <div className="time-range-selector">
//           <button 
//             className={timeRange === 'week' ? 'active' : ''} 
//             onClick={() => setTimeRange('week')}
//           >
//             Week
//           </button>
//           <button 
//             className={timeRange === 'month' ? 'active' : ''} 
//             onClick={() => setTimeRange('month')}
//           >
//             Month
//           </button>
//           <button 
//             className={timeRange === 'year' ? 'active' : ''} 
//             onClick={() => setTimeRange('year')}
//           >
//             Year
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="stats-grid">
//         {/* Total Revenue Card */}
//         <div className="stat-card featured">
//           <div className="stat-icon">💰</div>
//           <div className="stat-content">
//             <span className="stat-label">Total Revenue</span>
//             <h2 className="stat-number large">ETB {formatRevenue(stats.totalRevenue)}</h2>
//             <span className={`stat-trend ${stats.revenueChange >= 0 ? 'positive' : 'negative'}`}>
//               {stats.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueChange)}% from previous period
//             </span>
//           </div>
//         </div>

//         {/* Total Orders */}
//         <div className="stat-card">
//           <div className="stat-icon">🛍️</div>
//           <div className="stat-content">
//             <span className="stat-label">Total Orders</span>
//             <h2 className="stat-number">{stats.totalOrders}</h2>
//             <Link to="/admin/orders" className="stat-link">View Details →</Link>
//           </div>
//         </div>

//         {/* Total Users */}
//         <div className="stat-card">
//           <div className="stat-icon">👥</div>
//           <div className="stat-content">
//             <span className="stat-label">Total Users</span>
//             <h2 className="stat-number">{stats.totalUsers}</h2>
//             <Link to="/admin/users" className="stat-link">Manage Users →</Link>
//           </div>
//         </div>

//         {/* Total Sellers */}
//         <div className="stat-card">
//           <div className="stat-icon">🛒</div>
//           <div className="stat-content">
//             <span className="stat-label">Total Sellers</span>
//             <h2 className="stat-number">{stats.totalSellers}</h2>
//             <Link to="/admin/sellers" className="stat-link">Manage Sellers →</Link>
//           </div>
//         </div>

//         {/* Pending Sellers */}
//         <div className="stat-card warning">
//           <div className="stat-icon">⏳</div>
//           <div className="stat-content">
//             <span className="stat-label">Pending Sellers</span>
//             <h2 className="stat-number">{stats.pendingSellers}</h2>
//             <Link to="/admin/sellers?status=pending" className="stat-link">Review →</Link>
//           </div>
//         </div>

//         {/* Total Products */}
//         <div className="stat-card">
//           <div className="stat-icon">📦</div>
//           <div className="stat-content">
//             <span className="stat-label">Total Products</span>
//             <h2 className="stat-number">{stats.totalProducts}</h2>
//             <Link to="/admin/products" className="stat-link">Manage Products →</Link>
//           </div>
//         </div>

//         {/* Pending Products */}
//         <div className="stat-card warning">
//           <div className="stat-icon">⏳</div>
//           <div className="stat-content">
//             <span className="stat-label">Pending Products</span>
//             <h2 className="stat-number">{stats.pendingProducts}</h2>
//             <Link to="/admin/products?status=pending" className="stat-link">Review →</Link>
//           </div>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="charts-grid">
//         {/* Revenue Trend Chart */}
//         <div className="chart-card">
//           <h3>Revenue Trend ({timeRange === 'week' ? 'Last 7 Days' : timeRange === 'month' ? 'This Month' : 'This Year'})</h3>
//           {stats.monthlyData && stats.monthlyData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={stats.monthlyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip formatter={(value) => `ETB ${value}`} />
//                 <Area 
//                   type="monotone" 
//                   dataKey="revenue" 
//                   stroke="#8884d8" 
//                   fill="#8884d8" 
//                   fillOpacity={0.3}
//                   name="Revenue"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="no-chart-data">
//               No revenue data available
//               <br />
//               <small>(Create some orders to see data)</small>
//             </div>
//           )}
//         </div>

//         {/* Orders & Products Comparison */}
//         <div className="chart-card">
//           <h3>Orders vs Products Sold</h3>
//           {stats.monthlyData && stats.monthlyData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={stats.monthlyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="orders" fill="#8884d8" name="Orders" />
//                 <Bar dataKey="products" fill="#82ca9d" name="Products Sold" />
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="no-chart-data">
//               No order data available
//               <br />
//               <small>(Create some orders to see data)</small>
//             </div>
//           )}
//         </div>

//         {/* Category Distribution */}
//         <div className="chart-card">
//           <h3>Products by Category</h3>
//           {stats.categoryDistribution && stats.categoryDistribution.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={stats.categoryDistribution}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={entry => `${entry.name}: ${entry.value}`}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {stats.categoryDistribution.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="no-chart-data">
//               No category data available
//               <br />
//               <small>(Add products to categories)</small>
//             </div>
//           )}
//         </div>

//         {/* Order Status Distribution */}
//         <div className="chart-card">
//           <h3>Order Status Distribution</h3>
//           {stats.orderStatusData && stats.orderStatusData.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={stats.orderStatusData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   paddingAngle={5}
//                   dataKey="value"
//                   label={entry => `${entry.name}: ${entry.value}`}
//                 >
//                   {stats.orderStatusData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="no-chart-data">
//               No order status data available
//               <br />
//               <small>(Create orders to see status distribution)</small>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="quick-actions">
//         <h2>Quick Actions</h2>
//         <div className="action-grid">
//           <Link to="/admin/products?status=pending" className="action-card">
//             <span className="action-icon">📦</span>
//             <h4>Review Pending Products</h4>
//             <p>{stats.pendingProducts} products awaiting approval</p>
//             {stats.pendingProducts > 0 && <span className="badge">{stats.pendingProducts}</span>}
//           </Link>

//           <Link to="/admin/sellers?status=pending" className="action-card">
//             <span className="action-icon">👥</span>
//             <h4>Review Seller Applications</h4>
//             <p>{stats.pendingSellers} sellers awaiting approval</p>
//             {stats.pendingSellers > 0 && <span className="badge">{stats.pendingSellers}</span>}
//           </Link>

//           <Link to="/admin/categories" className="action-card">
//             <span className="action-icon">📁</span>
//             <h4>Manage Categories</h4>
//             <p>Add, edit, or delete categories</p>
//           </Link>

//           <Link to="/admin/banners" className="action-card">
//             <span className="action-icon">🖼️</span>
//             <h4>Manage Banners</h4>
//             <p>Update homepage banners</p>
//           </Link>
//         </div>
//       </div>

//       {/* Recent Orders Table */}
//       <div className="recent-orders">
//         <h2>Recent Orders</h2>
//         {stats.recentOrders && stats.recentOrders.length > 0 ? (
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order #</th>
//                 <th>Customer</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stats.recentOrders.map((order) => (
//                 <tr key={order.id}>
//                   <td>#{order.order_number || order.id}</td>
//                   <td>{order.customerName || 'Guest'}</td>
//                   <td>ETB {formatRevenue(order.amount)}</td>
//                   <td>
//                     <span className={`status-badge status-${order.status.toLowerCase()}`}>
//                       {order.status}
//                     </span>
//                   </td>
//                   <td>{new Date(order.date).toLocaleDateString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <div className="no-data">No recent orders</div>
//         )}
//       </div>

//       {/* Debug Info - Remove after fixing */}
//       <div style={{ background: '#f0f0f0', padding: '20px', marginTop: '20px', borderRadius: '8px' }}>
//         <h3>🔍 Debug Info:</h3>
//         <p><strong>Total Orders:</strong> {stats.totalOrders}</p>
//         <p><strong>Monthly Data Length:</strong> {stats.monthlyData?.length || 0}</p>
//         <p><strong>Category Data Length:</strong> {stats.categoryDistribution?.length || 0}</p>
//         <p><strong>Order Status Data Length:</strong> {stats.orderStatusData?.length || 0}</p>
//         <p><strong>Recent Orders Length:</strong> {stats.recentOrders?.length || 0}</p>
//       </div>
//     </div>
//   );
// }





import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import api from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    pendingSellers: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    dailyRevenue: [],
    monthlyRevenue: [],
    categoryDistribution: [],
    orderStatusData: [],
    topProducts: [],
    revenueChange: 0
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6384', '#36A2EB'];

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching dashboard data...');
      
      const response = await api.get('/admin/dashboard');
      
      console.log('✅ Dashboard data received:', response.data);
      
      // Log each data array to see what's coming
      console.log('📊 dailyRevenue:', response.data.dailyRevenue);
      console.log('📊 monthlyRevenue:', response.data.monthlyRevenue);
      console.log('📊 categoryDistribution:', response.data.categoryDistribution);
      console.log('📊 orderStatusData:', response.data.orderStatusData);
      console.log('📊 topProducts:', response.data.topProducts);
      console.log('📊 recentOrders:', response.data.recentOrders);
      
      setStats({
        totalUsers: response.data.totalUsers || 0,
        totalSellers: response.data.totalSellers || 0,
        pendingSellers: response.data.pendingSellers || 0,
        totalProducts: response.data.totalProducts || 0,
        pendingProducts: response.data.pendingProducts || 0,
        totalOrders: response.data.totalOrders || 0,
        totalRevenue: response.data.totalRevenue || 0,
        recentOrders: response.data.recentOrders || [],
        dailyRevenue: response.data.dailyRevenue || [],
        monthlyRevenue: response.data.monthlyRevenue || [],
        categoryDistribution: response.data.categoryDistribution || [],
        orderStatusData: response.data.orderStatusData || [],
        topProducts: response.data.topProducts || [],
        revenueChange: response.data.revenueChange || 0
      });
    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRevenue = (revenue) => {
    if (revenue === null || revenue === undefined) return '0.00';
    const num = typeof revenue === 'string' ? parseFloat(revenue) : revenue;
    if (isNaN(num)) return '0.00';
    return num.toFixed(2);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card featured">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-label">Total Revenue</span>
            <h2 className="stat-number large">ETB {formatRevenue(stats.totalRevenue)}</h2>
            <span className="stat-trend positive">↑ {stats.revenueChange}% lifetime</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-content">
            <span className="stat-label">Total Orders</span>
            <h2 className="stat-number">{stats.totalOrders}</h2>
            <Link to="/admin/orders" className="stat-link">View Details →</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-label">Total Users</span>
            <h2 className="stat-number">{stats.totalUsers}</h2>
            <Link to="/admin/users" className="stat-link">Manage Users →</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <span className="stat-label">Total Sellers</span>
            <h2 className="stat-number">{stats.totalSellers}</h2>
            <Link to="/admin/sellers" className="stat-link">Manage Sellers →</Link>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <span className="stat-label">Pending Sellers</span>
            <h2 className="stat-number">{stats.pendingSellers}</h2>
            <Link to="/admin/sellers?status=pending" className="stat-link">Review →</Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <span className="stat-label">Total Products</span>
            <h2 className="stat-number">{stats.totalProducts}</h2>
            <Link to="/admin/products" className="stat-link">Manage Products →</Link>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <span className="stat-label">Pending Products</span>
            <h2 className="stat-number">{stats.pendingProducts}</h2>
            <Link to="/admin/products?status=pending" className="stat-link">Review →</Link>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Daily Revenue Chart */}
        <div className="chart-card">
          <h3>Daily Revenue (Last 7 Days)</h3>
          {stats.dailyRevenue && stats.dailyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `ETB ${formatRevenue(value)}`} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-chart-data">
              No daily revenue data
              <br />
              <small>Check console for data: {stats.dailyRevenue?.length || 0} items</small>
            </div>
          )}
        </div>

        {/* Monthly Revenue Chart */}
        <div className="chart-card">
          <h3>Monthly Revenue (Last 30 Days)</h3>
          {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `ETB ${formatRevenue(value)}`} />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-chart-data">
              No monthly revenue data
              <br />
              <small>Check console for data: {stats.monthlyRevenue?.length || 0} items</small>
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="chart-card">
          <h3>Products by Category</h3>
          {stats.categoryDistribution && stats.categoryDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={entry => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-chart-data">
              No category data
              <br />
              <small>Check console for data: {stats.categoryDistribution?.length || 0} items</small>
            </div>
          )}
        </div>

        {/* Order Status Distribution */}
        <div className="chart-card">
          <h3>Order Status</h3>
          {stats.orderStatusData && stats.orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={entry => `${entry.name}: ${entry.value}`}
                >
                  {stats.orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-chart-data">
              No order status data
              <br />
              <small>Check console for data: {stats.orderStatusData?.length || 0} items</small>
            </div>
          )}
        </div>

        {/* Top Products Chart */}
        <div className="chart-card">
          <h3>Top Selling Products</h3>
          {stats.topProducts && stats.topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={stats.topProducts} 
                layout="vertical"
                margin={{ left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Bar dataKey="total_sold" fill="#82ca9d" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-chart-data">
              No product sales data
              <br />
              <small>Check console for data: {stats.topProducts?.length || 0} items</small>
            </div>
          )}
        </div>

        {/* Recent Orders Table */}
        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
          <h3>Recent Orders</h3>
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.order_number}</td>
                    <td>{order.customerName}</td>
                    <td>ETB {formatRevenue(order.amount)}</td>
                    <td>
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              No recent orders
              <br />
              <small>Check console for data: {stats.recentOrders?.length || 0} items</small>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/admin/products?status=pending" className="action-card">
            <span className="action-icon">📦</span>
            <h4>Review Pending Products</h4>
            <p>{stats.pendingProducts} products awaiting approval</p>
            {stats.pendingProducts > 0 && <span className="badge">{stats.pendingProducts}</span>}
          </Link>

          <Link to="/admin/sellers?status=pending" className="action-card">
            <span className="action-icon">👥</span>
            <h4>Review Seller Applications</h4>
            <p>{stats.pendingSellers} sellers awaiting approval</p>
            {stats.pendingSellers > 0 && <span className="badge">{stats.pendingSellers}</span>}
          </Link>

          <Link to="/admin/categories" className="action-card">
            <span className="action-icon">📁</span>
            <h4>Manage Categories</h4>
            <p>Add, edit, or delete categories</p>
          </Link>

          <Link to="/admin/banners" className="action-card">
            <span className="action-icon">🖼️</span>
            <h4>Manage Banners</h4>
            <p>Update homepage banners</p>
          </Link>
        </div>
      </div>
    </div>
  );
}