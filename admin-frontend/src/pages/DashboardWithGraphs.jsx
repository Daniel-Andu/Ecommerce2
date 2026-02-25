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
        monthlyData: [],
        categoryDistribution: [],
        orderStatusData: [],
        revenueChange: 0
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month');

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6384', '#36A2EB'];

    useEffect(() => {
        loadDashboard();
    }, [timeRange]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/dashboard?range=${timeRange}`);
            console.log('✅ Dashboard data received:', response.data);

            setStats({
                totalUsers: response.data.totalUsers || 0,
                totalSellers: response.data.totalSellers || 0,
                pendingSellers: response.data.pendingSellers || 0,
                totalProducts: response.data.totalProducts || 0,
                pendingProducts: response.data.pendingProducts || 0,
                totalOrders: response.data.totalOrders || 0,
                totalRevenue: response.data.totalRevenue || 0,
                recentOrders: response.data.recentOrders || [],
                monthlyData: response.data.monthlyData || response.data.dailyRevenue || [],
                categoryDistribution: response.data.categoryDistribution || [],
                orderStatusData: response.data.orderStatusData || [],
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
                <div className="dashboard-header-left">
                    <h1 className="dashboard-title">Admin Dashboard</h1>
                    <button
                        className="btn-refresh-dashboard"
                        onClick={loadDashboard}
                        disabled={loading}
                    >
                        🔄 Refresh
                    </button>
                </div>
                <div className="time-range-selector">
                    <button
                        className={timeRange === 'week' ? 'active' : ''}
                        onClick={() => setTimeRange('week')}
                    >
                        Week
                    </button>
                    <button
                        className={timeRange === 'month' ? 'active' : ''}
                        onClick={() => setTimeRange('month')}
                    >
                        Month
                    </button>
                    <button
                        className={timeRange === 'year' ? 'active' : ''}
                        onClick={() => setTimeRange('year')}
                    >
                        Year
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {/* Total Revenue Card */}
                <div className="stat-card featured">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <span className="stat-label">Total Revenue</span>
                        <h2 className="stat-number large">ETB {formatRevenue(stats.totalRevenue)}</h2>
                        <span className={`stat-trend ${stats.revenueChange >= 0 ? 'positive' : 'negative'}`}>
                            {stats.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueChange)}% from previous period
                        </span>
                    </div>
                </div>

                {/* Total Orders */}
                <div className="stat-card">
                    <div className="stat-icon">🛍️</div>
                    <div className="stat-content">
                        <span className="stat-label">Total Orders</span>
                        <h2 className="stat-number">{stats.totalOrders}</h2>
                        <Link to="/admin/orders" className="stat-link">View Details →</Link>
                    </div>
                </div>

                {/* Total Users */}
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <span className="stat-label">Total Users</span>
                        <h2 className="stat-number">{stats.totalUsers}</h2>
                        <span className="stat-label">Registered customers</span>
                    </div>
                </div>

                {/* Total Sellers */}
                <div className="stat-card">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-content">
                        <span className="stat-label">Total Sellers</span>
                        <h2 className="stat-number">{stats.totalSellers}</h2>
                        <Link to="/admin/sellers" className="stat-link">Manage Sellers →</Link>
                    </div>
                </div>

                {/* Pending Sellers */}
                <div className="stat-card warning">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <span className="stat-label">Pending Sellers</span>
                        <h2 className="stat-number">{stats.pendingSellers}</h2>
                        <Link to="/admin/sellers?status=pending" className="stat-link">Review →</Link>
                    </div>
                </div>

                {/* Total Products */}
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                        <span className="stat-label">Total Products</span>
                        <h2 className="stat-number">{stats.totalProducts}</h2>
                        <Link to="/admin/products" className="stat-link">Manage Products →</Link>
                    </div>
                </div>

                {/* Pending Products */}
                <div className="stat-card warning">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <span className="stat-label">Pending Products</span>
                        <h2 className="stat-number">{stats.pendingProducts}</h2>
                        <Link to="/admin/products?status=pending" className="stat-link">Review →</Link>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                {/* Revenue Trend Chart */}
                <div className="chart-card">
                    <h3>Revenue Trend ({timeRange === 'week' ? 'Last 7 Days' : timeRange === 'month' ? 'This Month' : 'This Year'})</h3>
                    {stats.monthlyData && stats.monthlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={stats.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `ETB ${value}`} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    fillOpacity={0.3}
                                    name="Revenue"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no-chart-data">
                            No revenue data available
                            <br />
                            <small>(Create some orders to see data)</small>
                        </div>
                    )}
                </div>

                {/* Orders & Products Comparison */}
                <div className="chart-card">
                    <h3>Orders vs Products Sold</h3>
                    {stats.monthlyData && stats.monthlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                                <Bar dataKey="products" fill="#82ca9d" name="Products Sold" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no-chart-data">
                            No order data available
                            <br />
                            <small>(Create some orders to see data)</small>
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
                            No category data available
                            <br />
                            <small>(Add products to categories)</small>
                        </div>
                    )}
                </div>

                {/* Order Status Distribution */}
                <div className="chart-card">
                    <h3>Order Status Distribution</h3>
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
                            No order status data available
                            <br />
                            <small>(Create orders to see status distribution)</small>
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

            {/* Recent Orders Table */}
            <div className="recent-orders">
                <h2>Recent Orders</h2>
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
                                    <td>#{order.order_number || order.id}</td>
                                    <td>{order.customerName || 'Guest'}</td>
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
                    <div className="no-data">No recent orders</div>
                )}
            </div>
        </div>
    );
}
