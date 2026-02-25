import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Reports.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function Reports() {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month'); // week, month, year
    const [salesData, setSalesData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [sellerData, setSellerData] = useState([]);
    const [summary, setSummary] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0
    });

    useEffect(() => {
        loadReports();
    }, [timeRange]);

    const loadReports = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken'); // Fixed: use adminToken

            // Load sales report
            const salesRes = await fetch(`${API_URL}/reports/admin/sales?period=${timeRange}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const salesJson = await salesRes.json();
            setSalesData(salesJson || []);

            // Calculate summary from sales data
            const totalRevenue = salesJson.reduce((sum, item) => sum + parseFloat(item.total_sales || 0), 0);
            const totalOrders = salesJson.reduce((sum, item) => sum + parseInt(item.order_count || 0), 0);
            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            setSummary({
                totalSales: salesJson.length,
                totalOrders: totalOrders,
                totalRevenue: totalRevenue,
                avgOrderValue: avgOrderValue
            });

            // Load product performance
            const productRes = await fetch(`${API_URL}/reports/admin/products`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const productJson = await productRes.json();
            setProductData(productJson.slice(0, 10) || []);

            // Load seller performance (using admin dashboard endpoint)
            const sellerRes = await fetch(`${API_URL}/admin/sellers?status=approved`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const sellerJson = await sellerRes.json();
            setSellerData(sellerJson.slice(0, 10) || []);

        } catch (error) {
            console.error('Load reports error:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportReport = (type) => {
        // TODO: Implement export functionality
        alert(`Exporting ${type} report...`);
    };

    const COLORS = ['#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

    if (loading) {
        return (
            <div className="reports-loading">
                <div className="spinner"></div>
                <p>Loading reports...</p>
            </div>
        );
    }

    return (
        <div className="reports-page">
            <div className="reports-header">
                <div>
                    <h1>📊 Reports & Analytics</h1>
                    <p>Comprehensive business insights and performance metrics</p>
                </div>

                <div className="header-actions">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="time-range-select"
                    >
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="year">Last 12 Months</option>
                    </select>

                    <button onClick={() => exportReport('pdf')} className="btn-export">
                        📄 Export PDF
                    </button>
                    <button onClick={() => exportReport('excel')} className="btn-export">
                        📊 Export Excel
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="summary-card revenue">
                    <div className="card-icon">💰</div>
                    <div className="card-content">
                        <h3>Total Revenue</h3>
                        <p className="amount">ETB {summary.totalRevenue?.toFixed(2) || '0.00'}</p>
                        <span className="trend up">↑ 12.5%</span>
                    </div>
                </div>

                <div className="summary-card orders">
                    <div className="card-icon">📦</div>
                    <div className="card-content">
                        <h3>Total Orders</h3>
                        <p className="amount">{summary.totalOrders || 0}</p>
                        <span className="trend up">↑ 8.3%</span>
                    </div>
                </div>

                <div className="summary-card sales">
                    <div className="card-icon">🛍️</div>
                    <div className="card-content">
                        <h3>Total Sales</h3>
                        <p className="amount">{summary.totalSales || 0}</p>
                        <span className="trend up">↑ 15.2%</span>
                    </div>
                </div>

                <div className="summary-card avg-order">
                    <div className="card-icon">📈</div>
                    <div className="card-content">
                        <h3>Avg Order Value</h3>
                        <p className="amount">ETB {summary.avgOrderValue?.toFixed(2) || '0.00'}</p>
                        <span className="trend down">↓ 2.1%</span>
                    </div>
                </div>
            </div>

            {/* Sales Trend Chart */}
            <div className="chart-container">
                <div className="chart-header">
                    <h2>📈 Sales Trend</h2>
                    <p>Revenue over time</p>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                            contentStyle={{
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={{ fill: '#6366f1', r: 5 }}
                            activeDot={{ r: 7 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#ec4899"
                            strokeWidth={3}
                            dot={{ fill: '#ec4899', r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="charts-grid">
                {/* Top Products Chart */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h2>🏆 Top Products</h2>
                        <p>Best performing products</p>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={productData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="sales" fill="#6366f1" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="revenue" fill="#ec4899" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Sellers Chart */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h2>👥 Top Sellers</h2>
                        <p>Best performing sellers</p>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={sellerData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="revenue"
                            >
                                {sellerData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Tables */}
            <div className="tables-grid">
                {/* Product Performance Table */}
                <div className="table-container">
                    <div className="table-header">
                        <h2>📦 Product Performance</h2>
                        <button onClick={() => exportReport('products')} className="btn-export-small">
                            Export
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Sales</th>
                                    <th>Revenue</th>
                                    <th>Avg Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productData.map((product, index) => (
                                    <tr key={index}>
                                        <td className="product-name">{product.name}</td>
                                        <td>{product.sales}</td>
                                        <td className="revenue">ETB {product.revenue?.toFixed(2)}</td>
                                        <td>ETB {product.avg_price?.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Seller Performance Table */}
                <div className="table-container">
                    <div className="table-header">
                        <h2>👤 Seller Performance</h2>
                        <button onClick={() => exportReport('sellers')} className="btn-export-small">
                            Export
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Seller</th>
                                    <th>Orders</th>
                                    <th>Revenue</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sellerData.map((seller, index) => (
                                    <tr key={index}>
                                        <td className="seller-name">{seller.name}</td>
                                        <td>{seller.orders}</td>
                                        <td className="revenue">ETB {seller.revenue?.toFixed(2)}</td>
                                        <td>
                                            <span className="rating">
                                                ⭐ {seller.rating?.toFixed(1) || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
