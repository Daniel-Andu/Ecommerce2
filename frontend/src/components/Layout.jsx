import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = location.pathname.startsWith('/admin');
  const isSeller = location.pathname.startsWith('/seller');

  const handleSearch = (e) => { e.preventDefault(); if (search.trim()) navigate('/products?search=' + encodeURIComponent(search.trim())); };
  const handleLogout = () => { logout(); navigate('/'); };

  if (isAdmin) {
    return (
      <div className="layout admin-layout">
        <aside className="sidebar admin-sidebar">
          <Link to="/" className="logo">Ecommerce</Link>
          <nav><Link to="/admin">Dashboard</Link><Link to="/admin/sellers">Sellers</Link><Link to="/admin/products">Products</Link><Link to="/">Store</Link></nav>
          <button type="button" className="logout-btn" onClick={handleLogout}>Logout</button>
        </aside>
        <main className="main-content"><Outlet /></main>
      </div>
    );
  }
  if (isSeller) {
    return (
      <div className="layout seller-layout">
        <aside className="sidebar seller-sidebar">
          <Link to="/" className="logo">Ecommerce</Link>
          <nav><Link to="/seller">Dashboard</Link><Link to="/seller/products">Products</Link><Link to="/">Store</Link></nav>
          <button type="button" className="logout-btn" onClick={handleLogout}>Logout</button>
        </aside>
        <main className="main-content"><Outlet /></main>
      </div>
    );
  }
  return (
    <div className="layout">
      <header className="header">
        <div className="container header-inner">
          <button type="button" className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">&#9776;</button>
          <Link to="/" className="logo">Ecommerce</Link>
          <form className="search-form" onSubmit={handleSearch}>
            <input type="search" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button type="submit">&#128269;</button>
          </form>
          <nav className={menuOpen ? 'open' : ''}>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            {user ? (
              <><Link to="/orders">Orders</Link>{user.role === 'seller' && <Link to="/seller">Seller</Link>}{user.role === 'admin' && <Link to="/admin">Admin</Link>}<Link to="/profile">Profile</Link><button type="button" onClick={handleLogout}>Logout</button></>
            ) : (
              <><Link to="/login">Login</Link><Link to="/register">Register</Link></>
            )}
          </nav>
        </div>
      </header>
      <main className="main"><Outlet /></main>
      <footer className="footer"><div className="container"><p>Ecommerce Marketplace</p></div></footer>
    </div>
  );
}
