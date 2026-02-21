// src/components/Layout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/products', icon: '📦', label: 'Products' },
    { path: '/orders', icon: '🛒', label: 'Orders' },
    { path: '/sellers', icon: '👥', label: 'Sellers' },
    { path: '/categories', icon: '📑', label: 'Categories' },
    { path: '/banners', icon: '🖼️', label: 'Banners' },
    { path: '/users', icon: '👤', label: 'Users' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-btn">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-avatar">👤</span>
            {sidebarOpen && (
              <div className="user-details">
                <p className="user-name">{user?.name || 'Admin User'}</p>
                <p className="user-email">{user?.email}</p>
              </div>
            )}
          </div>
          <button onClick={logout} className="logout-btn">
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <h1>{menuItems.find(item => location.pathname === item.path)?.label || 'Dashboard'}</h1>
        </header>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;