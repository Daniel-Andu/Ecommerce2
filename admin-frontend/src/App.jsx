import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductManagement from './pages/productManagement';
import SellerManagement from './pages/SellerManagement';
import OrderManagement from './pages/OrderManagement';
import CategoryManagement from './pages/CategoryManagement';
import BannerManagement from './pages/BannerManagement';
import AdminLayout from './components/AdminLayout';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="sellers" element={<SellerManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="banners" element={<BannerManagement />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;