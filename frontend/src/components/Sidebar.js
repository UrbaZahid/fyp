// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Close sidebar when route changes (mobile nav)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on outside click (mobile)
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest('.sidebar') && !e.target.closest('.hamburger-btn')) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const getNavItems = () => {
    if (role === 'customer') {
      return [
        { path: '/customer/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/customer/bookings',  icon: '📅', label: 'My Bookings' },
        { path: '/customer/profile',   icon: '👤', label: 'Profile' },
      ];
    } else if (role === 'provider') {
      return [
        { path: '/provider/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/provider/requests',  icon: '📥', label: 'Booking Requests' },
        { path: '/provider/history',   icon: '🕒', label: 'Booking History' },
        { path: '/provider/profile',   icon: '👤', label: 'Profile' },
      ];
    } else if (role === 'admin') {
      return [
        { path: '/admin/dashboard',    icon: '📊', label: 'Dashboard' },
        { path: '/admin/users',        icon: '👥', label: 'Users' },
        { path: '/admin/providers',    icon: '🏢', label: 'Providers' },
        { path: '/admin/categories',   icon: '📁', label: 'Categories' },
        { path: '/admin/areas',        icon: '📍', label: 'Areas' },
        { path: '/admin/bookings',     icon: '📅', label: 'All Bookings' },
        { path: '/admin/transactions', icon: '💰', label: 'Transactions' },
        { path: '/admin/reports',      icon: '📈', label: 'Reports' },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* ── Hamburger button — only visible on mobile ── */}
      <button
        className="hamburger-btn"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span className={`ham-line ${open ? 'open' : ''}`}></span>
        <span className={`ham-line ${open ? 'open' : ''}`}></span>
        <span className={`ham-line ${open ? 'open' : ''}`}></span>
      </button>

      {/* ── Overlay behind sidebar on mobile ── */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${role === 'admin' ? 'admin-sidebar' : ''} ${role === 'provider' ? 'provider-sidebar' : ''} ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="logo-box">🔧</div>
          <span>FixIT</span>
        </div>

        {role === 'provider' && <div className="p-tag">Service Provider</div>}
        {role === 'admin'    && <div className="a-badge">Admin Panel</div>}

        <nav className="sidebar-nav">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-text">
              <p className="user-name">{user?.name || 'User'}</p>
              <p className="user-email">{user?.email || ''}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>↪ Logout</button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;