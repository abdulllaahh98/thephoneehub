import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WarrantyPage from './pages/WarrantyPage';
import SupportPage from './pages/SupportPage';
import ContactPage from './pages/ContactPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminClaims from './pages/admin/AdminClaims';
import ProtectedRoute from './components/auth/ProtectedRoute';

import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" reverseOrder={false} />
      <HelmetProvider>
        <Router>
          <Routes>
            {/* Public/User Routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/products" element={<Layout><CatalogPage /></Layout>} />
            <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
            <Route path="/account" element={<Layout><AccountPage /></Layout>} />
            <Route path="/orders" element={<Layout><OrdersPage /></Layout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/orders/:id" element={<Layout><OrderDetailPage /></Layout>} />
            <Route path="/warranty/:orderId" element={<Layout><WarrantyPage /></Layout>} />
            <Route path="/support" element={<Layout><SupportPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/track-order" element={<Layout><TrackOrderPage /></Layout>} />

            {/* Admin Routes - Open access (User Request) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="order/:id" element={<AdminOrderDetail />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="warranty-claims" element={<AdminClaims />} />
            </Route>
          </Routes>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
