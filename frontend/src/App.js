// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Pages
import Hero from './pages/Hero';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';

// Customer Pages
import CustomerDashboard from './pages/Customer/Dashboard';
import MyBookings from './pages/Customer/MyBookings';
import CustomerProfile from './pages/Customer/Profile';
import ServiceDetails from './pages/Customer/servicedetails';
import BookingPage from './pages/Customer/bookingpage';

// Provider Pages
import ProviderDashboard from './pages/Provider/Dashboard';
import BookingRequests from './pages/Provider/BookingRequests';
import ProviderBookingHistory from './pages/Provider/BookingHistory';
import ProviderProfile from './pages/Provider/Profile';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminProviders from './pages/Admin/Providers';
import AdminCategories from './pages/Admin/Categories';
import AdminAreas from './pages/Admin/Areas';
import AdminBookings from './pages/Admin/Bookings';
import AdminTransactions from './pages/Admin/Transactions';
import AdminReports from './pages/Admin/Reports';

// Components
import CustomerNavbar from './components/CustomerNavbar';
import API from './api/api';

// ─── Protected Route ──────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user  = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent({ role, setRole }) {
  const location = useLocation();
  const isAdminPath    = location.pathname.startsWith('/admin');
  const isProviderPath = location.pathname.startsWith('/provider');

  return (
    <>
      {!isAdminPath && !isProviderPath && (
        <CustomerNavbar role={role} setRole={setRole} />
      )}

      <Routes>
        {/* ── Public Routes ───────────────────── */}
        <Route path="/"         element={<Hero />} />
        <Route path="/login"    element={<Login setRole={setRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceName" element={<ServiceDetails />} />

        {/* ── Customer Routes ─────────────────── */}
        <Route path="/customer/dashboard" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/customer/bookings" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MyBookings />
          </ProtectedRoute>
        } />
        <Route path="/customer/profile" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerProfile />
          </ProtectedRoute>
        } />
        <Route path="/book/:serviceName/:providerId" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <BookingPage />
          </ProtectedRoute>
        } />

        {/* ── Provider Routes ─────────────────── */}
        <Route path="/provider/dashboard" element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderDashboard />
          </ProtectedRoute>
        } />
        <Route path="/provider/requests" element={
          <ProtectedRoute allowedRoles={['provider']}>
            <BookingRequests />
          </ProtectedRoute>
        } />
        <Route path="/provider/history" element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderBookingHistory />
          </ProtectedRoute>
        } />
        <Route path="/provider/profile" element={
          <ProtectedRoute allowedRoles={['provider']}>
            <ProviderProfile />
          </ProtectedRoute>
        } />

        {/* ── Admin Routes ─────────────────────── */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/providers" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminProviders />
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCategories />
          </ProtectedRoute>
        } />
        <Route path="/admin/areas" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAreas />
          </ProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminBookings />
          </ProtectedRoute>
        } />
        <Route path="/admin/transactions" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminTransactions />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReports />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  // Read role from localStorage on first render
  const [role, setRole] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.role || null;
  });

  // ── On startup: validate stored token against the backend ────
  // If the token is expired/invalid the server returns 401 which
  // the API interceptor handles (clears localStorage + redirects).
  // Here we just sync the role state to reflect a cleared token.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setRole(null);
      return;
    }

    API.get('/auth/me')
      .then(({ data }) => {
        // Token valid — keep role in sync (handles stale role mismatches)
        setRole(data.user.role);
      })
      .catch(() => {
        // 401 or network error — interceptor already cleared localStorage
        setRole(null);
      });
  }, []); // runs once on app mount

  return (
    <Router>
      <AppContent role={role} setRole={setRole} />
    </Router>
  );
}

export default App;
