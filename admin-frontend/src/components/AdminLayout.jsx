import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/sellers', label: 'Sellers', icon: '👥' },
    { path: '/admin/orders', label: 'Orders', icon: '🛍️' },
    { path: '/admin/categories', label: 'Categories', icon: '📁' },
    { path: '/admin/banners', label: 'Banners', icon: '🖼️' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' }
  ];

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link key={item.path} to={item.path} className="nav-link">
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.first_name?.charAt(0) || 'A'}
            </div>
            <div className="user-details">
              <strong>{user.first_name} {user.last_name}</strong>
              <small>{user.email}</small>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="content-header">
          <h1>{menuItems.find(item =>
            window.location.pathname.includes(item.path)
          )?.label || 'Dashboard'}</h1>
        </div>
        <div className="content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}