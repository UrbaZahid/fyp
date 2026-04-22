import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();

 // Sidebar links wale hisse mein ye add karein
const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
  { name: "Users", path: "/admin/users", icon: "👤" },
  { name: "Providers", path: "/admin/providers", icon: "💼" },
  { name: "Categories", path: "/admin/categories", icon: "📁" },
  { name: "Areas", path: "/admin/areas", icon: "📍" },
  { name: "Bookings", path: "/admin/bookings", icon: "📅" },
  { name: "Transactions", path: "/admin/transactions", icon: "💳" }, // Naya link
  { name: "Reports", path: "/admin/reports", icon: "📈" }, // Naya link
];

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar Section */}
      <aside className="sidebar-container">
        <div className="sidebar-brand-box">
          <div className="brand-icon-square">🔧</div>
          <div className="brand-text">
            <h3>FixIt</h3>
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
          <Link to="/login" className="sidebar-link-item logout-link">
            <span className="link-icon">↪</span> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-viewport">
        <header className="main-viewport-header">
          <div className="header-user-info">
            <p className="welcome-label">Welcome back,</p>
            <h2 className="admin-name-title">Admin</h2>
          </div>
          <div className="profile-badge-circle">A</div>
        </header>
        
        <div className="scrollable-page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;