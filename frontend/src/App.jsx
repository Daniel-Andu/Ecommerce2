import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSeller from './pages/RegisterSeller';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// Protected Pages
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import OrderConfirmation from './pages/OrderConfirmation';
import NotificationsCenter from './pages/NotificationsCenter';
import MyReturns from './pages/MyReturns';
import AdvancedSearch from './pages/AdvancedSearch';

// Seller Pages
import SellerDashboard from './pages/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SellerPending from './pages/SellerPending';
import AddProduct from './pages/seller/AddProduct';
import EditProduct from './pages/seller/EditProduct';
import SellerEarnings from './pages/seller/SellerEarnings';
import SellerWallet from './pages/SellerWallet';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSellers from './pages/admin/AdminSellers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBanners from './pages/admin/AdminBanners';
import AdminOrders from './pages/admin/AdminOrders';

// Payment Pages
import PaymentResult from './pages/PaymentResult';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" /> 
        Loading...
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && !requiredRole.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Seller Route Component with Pending Check
const SellerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" /> 
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user has seller role or is admin
  if (user.role !== 'seller' && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // If user is seller and status is pending, show pending page
  if (user.role === 'seller' && user.seller_status === 'pending') {
    return <SellerPending />;
  }

  // If user is admin or approved seller, show the requested page
  return children;
};

