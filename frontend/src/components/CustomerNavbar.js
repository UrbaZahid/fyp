import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './customernavbar.css';

const CustomerNavbar = ({ role, setRole }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  // Treat any non-customer role (provider, admin, null, undefined) as public.
  // Provider and admin have their own sidebars — this navbar should never
  // show their role-specific links. It only has two modes:
  //   1. Public  — visitor / logged-out / wrong role
  //   2. Customer — role === 'customer'
  const isCustomer = role === 'customer';

  return (
    <nav className="navbar">
      <div className="logo-area">
        <div className="logo-box">🔧</div>
        <span className="logo-name">FixIT</span>
      </div>

      <div className={`nav-links ${isCustomer ? 'customer-links' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>

        {isCustomer && (
          <>
            <Link to="/customer/dashboard">Dashboard</Link>
            <Link to="/customer/bookings">My Bookings</Link>
            <Link to="/customer/profile">Profile</Link>
          </>
        )}
      </div>

      {/* Always show Login/Register for non-customers */}
      {!isCustomer && (
        <div className="nav-auth">
          <Link to="/login">
            <button className="login-link">Login</button>
          </Link>
          <Link to="/register">
            <button className="register-btn">Register</button>
          </Link>
        </div>
      )}

      {/* Customer logged in — name + logout */}
      {isCustomer && (
        <div className="nav-auth">
          <span>👤 {user?.name || 'User'}</span>
          <button className="login-link" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default CustomerNavbar;