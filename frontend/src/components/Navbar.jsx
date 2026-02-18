

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { cart as cartApi } from '../api';
// import './Navbar.css';

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [cartCount, setCartCount] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const loadCartCount = async () => {
//       try {
//         const cart = await cartApi.get();
//         setCartCount(cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
//       } catch (error) {
//         console.error('Failed to load cart count:', error);
//       }
//     };
    
//     loadCartCount();
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchQuery('');
//       setMobileMenuOpen(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <nav className="navbar">
//       <div className="container navbar-container">
//         <Link to="/" className="navbar-brand">
//           <span className="brand-name">Marketplace</span>
//         </Link>

//         <form onSubmit={handleSearch} className="search-form">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="search-input"
//           />
//           <button type="submit" className="search-btn">🔍</button>
//         </form>

//         <button 
//           className="mobile-menu-btn"
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//         >
//           ☰
//         </button>

//         <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
//           <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link>
          
//           <Link to="/cart" className="cart-link" onClick={() => setMobileMenuOpen(false)}>
//             Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
//           </Link>
          
//           {user ? (
//             <div className="user-menu">
//               <button className="user-menu-btn">
//                 {user.first_name} ▼
//               </button>
//               <div className="dropdown-menu">
//                 <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
//                 <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
//                 <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
                
//                 {user.role === 'seller' && (
//                   <>
//                     <div className="dropdown-divider"></div>
//                     <Link to="/seller" onClick={() => setMobileMenuOpen(false)}>Seller Dashboard</Link>
//                     <Link to="/seller/products" onClick={() => setMobileMenuOpen(false)}>My Products</Link>
//                   </>
//                 )}
                
//                 {user.role === 'admin' && (
//                   <>
//                     <div className="dropdown-divider"></div>
//                     <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
//                     <Link to="/admin/sellers" onClick={() => setMobileMenuOpen(false)}>Manage Sellers</Link>
//                     <Link to="/admin/products" onClick={() => setMobileMenuOpen(false)}>Manage Products</Link>
//                   </>
//                 )}
                
//                 <div className="dropdown-divider"></div>
//                 <button onClick={handleLogout} className="logout-btn">Logout</button>
//               </div>
//             </div>
//           ) : (
//             <>
//               <Link to="/login" className="btn btn-outline" onClick={() => setMobileMenuOpen(false)}>Login</Link>
//               <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Register</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cart as cartApi } from '../api';
import { getImageUrl, handleImageError, avatarPlaceholder } from '../utils/imageUtils';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await cartApi.get();
        setCartCount(data.items?.reduce((sum, i) => sum + i.quantity, 0) || 0);
      } catch (error) {
        console.error('Cart error:', error);
      }
    };
    loadCart();

    const handleCartUpdate = () => loadCart();
    window.addEventListener('cart-updated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu') && !e.target.closest('.dropdown')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7L12 3L20 7L12 11L4 7Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="white" fillOpacity="0.9"/>
                <path d="M4 12L12 16L20 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M4 17L12 21L20 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <circle cx="12" cy="7" r="2" fill="white"/>
              </svg>
            </div>
            <span className="brand-name">Marketplace</span>
          </div>
        </Link>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          
          <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          {/* User Menu - Logged In */}
          {user ? (
            <div className="user-menu">
              <div className="user-info" onClick={toggleUserMenu}>
                {user.profile_image ? (
                  <img 
                    src={getImageUrl(user.profile_image)} 
                    alt={user.first_name} 
                    className="user-avatar"
                    onError={(e) => handleImageError(e, avatarPlaceholder)}
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </div>
                )}
                <span className="user-name">{user.first_name}</span>
                <span className="dropdown-arrow">{userMenuOpen ? '▲' : '▼'}</span>
              </div>
              
              {/* Dropdown Menu */}
              <div className={`dropdown ${userMenuOpen ? 'active' : ''}`}>
                <Link to="/profile" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }}>
                  <span className="dropdown-icon">👤</span> Profile
                </Link>
                <Link to="/orders" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }}>
                  <span className="dropdown-icon">📦</span> Orders
                </Link>
                <Link to="/wishlist" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }}>
                  <span className="dropdown-icon">❤️</span> Wishlist
                </Link>
                
                {/* Seller Links - Only for sellers */}
                {user.role === 'seller' && (
                  <>
                    <div className="dropdown-divider"></div>
                    <Link to="/seller" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }}>
                      <span className="dropdown-icon">📊</span> Seller Dashboard
                    </Link>
                    <Link to="/seller/products" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }}>
                      <span className="dropdown-icon">📦</span> My Products
                    </Link>
                    <Link to="/seller/orders" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }}>
                      <span className="dropdown-icon">📋</span> My Orders
                    </Link>
                  </>
                )}
                
                {/* Admin Links - Only for admins */}
                {user.role === 'admin' && (
                  <>
                    <div className="dropdown-divider"></div>
                    <Link to="/admin" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }}>
                      <span className="dropdown-icon">⚙️</span> Admin Dashboard
                    </Link>
                    <Link to="/admin/sellers" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }}>
                      <span className="dropdown-icon">👥</span> Manage Sellers
                    </Link>
                    <Link to="/admin/products" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }}>
                      <span className="dropdown-icon">📦</span> Manage Products
                    </Link>
                    <Link to="/admin/categories" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }}>
                      <span className="dropdown-icon">📁</span> Categories
                    </Link>
                    <Link to="/admin/banners" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }}>
                      <span className="dropdown-icon">🖼️</span> Banners
                    </Link>
                    <Link to="/admin/orders" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }}>
                      <span className="dropdown-icon">📋</span> All Orders
                    </Link>
                  </>
                )}
                
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="logout-btn">
                  <span className="dropdown-icon">🚪</span> Logout
                </button>
              </div>
            </div>
          ) : (
            /* Auth Buttons - Not Logged In */
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}