function AppContent() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:idOrSlug" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/seller" element={<RegisterSeller />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* Protected Routes - Customer */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <ErrorBoundary fallbackType="network">
                <Checkout />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Profile />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <MyOrders />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <OrderDetail />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Wishlist />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <NotificationsCenter />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          <Route path="/returns" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <MyReturns />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={
            <ErrorBoundary>
              <AdvancedSearch />
            </ErrorBoundary>
          } />
          
        {/* Order Confirmation Route - PUBLIC ACCESS (no login required) */}
         <Route path="/order-confirmation/:id" element={
          <ErrorBoundary>
         <OrderConfirmation />
          </ErrorBoundary>
} />
          
          {/* Payment Result Route */}
          <Route path="/payment-result" element={<PaymentResult />} />
          
          {/* Seller Pending Route - Accessible for pending sellers */}
          <Route path="/seller/pending" element={
            <ProtectedRoute requiredRole={['seller', 'admin']}>
              <ErrorBoundary>
                <SellerPending />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* Seller Routes - All protected by SellerRoute and ErrorBoundary */}
          <Route path="/seller" element={
            <SellerRoute>
              <ErrorBoundary>
                <SellerDashboard />
              </ErrorBoundary>
            </SellerRoute>
          } />
          <Route path="/seller/dashboard" element={
            <SellerRoute>
              <ErrorBoundary>
                <SellerDashboard />
              </ErrorBoundary>
            </SellerRoute>
          } />
          
          {/* Seller Products Routes */}
          <Route path="/seller/products" element={
            <SellerRoute>
              <ErrorBoundary>
                <SellerProducts />
              </ErrorBoundary>
            </SellerRoute>
          } />
          <Route path="/seller/products/add" element={
            <SellerRoute>
              <ErrorBoundary>
                <AddProduct />
              </ErrorBoundary>
            </SellerRoute>
          } />
          <Route path="/seller/products/edit/:id" element={
            <SellerRoute>
              <ErrorBoundary>
                <EditProduct />
              </ErrorBoundary>
            </SellerRoute>
          } />
          
          {/* Seller Orders Routes */}
          <Route path="/seller/orders" element={
            <SellerRoute>
              <ErrorBoundary>
                <SellerOrders />
              </ErrorBoundary>
            </SellerRoute>
          } />
          <Route path="/seller/orders/:id" element={
            <SellerRoute>
              <ErrorBoundary>
                <div className="coming-soon">Order Details Page - Coming Soon</div>
              </ErrorBoundary>
            </SellerRoute>
          } />
          
          {/* Seller Earnings Routes */}
          <Route path="/seller/earnings" element={
            <SellerRoute>
              <ErrorBoundary>
                <SellerEarnings />
              </ErrorBoundary>
            </SellerRoute>
          } />
          <Route path="/seller/wallet" element={
            <SellerRoute>
              <ErrorBoundary>
                <SellerWallet />
              </ErrorBoundary>
            </SellerRoute>
          } />
          <Route path="/seller/earnings/withdraw" element={
            <SellerRoute>
              <ErrorBoundary>
                <SellerWallet />
              </ErrorBoundary>
            </SellerRoute>
          } />
          
          {/* Seller Profile Route */}
          <Route path="/seller/profile" element={
            <SellerRoute>
              <ErrorBoundary>
                <Profile />
              </ErrorBoundary>
            </SellerRoute>
          } />
          <Route path="/seller/profile/edit" element={
            <SellerRoute>
              <ErrorBoundary>
                <div className="coming-soon">Edit Profile - Coming Soon</div>
              </ErrorBoundary>
            </SellerRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole={['admin']}>
              <ErrorBoundary fallbackType="auth">
                <AdminDashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole={['admin']}>
              <ErrorBoundary>
                <AdminDashboard />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/admin/sellers" element={
            <ProtectedRoute requiredRole={['admin']}>
              <ErrorBoundary>
                <AdminSellers />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute requiredRole={['admin']}>
              <ErrorBoundary>
                <AdminProducts />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute requiredRole={['admin']}>
              <ErrorBoundary>
                <AdminCategories />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/admin/banners" element={
            <ProtectedRoute requiredRole={['admin']}>
              <ErrorBoundary>
                <AdminBanners />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute requiredRole={['admin']}>
              <ErrorBoundary>
                <AdminOrders />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          
          {/* 404 - Page Not Found */}
          <Route path="*" element={
            <ErrorBoundary fallbackType="notFound">
              <div className="container not-found">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            </ErrorBoundary>
          } />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary fallbackType="default">
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;




// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider, useAuth } from './context/AuthContext';

// // Components
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import ErrorBoundary from './components/ErrorBoundary';

// // Public Pages
// import Home from './pages/Home';
// import Products from './pages/Products';
// import ProductDetail from './pages/ProductDetail';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import RegisterSeller from './pages/RegisterSeller';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';

// // Protected Pages
// import Profile from './pages/Profile';
// import MyOrders from './pages/MyOrders';
// import OrderDetail from './pages/OrderDetail';
// import Wishlist from './pages/Wishlist';
// import OrderConfirmation from './pages/OrderConfirmation';

// // Seller Pages
// import SellerDashboard from './pages/SellerDashboard';
// import SellerProducts from './pages/seller/SellerProducts';
// import SellerOrders from './pages/seller/SellerOrders';
// import SellerPending from './pages/SellerPending';
// import AddProduct from './pages/seller/AddProduct';
// import EditProduct from './pages/seller/EditProduct';
// import SellerEarnings from './pages/seller/SellerEarnings';

// // Admin Pages
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminSellers from './pages/admin/AdminSellers';
// import AdminProducts from './pages/admin/AdminProducts';
// import AdminCategories from './pages/admin/AdminCategories';
// import AdminBanners from './pages/admin/AdminBanners';
// import AdminOrders from './pages/admin/AdminOrders';
// import PaymentResult from './pages/PaymentResult';

// // Protected Route Component
// const ProtectedRoute = ({ children, requiredRole }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return (
//       <div className="page-loading">
//         <div className="spinner" /> 
//         Loading...
//       </div>
//     );
//   }
  
//   if (!user) {
//     return <Navigate to="/login" />;
//   }
  
//   if (requiredRole && !requiredRole.includes(user.role)) {
//     return <Navigate to="/" />;
//   }
  
//   return children;
// };

// // Seller Route Component with Pending Check
// const SellerRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="page-loading">
//         <div className="spinner" /> 
//         Loading...
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   // Check if user has seller role or is admin
//   if (user.role !== 'seller' && user.role !== 'admin') {
//     return <Navigate to="/" />;
//   }

//   // If user is seller and status is pending, show pending page
//   if (user.role === 'seller' && user.seller_status === 'pending') {
//     return <SellerPending />;
//   }

//   // If user is admin or approved seller, show the requested page
//   return children;
// };

// function AppContent() {
//   return (
//     <div className="app">
//       <Navbar />
//       <main className="main-content">
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/products" element={<Products />} />
//           <Route path="/products/:idOrSlug" element={<ProductDetail />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/register/seller" element={<RegisterSeller />} />
//           <Route path="/cart" element={<Cart />} />
          
//           {/* Protected Routes - Customer */}
//           <Route path="/checkout" element={
//             <ProtectedRoute>
//               <ErrorBoundary fallbackType="network">
//                 <Checkout />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           } />
//           <Route path="/profile" element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <Profile />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           } />
//           <Route path="/orders" element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <MyOrders />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           } />
//           <Route path="/orders/:id" element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <OrderDetail />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           } />
//           <Route path="/wishlist" element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <Wishlist />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           } />
          
//           {/* Order Confirmation Route */}
//           <Route path="/order-confirmation/:id" element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <OrderConfirmation />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           } />
          
//           {/* Seller Routes - All protected by SellerRoute and ErrorBoundary */}
//           <Route path="/seller" element={
//             <SellerRoute>
//               <ErrorBoundary>
//                 <SellerDashboard />
//               </ErrorBoundary>
//             </SellerRoute>
//           } />
//           <Route path="/seller/dashboard" element={
//             <SellerRoute>
//               <ErrorBoundary>
//                 <SellerDashboard />
//               </ErrorBoundary>
//             </SellerRoute>
//           } />
          
//           {/* Seller Products Routes */}
//           <Route path="/seller/products" element={
//             <SellerRoute>
//               <ErrorBoundary>
//                 <SellerProducts />
//               </ErrorBoundary>
//             </SellerRoute>
//           } />
//           <Route path="/seller/products/add" element={
//             <SellerRoute>
//               <ErrorBoundary>
//                 <AddProduct />
//               </ErrorBoundary>
//             </SellerRoute>
//           } />
//           <Route path="/seller/products/edit/:id" element={
//             <SellerRoute>
//               <ErrorBoundary>
//                 <EditProduct />
//               </ErrorBoundary>
//             </SellerRoute>
//           } />
          
//           {/* Seller Orders Routes */}
//           <Route path="/seller/orders" element={
//             <SellerRoute>
//               <ErrorBoundary>
//                 <SellerOrders />
//               </ErrorBoundary>
//             </SellerRoute>
//           } />
//           <Route path="/seller/orders/:id" element={
//             <SellerRoute>
//               <ErrorBoundary>
//                 <div className="coming-soon">Order Details Page - Coming Soon</div>
//               </ErrorBoundary>
//             </SellerRoute>
//           } />
          
//           {/* Seller Earnings Routes */}
//           <Route path="/seller/earnings" element={
//             <SellerRoute>
//               <ErrorBoundary>
//                 <SellerEarnings />
//               </ErrorBoundary>
//             </SellerRoute>
//           } />
//           <Route path="/seller/earnings/withdraw" element={
//             <SellerRoute>
//               <ErrorBoundary>
//                 <div className="coming-soon">Withdraw Earnings - Coming Soon</div>
//               </ErrorBoundary>
//             </SellerRoute>
//           } />
          
//           {/* Seller Profile Route */}
//           <Route path="/seller/profile" element={
//             <SellerRoute>
//               <ErrorBoundary>
//                 <Profile />
//               </ErrorBoundary>
//             </SellerRoute>
//           } />
//           <Route path="/seller/profile/edit" element={
//             <SellerRoute>
//               <ErrorBoundary>
//                 <div className="coming-soon">Edit Profile - Coming Soon</div>
//               </ErrorBoundary>
//             </SellerRoute>
//           } />
          
//           {/* Admin Routes */}
//           <Route path="/admin" element={
//             <ProtectedRoute requiredRole={['admin']}>
//               <ErrorBoundary fallbackType="auth">
//                 <AdminDashboard />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           } />
//           <Route path="/admin/dashboard" element={
//             <ProtectedRoute requiredRole={['admin']}>
//               <ErrorBoundary>
//                 <AdminDashboard />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           } />
//           <Route path="/admin/sellers" element={
//             <ProtectedRoute requiredRole={['admin']}>
//               <ErrorBoundary>
//                 <AdminSellers />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           } />
//           <Route path="/admin/products" element={
//             <ProtectedRoute requiredRole={['admin']}>
//               <ErrorBoundary>
//                 <AdminProducts />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           } />
//           <Route path="/admin/categories" element={
//             <ProtectedRoute requiredRole={['admin']}>
//               <ErrorBoundary>
//                 <AdminCategories />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           } />
//           <Route path="/admin/banners" element={
//             <ProtectedRoute requiredRole={['admin']}>
//               <ErrorBoundary>
//                 <AdminBanners />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           } />
//           <Route path="/admin/orders" element={
//             <ProtectedRoute requiredRole={['admin']}>
//               <ErrorBoundary>
//                 <AdminOrders />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           } />
          
//           {/* 404 - Page Not Found */}
//           <Route path="*" element={
//             <ErrorBoundary fallbackType="notFound">
//               <div className="container not-found">
//                 <h1>404 - Page Not Found</h1>
//                 <p>The page you're looking for doesn't exist.</p>
//                 <a href="/" className="btn btn-primary">Go Home</a>
//               </div>
//             </ErrorBoundary>
//           } />
//         </Routes>
//       </main>
//       <Footer />
//       <Toaster position="top-right" />
//     </div>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <ErrorBoundary fallbackType="default">
//         <AppContent />
//       </ErrorBoundary>
//     </AuthProvider>
//   );
// }

// export default App;