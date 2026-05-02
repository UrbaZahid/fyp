// src/components/AdminLayout.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const menuItems = [
  { name: 'Dashboard',    path: '/admin/dashboard',    icon: '📊' },
  { name: 'Users',        path: '/admin/users',        icon: '👥' },
  { name: 'Providers',    path: '/admin/providers',    icon: '💼' },
  { name: 'Categories',   path: '/admin/categories',   icon: '📁' },
  { name: 'Areas',        path: '/admin/areas',        icon: '📍' },
  { name: 'Bookings',     path: '/admin/bookings',     icon: '📅' },
  { name: 'Transactions', path: '/admin/transactions', icon: '💳' },
  { name: 'Reports',      path: '/admin/reports',      icon: '📈' },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest('.admin-sidebar-container') && !e.target.closest('.admin-hamburger-btn')) {
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

  return (
    <div className="admin-dashboard-container">

      {/* ── Hamburger — mobile only ── */}
      <button
        className="admin-hamburger-btn"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span className={`admin-ham-line ${open ? 'open' : ''}`}></span>
        <span className={`admin-ham-line ${open ? 'open' : ''}`}></span>
        <span className={`admin-ham-line ${open ? 'open' : ''}`}></span>
      </button>

      {/* ── Overlay ── */}
      {open && <div className="admin-sidebar-overlay" onClick={() => setOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar-container ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand-box">
          <div className="brand-icon-square">🔧</div>
          <div className="brand-text">
            <h3>FixIT</h3>
            <p>Admin Panel</p>
          </div>
        </div>

        <nav className="sidebar-links">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link-item ${location.pathname === item.path ? 'active-orange' : ''}`}
            >
              <span className="link-icon">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer-box">
          <div className="admin-user-row">
            <div className="admin-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="admin-user-text">
              <p className="admin-user-name">{user?.name || 'Admin'}</p>
              <p className="admin-user-email">{user?.email || ''}</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            ↪ Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="main-viewport">
        <header className="main-viewport-header">
          <div className="header-user-info">
            <p className="welcome-label">Welcome back,</p>
            <h2 className="admin-name-title">{user?.name || 'Admin'}</h2>
          </div>
          <div className="profile-badge-circle">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
        </header>

        <div className="scrollable-page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;