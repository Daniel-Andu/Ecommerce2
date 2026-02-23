


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      console.log('Dashboard data:', response.data); // For debugging
      setStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely format revenue
  const formatRevenue = (revenue) => {
    if (revenue === null || revenue === undefined) return '0.00';
    
    // Convert to number if it's a string
    const num = typeof revenue === 'string' ? parseFloat(revenue) : revenue;
    
    // Check if it's a valid number
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
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="stats-grid">
        {/* Total Users */}
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats?.totalUsers || 0}</p>
            <Link to="/admin/sellers" className="stat-link">View All Users →</Link>
          </div>
        </div>

        {/* Total Sellers */}
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Sellers</h3>
            <p className="stat-number">{stats?.totalSellers || 0}</p>
            <Link to="/admin/sellers" className="stat-link">Manage Sellers →</Link>
          </div>
        </div>

        {/* Pending Sellers */}
        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Sellers</h3>
            <p className="stat-number">{stats?.pendingSellers || 0}</p>
            <Link to="/admin/sellers?status=pending" className="stat-link">Review →</Link>
          </div>
        </div>

        {/* Total Products */}
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-number">{stats?.totalProducts || 0}</p>
            <Link to="/admin/products" className="stat-link">Manage Products →</Link>
          </div>
        </div>

        {/* Pending Products */}
        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Products</h3>
            <p className="stat-number">{stats?.pendingProducts || 0}</p>
            <Link to="/admin/products?status=pending" className="stat-link">Review →</Link>
          </div>
        </div>

        {/* Total Orders */}
        <div className="stat-card">
          <div className="stat-icon">🛍️</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats?.totalOrders || 0}</p>
            <Link to="/admin/orders" className="stat-link">View Orders →</Link>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="stat-card success">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-number">ETB{formatRevenue(stats?.totalRevenue)}</p>
            <span className="stat-label">Lifetime earnings</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/admin/products?status=pending" className="action-card">
            <span className="action-icon">📦</span>
            <h4>Review Pending Products</h4>
            <p>{stats?.pendingProducts || 0} products awaiting approval</p>
          </Link>

          <Link to="/admin/sellers?status=pending" className="action-card">
            <span className="action-icon">👥</span>
            <h4>Review Seller Applications</h4>
            <p>{stats?.pendingSellers || 0} sellers awaiting approval</p>
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

      {/* Recent Activity - Optional */}
      <div className="recent-activity">
        <h2>System Overview</h2>
        <div className="activity-stats">
          <div className="activity-item">
            <span className="activity-label">Users:</span>
            <span className="activity-value">{stats?.totalUsers || 0}</span>
          </div>
          <div className="activity-item">
            <span className="activity-label">Sellers:</span>
            <span className="activity-value">{stats?.totalSellers || 0}</span>
          </div>
          <div className="activity-item">
            <span className="activity-label">Products:</span>
            <span className="activity-value">{stats?.totalProducts || 0}</span>
          </div>
          <div className="activity-item">
            <span className="activity-label">Orders:</span>
            <span className="activity-value">{stats?.totalOrders || 0}</span>
          </div>
          <div className="activity-item">
            <span className="activity-label">Revenue:</span>
            <span className="activity-value">ETB{formatRevenue(stats?.totalRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}






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




// const express = require('express');
// const pool = require('../config/db');
// const { auth, requireRole } = require('../middleware/auth');
// const router = express.Router();

// // All admin routes require authentication and admin role
// router.use(auth);
// router.use(requireRole('admin'));

// // ==================== DASHBOARD STATS WITH REAL DATA ====================
// router.get('/dashboard', async (req, res) => {
//   try {
//     console.log('📊 Fetching REAL dashboard data from database');
    
//     // ===== BASIC STATS =====
//     const [[users]] = await pool.query('SELECT COUNT(*) AS total FROM users');
//     const [[sellers]] = await pool.query('SELECT COUNT(*) AS total FROM sellers WHERE status = "approved"');
//     const [[pendingSellers]] = await pool.query('SELECT COUNT(*) AS total FROM sellers WHERE status = "pending"');
//     const [[products]] = await pool.query('SELECT COUNT(*) AS total FROM products');
//     const [[pendingProducts]] = await pool.query('SELECT COUNT(*) AS total FROM products WHERE status = "pending"');
//     const [[orders]] = await pool.query('SELECT COUNT(*) AS total FROM orders');
//     const [[revenue]] = await pool.query('SELECT COALESCE(SUM(total), 0) AS total FROM orders');
    
//     console.log('✅ Basic stats:', {
//       users: users.total,
//       orders: orders.total,
//       products: products.total
//     });

//     // ===== DAILY REVENUE (Last 7 days) =====
//     const [dailyRevenue] = await pool.query(`
//       SELECT 
//         DATE_FORMAT(created_at, '%a') as name,
//         COALESCE(SUM(total), 0) as revenue,
//         COUNT(*) as orders
//       FROM orders 
//       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
//       GROUP BY DATE(created_at)
//       ORDER BY DATE(created_at) ASC
//     `);
    
//     console.log(`📊 Daily revenue: ${dailyRevenue.length} days`);

//     // ===== MONTHLY REVENUE (Last 30 days) =====
//     const [monthlyRevenue] = await pool.query(`
//       SELECT 
//         DATE_FORMAT(created_at, '%d %b') as name,
//         COALESCE(SUM(total), 0) as revenue,
//         COUNT(*) as orders
//       FROM orders 
//       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
//       GROUP BY DATE(created_at)
//       ORDER BY DATE(created_at) ASC
//     `);
    
//     console.log(`📊 Monthly revenue: ${monthlyRevenue.length} days`);

//     // ===== CATEGORY DISTRIBUTION =====
//     const [categoryData] = await pool.query(`
//       SELECT 
//         COALESCE(c.name, 'Uncategorized') as name,
//         COUNT(p.id) as value
//       FROM products p
//       LEFT JOIN categories c ON p.category_id = c.id
//       WHERE p.status = 'approved'
//       GROUP BY c.id, c.name
//       HAVING value > 0
//       ORDER BY value DESC
//     `);
    
//     console.log(`📊 Categories: ${categoryData.length}`);

//     // ===== ORDER STATUS DISTRIBUTION =====
//     const [statusData] = await pool.query(`
//       SELECT 
//         status as name,
//         COUNT(*) as value
//       FROM orders
//       GROUP BY status
//     `);
    
//     const orderStatusData = statusData.map(s => ({
//       name: s.name.charAt(0).toUpperCase() + s.name.slice(1),
//       value: s.value
//     }));
    
//     console.log(`📊 Order status: ${orderStatusData.length}`);

//     // ===== TOP SELLING PRODUCTS =====
//     const [topProducts] = await pool.query(`
//       SELECT 
//         p.name,
//         COALESCE(SUM(oi.quantity), 0) as total_sold,
//         COALESCE(SUM(oi.total_price), 0) as revenue
//       FROM products p
//       LEFT JOIN order_items oi ON oi.product_id = p.id
//       GROUP BY p.id, p.name
//       ORDER BY total_sold DESC
//       LIMIT 5
//     `);
    
//     console.log(`📊 Top products: ${topProducts.length}`);

//     // ===== RECENT ORDERS =====
//     const [recentOrders] = await pool.query(`
//       SELECT 
//         o.id,
//         o.order_number,
//         o.total as amount,
//         o.status,
//         o.created_at as date,
//         CONCAT(u.first_name, ' ', u.last_name) as customerName
//       FROM orders o
//       JOIN users u ON o.user_id = u.id
//       ORDER BY o.created_at DESC
//       LIMIT 10
//     `);
    
//     console.log(`📊 Recent orders: ${recentOrders.length}`);

//     // ===== CALCULATE REVENUE CHANGE (compared to previous period) =====
//     const [[lastMonthRevenue]] = await pool.query(`
//       SELECT COALESCE(SUM(total), 0) as total
//       FROM orders
//       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY)
//         AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
//     `);
    
//     const revenueChange = lastMonthRevenue.total > 0 
//       ? ((revenue.total - lastMonthRevenue.total) / lastMonthRevenue.total * 100).toFixed(1)
//       : 0;

//     // ===== SEND COMPLETE RESPONSE =====
//     const responseData = {
//       totalUsers: users.total || 0,
//       totalSellers: sellers.total || 0,
//       pendingSellers: pendingSellers.total || 0,
//       totalProducts: products.total || 0,
//       pendingProducts: pendingProducts.total || 0,
//       totalOrders: orders.total || 0,
//       totalRevenue: parseFloat(revenue.total) || 0,
      
//       // Your frontend expects these exact names
//       dailyRevenue: dailyRevenue,
//       monthlyRevenue: monthlyRevenue,
//       categoryDistribution: categoryData,
//       orderStatusData: orderStatusData,
//       topProducts: topProducts,
//       recentOrders: recentOrders,
      
//       revenueChange: parseFloat(revenueChange) || 0
//     };

//     console.log('✅ FINAL DATA COUNTS:', {
//       dailyRevenue: responseData.dailyRevenue.length,
//       monthlyRevenue: responseData.monthlyRevenue.length,
//       categories: responseData.categoryDistribution.length,
//       orderStatus: responseData.orderStatusData.length,
//       topProducts: responseData.topProducts.length,
//       recentOrders: responseData.recentOrders.length
//     });

//     res.json(responseData);

//   } catch (err) { 
//     console.error('❌ Admin dashboard error:', err);
//     res.status(500).json({ 
//       message: err.message,
//       error: process.env.NODE_ENV === 'development' ? err.stack : undefined
//     }); 
//   }
// });

// // ==================== KEEP ALL YOUR EXISTING ROUTES BELOW ====================
// // Get all pending sellers
// router.get('/sellers/pending', async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT s.*, u.email, u.first_name, u.last_name, u.created_at as user_since 
//        FROM sellers s 
//        JOIN users u ON s.user_id = u.id 
//        WHERE s.status = ? 
//        ORDER BY s.created_at DESC`, 
//       ['pending']
//     );
//     res.json(rows);
//   } catch (err) { 
//     console.error('Pending sellers error:', err);
//     res.status(500).json({ message: err.message }); 
//   }
// });

// // Get all sellers (with filters)
// router.get('/sellers', async (req, res) => {
//   try {
//     const { status } = req.query;
//     let query = `
//       SELECT s.*, u.email, u.first_name, u.last_name, u.created_at as user_since 
//       FROM sellers s 
//       JOIN users u ON s.user_id = u.id 
//     `;
//     const params = [];
    
//     if (status) {
//       query += ' WHERE s.status = ?';
//       params.push(status);
//     }
    
//     query += ' ORDER BY s.created_at DESC';
    
//     const [rows] = await pool.query(query, params);
//     res.json(rows);
//   } catch (err) {
//     console.error('Get sellers error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Approve seller
// router.patch('/sellers/:id/approve', async (req, res) => {
//   const connection = await pool.getConnection();
//   try {
//     await connection.beginTransaction();
    
//     const [seller] = await connection.query(
//       'SELECT s.*, u.email, u.first_name FROM sellers s JOIN users u ON s.user_id = u.id WHERE s.id = ?', 
//       [req.params.id]
//     );
    
//     if (!seller.length) {
//       await connection.rollback();
//       return res.status(404).json({ message: 'Seller not found' });
//     }
    
//     await connection.query(
//       'UPDATE sellers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
//       ['approved', req.params.id]
//     );
    
//     await connection.query(
//       'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
//       ['seller', seller[0].user_id]
//     );
    
//     await connection.commit();
    
//     res.json({ 
//       success: true,
//       message: 'Seller approved successfully',
//       seller: {
//         id: seller[0].id,
//         business_name: seller[0].business_name,
//         email: seller[0].email,
//         status: 'approved'
//       }
//     });
//   } catch (err) { 
//     await connection.rollback();
//     console.error('Approve seller error:', err);
//     res.status(500).json({ message: err.message }); 
//   } finally {
//     connection.release();
//   }
// });

// // Reject seller
// router.patch('/sellers/:id/reject', async (req, res) => {
//   const connection = await pool.getConnection();
//   try {
//     await connection.beginTransaction();
    
//     const { reason } = req.body;
    
//     const [seller] = await connection.query(
//       'SELECT s.*, u.email FROM sellers s JOIN users u ON s.user_id = u.id WHERE s.id = ?', 
//       [req.params.id]
//     );
    
//     if (!seller.length) {
//       await connection.rollback();
//       return res.status(404).json({ message: 'Seller not found' });
//     }
    
//     await connection.query(
//       'UPDATE sellers SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
//       ['rejected', req.params.id]
//     );
    
//     await connection.commit();
    
//     res.json({ 
//       success: true,
//       message: 'Seller rejected',
//       seller: {
//         id: seller[0].id,
//         business_name: seller[0].business_name,
//         email: seller[0].email,
//         status: 'rejected'
//       }
//     });
//   } catch (err) { 
//     await connection.rollback();
//     console.error('Reject seller error:', err);
//     res.status(500).json({ message: err.message }); 
//   } finally {
//     connection.release();
//   }
// });

// // ==================== PRODUCT MANAGEMENT ====================

// // Get all pending products
// router.get('/products/pending', async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       `SELECT p.*, s.business_name, u.email as seller_email,
//               c.name as category_name
//        FROM products p 
//        JOIN sellers s ON p.seller_id = s.id 
//        JOIN users u ON s.user_id = u.id 
//        LEFT JOIN categories c ON p.category_id = c.id
//        WHERE p.status = ? 
//        ORDER BY p.created_at DESC`,
//       ['pending']
//     );
//     res.json(rows);
//   } catch (err) { 
//     console.error('Pending products error:', err);
//     res.status(500).json({ message: err.message }); 
//   }
// });

// // Get all products with filters (INCLUDING IMAGES)
// router.get('/products', async (req, res) => {
//   try {
//     const { status, seller_id } = req.query;
//     let query = `
//       SELECT p.*, 
//              s.business_name, 
//              u.email as seller_email,
//              c.name as category
//       FROM products p 
//       JOIN sellers s ON p.seller_id = s.id 
//       JOIN users u ON s.user_id = u.id 
//       LEFT JOIN categories c ON p.category_id = c.id
//       WHERE 1=1
//     `;
//     const params = [];
    
//     if (status) {
//       query += ' AND p.status = ?';
//       params.push(status);
//     }
    
//     if (seller_id) {
//       query += ' AND p.seller_id = ?';
//       params.push(seller_id);
//     }
    
//     query += ' ORDER BY p.created_at DESC';
    
//     const [products] = await pool.query(query, params);
    
//     // Get images for all products
//     if (products.length > 0) {
//       const productIds = products.map(p => p.id);
//       const [images] = await pool.query(
//         'SELECT product_id, image_url FROM product_images WHERE product_id IN (?) ORDER BY sort_order',
//         [productIds]
//       );
      
//       const imagesByProduct = {};
//       images.forEach(img => {
//         if (!imagesByProduct[img.product_id]) {
//           imagesByProduct[img.product_id] = [];
//         }
//         imagesByProduct[img.product_id].push(img.image_url);
//       });
      
//       const productsWithImages = products.map(product => ({
//         ...product,
//         images: imagesByProduct[product.id] || [],
//         is_featured: product.is_featured === 1 ? true : false
//       }));
      
//       res.json(productsWithImages);
//     } else {
//       res.json([]);
//     }
    
//   } catch (err) {
//     console.error('Get products error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Approve product
// router.patch('/products/:id/approve', async (req, res) => {
//   try {
//     const [result] = await pool.query(
//       'UPDATE products SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
//       ['approved', req.params.id]
//     );
    
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
    
//     const [product] = await pool.query(
//       'SELECT p.*, s.business_name FROM products p JOIN sellers s ON p.seller_id = s.id WHERE p.id = ?',
//       [req.params.id]
//     );
    
//     res.json({ 
//       success: true,
//       message: 'Product approved',
//       product: product[0]
//     });
//   } catch (err) { 
//     console.error('Approve product error:', err);
//     res.status(500).json({ message: err.message }); 
//   }
// });

// // Reject product
// router.patch('/products/:id/reject', async (req, res) => {
//   try {
//     const { reason } = req.body;
    
//     const [result] = await pool.query(
//       'UPDATE products SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
//       ['rejected', req.params.id]
//     );
    
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
    
//     res.json({ 
//       success: true,
//       message: 'Product rejected' 
//     });
//   } catch (err) { 
//     console.error('Reject product error:', err);
//     res.status(500).json({ message: err.message }); 
//   }
// });

// // Toggle featured product
// router.patch('/products/:id/feature', async (req, res) => {
//   try {
//     const { featured } = req.body;
    
//     const [result] = await pool.query(
//       'UPDATE products SET is_featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
//       [featured ? 1 : 0, req.params.id]
//     );
    
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
    
//     res.json({ 
//       success: true,
//       message: featured ? 'Product featured' : 'Product unfeatured'
//     });
//   } catch (err) { 
//     console.error('Feature product error:', err);
//     res.status(500).json({ message: err.message }); 
//   }
// });

// // ==================== CATEGORY MANAGEMENT ====================

// // Get all categories
// router.get('/categories', async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       'SELECT * FROM categories ORDER BY sort_order, name'
//     );
//     res.json(rows);
//   } catch (err) { 
//     console.error('Get categories error:', err);
//     res.status(500).json({ message: err.message }); 
//   }
// });

// // Add category
// router.post('/categories', async (req, res) => {
//   try {
//     const { name, slug, parent_id, sort_order, image } = req.body;
    
//     if (!name) {
//       return res.status(400).json({ message: 'Category name is required' });
//     }
    
//     const slugVal = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
//     const [existing] = await pool.query('SELECT id FROM categories WHERE slug = ?', [slugVal]);
//     if (existing.length) {
//       return res.status(400).json({ message: 'Category with this slug already exists' });
//     }
    
//     const [r] = await pool.query(
//       'INSERT INTO categories (name, slug, image, parent_id, sort_order) VALUES (?, ?, ?, ?, ?)', 
//       [name, slugVal, image || null, parent_id || null, sort_order || 0]
//     );
    
//     const [row] = await pool.query('SELECT * FROM categories WHERE id = ?', [r.insertId]);
    
//     res.status(201).json(row[0]);
//   } catch (err) { 
//     console.error('Add category error:', err);
//     res.status(500).json({ message: err.message }); 
//   }
// });

// // Update category
// router.patch('/categories/:id', async (req, res) => {
//   try {
//     const { name, slug, parent_id, sort_order, image } = req.body;
    
//     const [existing] = await pool.query('SELECT id FROM categories WHERE id = ?', [req.params.id]);
//     if (!existing.length) {
//       return res.status(404).json({ message: 'Category not found' });
//     }
    
//     const updates = [];
//     const params = [];
    
//     if (name) {
//       updates.push('name = ?');
//       params.push(name);
//     }
//     if (slug) {
//       const [slugCheck] = await pool.query('SELECT id FROM categories WHERE slug = ? AND id != ?', [slug, req.params.id]);
//       if (slugCheck.length) {
//         return res.status(400).json({ message: 'Category with this slug already exists' });
//       }
//       updates.push('slug = ?');
//       params.push(slug);
//     }
//     if (parent_id !== undefined) {
//       updates.push('parent_id = ?');
//       params.push(parent_id || null);
//     }
//     if (sort_order !== undefined) {
//       updates.push('sort_order = ?');
//       params.push(sort_order);
//     }
//     if (image !== undefined) {
//       updates.push('image = ?');
//       params.push(image);
//     }
    
//     updates.push('updated_at = CURRENT_TIMESTAMP');
    
//     if (updates.length) {
//       params.push(req.params.id);
//       await pool.query(
//         `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
//         params
//       );
//     }
    
//     const [row] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
//     res.json(row[0]);
//   } catch (err) {
//     console.error('Update category error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Delete category
// router.delete('/categories/:id', async (req, res) => {
//   try {
//     const [subs] = await pool.query('SELECT id FROM categories WHERE parent_id = ?', [req.params.id]);
//     if (subs.length) {
//       return res.status(400).json({ message: 'Cannot delete category with subcategories' });
//     }
    
//     const [products] = await pool.query('SELECT id FROM products WHERE category_id = ?', [req.params.id]);
//     if (products.length) {
//       return res.status(400).json({ message: 'Cannot delete category with products' });
//     }
    
//     const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Category not found' });
//     }
    
//     res.json({ success: true, message: 'Category deleted' });
//   } catch (err) {
//     console.error('Delete category error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ==================== ORDER MANAGEMENT ====================

// // Get all orders
// router.get('/orders', async (req, res) => {
//   try {
//     const { status, limit = 100 } = req.query;
//     let query = `
//       SELECT o.*, u.first_name, u.last_name, u.email 
//       FROM orders o 
//       JOIN users u ON o.user_id = u.id 
//     `;
//     const params = [];
    
//     if (status) {
//       query += ' WHERE o.status = ?';
//       params.push(status);
//     }
    
//     query += ' ORDER BY o.created_at DESC LIMIT ?';
//     params.push(parseInt(limit));
    
//     const [rows] = await pool.query(query, params);
//     res.json(rows);
//   } catch (err) { 
//     console.error('Get orders error:', err);
//     res.status(500).json({ message: err.message }); 
//   }
// });

// // Get single order details
// router.get('/orders/:id', async (req, res) => {
//   try {
//     const [orders] = await pool.query(
//       'SELECT o.*, u.first_name, u.last_name, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?',
//       [req.params.id]
//     );
    
//     if (!orders.length) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
    
//     const [items] = await pool.query(
//       'SELECT * FROM order_items WHERE order_id = ?',
//       [req.params.id]
//     );
    
//     const [address] = await pool.query(
//       'SELECT * FROM addresses WHERE id = ?',
//       [orders[0].shipping_address_id]
//     );
    
//     res.json({
//       ...orders[0],
//       items,
//       address: address[0] || null
//     });
//   } catch (err) {
//     console.error('Get order error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Update order status
// router.patch('/orders/:id/status', async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     if (!status) {
//       return res.status(400).json({ message: 'Status is required' });
//     }
    
//     const [result] = await pool.query(
//       'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//       [status, req.params.id]
//     );
    
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
    
//     res.json({ success: true, message: 'Order status updated' });
//   } catch (err) {
//     console.error('Update order error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ==================== BANNER MANAGEMENT ====================

// // Get all banners
// router.get('/banners', async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       'SELECT * FROM banners ORDER BY sort_order'
//     );
//     res.json(rows);
//   } catch (err) { 
//     console.error('Get banners error:', err);
//     res.status(500).json({ message: err.message }); 
//   }
// });

// // Add banner
// router.post('/banners', async (req, res) => {
//   try {
//     const { title, image_url, link_url, sort_order } = req.body;
    
//     if (!image_url) {
//       return res.status(400).json({ message: 'Image URL is required' });
//     }
    
//     const [r] = await pool.query(
//       'INSERT INTO banners (title, image_url, link_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?)', 
//       [title || null, image_url, link_url || null, sort_order || 0, 1]
//     );
    
//     const [row] = await pool.query('SELECT * FROM banners WHERE id = ?', [r.insertId]);
    
//     res.status(201).json(row[0]);
//   } catch (err) { 
//     console.error('Add banner error:', err);
//     res.status(500).json({ message: err.message }); 
//   }
// });

// // Update banner
// router.patch('/banners/:id', async (req, res) => {
//   try {
//     const { title, image_url, link_url, sort_order, is_active } = req.body;
    
//     const updates = [];
//     const params = [];
    
//     if (title !== undefined) {
//       updates.push('title = ?');
//       params.push(title);
//     }
//     if (image_url !== undefined) {
//       updates.push('image_url = ?');
//       params.push(image_url);
//     }
//     if (link_url !== undefined) {
//       updates.push('link_url = ?');
//       params.push(link_url);
//     }
//     if (sort_order !== undefined) {
//       updates.push('sort_order = ?');
//       params.push(sort_order);
//     }
//     if (is_active !== undefined) {
//       updates.push('is_active = ?');
//       params.push(is_active ? 1 : 0);
//     }
    
//     updates.push('updated_at = CURRENT_TIMESTAMP');
    
//     if (updates.length) {
//       params.push(req.params.id);
//       await pool.query(
//         `UPDATE banners SET ${updates.join(', ')} WHERE id = ?`,
//         params
//       );
//     }
    
//     const [row] = await pool.query('SELECT * FROM banners WHERE id = ?', [req.params.id]);
//     res.json(row[0]);
//   } catch (err) {
//     console.error('Update banner error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Delete banner
// router.delete('/banners/:id', async (req, res) => {
//   try {
//     const [result] = await pool.query('DELETE FROM banners WHERE id = ?', [req.params.id]);
    
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Banner not found' });
//     }
    
//     res.json({ success: true, message: 'Banner deleted' });
//   } catch (err) {
//     console.error('Delete banner error:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;