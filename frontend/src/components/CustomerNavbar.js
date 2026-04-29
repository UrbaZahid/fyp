import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './customernavbar.css';

const CustomerNavbar = ({ role, setRole }) => {
  const navigate = useNavigate();

  // localStorage se real user lo
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setRole(null); // App.js state reset karo
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo-area">
        <div className="logo-box">🔧</div>
        <span className="logo-name">FixIT</span>
      </div>

      <div className={`nav-links ${role === 'customer' ? 'customer-links' : ''}`}>
        <Link to="/">Home</Link>

        {/* Login nahi — public links */}
        {!role && <Link to="/services">Services</Link>}

        {/* Customer logged in — customer links */}
        {role === 'customer' && (
          <>
            <Link to="/services">Services</Link>
            <Link to="/customer/dashboard">Dashboard</Link>
            <Link to="/customer/bookings">My Bookings</Link>
            <Link to="/customer/profile">Profile</Link>
          </>
        )}
      </div>

      {/* Login nahi — Login/Register buttons */}
      {!role && (
        <div className="nav-auth">
          <Link to="/login">
            <button className="login-link">Login</button>
          </Link>
          <Link to="/register">
            <button className="register-btn">Register</button>
          </Link>
        </div>
      )}

      {/* Customer logged in — user name + logout */}
      {role === 'customer' && (
        <div className="nav-auth">
          <span >
            👤 {user?.name || 'User'}
          </span>
          <button className="login-link" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default CustomerNavbar;