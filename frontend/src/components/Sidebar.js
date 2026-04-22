import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  const getNavItems = () => {
    if (role === 'customer') {
      return [
        { path: '/customer/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/customer/bookings', icon: '📅', label: 'My Bookings' },
        { path: '/customer/profile', icon: '👤', label: 'Profile' },
      ];
    } else if (role === 'provider') {
      return [
        { path: '/provider/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/provider/requests', icon: '📥', label: 'Booking Requests' },
        { path: '/provider/history', icon: '🕒', label: 'Booking History' },
        { path: '/provider/profile', icon: '👤', label: 'Profile' },
      ];
    } else if (role === 'admin') {
      return [
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/admin/users', icon: '👥', label: 'Users' },
        { path: '/admin/providers', icon: '🏢', label: 'Providers' },
        { path: '/admin/categories', icon: '📁', label: 'Categories' },
        { path: '/admin/areas', icon: '📍', label: 'Areas' },
        { path: '/admin/bookings', icon: '📅', label: 'All Bookings' },
        { path: '/admin/transactions', icon: '₹', label: 'Transactions' },
        { path: '/admin/reports', icon: '📈', label: 'Reports' },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <aside className={`sidebar ${role === 'admin' ? 'admin-sidebar' : ''} ${role === 'provider' ? 'provider-sidebar' : ''}`}>
      <div className="sidebar-brand">
        <div className="logo-box">🔧</div>
        <span>FixIT</span>
      </div>
      
      {role === 'provider' && <div className="p-tag">Service Provider</div>}
      {role === 'admin' && <div className="a-badge">Admin Panel</div>}
      
      <nav className="sidebar-nav">
        {navItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
      
      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar">J</div>
          <div>
            <p className="user-name">John Doe</p>
            <p className="user-email">john@example.com</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>↪ Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;
