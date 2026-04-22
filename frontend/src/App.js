import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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

// Ye component navbar hide karne ka logic handle karta hai
function AppContent({ role, setRole }) {
  const location = useLocation();
  
  // Agar path '/admin' se shuru ho raha hai, to iska matlab admin panel khula hai
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Navbar sirf tab dikhegi jab user admin na ho AUR URL admin wala na ho */}
      {!isAdminPath && (role === null || role === "customer") && (
        <CustomerNavbar role={role} />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />

        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/bookings" element={<MyBookings />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/services/:serviceName" element={<ServiceDetails />} />
        <Route path="/book/:serviceName/:providerId" element={<BookingPage />} />

        {/* Provider Routes */}
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/provider/requests" element={<BookingRequests />} />
        <Route path="/provider/history" element={<ProviderBookingHistory />} />
        <Route path="/provider/profile" element={<ProviderProfile />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/providers" element={<AdminProviders />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/areas" element={<AdminAreas />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/reports" element={<AdminReports />} />
      </Routes>
    </>
  );
}

function App() {
  const [role, setRole] = useState(null); // null / "customer" / "provider" / "admin"

  return (
    <Router>
      <AppContent role={role} setRole={setRole} />
    </Router>
  );
}

export default App;