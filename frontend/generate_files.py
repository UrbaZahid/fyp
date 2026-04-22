"""
FixIT App - Complete File Generator
This script creates all remaining dashboard pages and components
"""

import os

# Base directory
BASE_DIR = "/home/claude/fixit-app/src"

# All file contents as a dictionary
FILES = {
    # Customer Dashboard
    "pages/Customer/Dashboard.js": '''import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './Dashboard.css';

const CustomerDashboard = () => {
  const bookings = [
    { id: 1, name: 'Rajesh Kumar', service: 'Electrician', date: '2024-01-15 at 10:00 AM', price: '₹1500', status: 'Completed', initial: 'R', color: '#3b82f6' },
    { id: 2, name: 'Suresh Patel', service: 'Plumber', date: '2024-01-20 at 02:00 PM', price: '₹900', status: 'Pending', initial: 'S', color: '#6366f1' },
    { id: 3, name: 'Amit Singh', service: 'Carpenter', date: '2024-01-22 at 11:00 AM', price: '₹2400', status: 'Accepted', initial: 'A', color: '#4f46e5' },
  ];

  return (
    <div className="dashboard-wrapper">
      <Sidebar role="customer" />
      
      <main className="dashboard-content">
        <div className="content-inner">
          <header className="content-header">
            <h2>Dashboard</h2>
          </header>

          <section className="welcome-section">
            <h3>Welcome back!</h3>
            <p>Here's what's happening with your bookings.</p>
          </section>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-box blue">📅</div>
              <div><h4>3</h4><p>Total Bookings</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-box yellow">🕒</div>
              <div><h4>1</h4><p>Pending</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-box green">✅</div>
              <div><h4>1</h4><p>Completed</p></div>
            </div>
          </div>

          <div className="recent-bookings">
            <div className="table-header">
              <h4>Recent Bookings</h4>
              <Link to="/customer/bookings" className="view-all">View all →</Link>
            </div>
            {bookings.map((item) => (
              <div key={item.id} className="booking-row">
                <div className="booking-main">
                  <div className="avatar" style={{backgroundColor: item.color}}>{item.initial}</div>
                  <div className="booking-details">
                    <strong>{item.name}</strong>
                    <span>{item.service}</span>
                    <small>{item.date}</small>
                  </div>
                </div>
                <div className="booking-meta">
                  <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                  <span className="price">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="main-footer dashboard-dark-footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo-area light">
                <div className="logo-box">🔧</div>
                <span className="logo-name">FixIT</span>
              </div>
              <p>Connecting you with trusted professionals.</p>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul><li>Services</li><li>Login</li></ul>
            </div>
            <div className="footer-links">
              <h4>Contact</h4>
              <p className="contact-info">📧 support@fixit.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 FixIT. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default CustomerDashboard;
''',

    "components/Sidebar.js": '''import React from 'react';
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
        { path: '/customer/history', icon: '🕒', label: 'Booking History' },
        { path: '/customer/profile', icon: '👤', label: 'Profile' },
      ];
    } else if (role === 'provider') {
      return [
        { path: '/provider/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/provider/requests', icon: '📥', label: 'Booking Requests' },
        { path: '/provider/history', icon: '🕒', label: 'Booking History' },
        { path: '/provider/earnings', icon: '💰', label: 'Earnings' },
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
    <aside className="sidebar">
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
''',
}

# Create all files
def create_files():
    for file_path, content in FILES.items():
        full_path = os.path.join(BASE_DIR, file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Created: {file_path}")

if __name__ == "__main__":
    create_files()
    print("\n✅ All files created successfully!")
    print("Next steps:")
    print("1. cd /home/claude/fixit-app")
    print("2. npm install")
    print("3. npm start")
