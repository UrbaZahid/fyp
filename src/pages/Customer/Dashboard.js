import React from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { Link } from 'react-router-dom';
import '../../pages/CustomerDashboard.css';

const CustomerDashboard = () => {
  const bookings = [
    { id: 1, name: 'Rajesh Kumar', service: 'Electrician', date: '2024-01-15 at 10:00 AM', price: '₹1500', status: 'Completed', initial: 'R', color: '#3b82f6' },
    { id: 2, name: 'Suresh Patel', service: 'Plumber', date: '2024-01-20 at 02:00 PM', price: '₹900', status: 'Pending', initial: 'S', color: '#6366f1' },
  ];

  return (
      <>
    <div className="dashboard-wrapper">
      <main className="dashboard-content">
        <div className="content-inner">
          
          <section className="welcome-section">
            <h2>Dashboard</h2>
            <h3>Welcome back!</h3>
            <p>Here's what's happening with your bookings.</p>
          </section>
          <div className="dash-booking">
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
            {bookings.map(item => (
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
        </div>
      </main>
    </div>
    </>
  );
};

export default CustomerDashboard;
