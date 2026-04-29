import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/api';
import '../../pages/CustomerDashboard.css';

const avatarColors = ['#3b82f6', '#6366f1', '#4f46e5', '#0891b2', '#7c3aed', '#db2777'];

const CustomerDashboard = () => {
  // ─── State ──────────────────────────────────────────────────
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  // ─── Get user name from localStorage ────────────────────────
  const user     = JSON.parse(localStorage.getItem('user') || 'null');
  const userName = user?.name || 'Customer';

  // ─── Fetch bookings from API ─────────────────────────────────
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await API.get('/bookings/my');
        setBookings(res.data.bookings || []);
      } catch (err) {
        setError('Could not load bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ─── Compute stats from real data ───────────────────────────
  const totalBookings     = bookings.length;
  const pendingBookings   = bookings.filter((b) => b.status === 'Pending').length;
  const acceptedBookings  = bookings.filter((b) => b.status === 'Accepted').length;
  const completedBookings = bookings.filter((b) => b.status === 'Completed').length;

  // ─── Recent 3 bookings ───────────────────────────────────────
  const recentBookings = bookings.slice(0, 3);

  // ─── Helpers ─────────────────────────────────────────────────
  const getInitial = (name = '') => name.charAt(0).toUpperCase() || '?';
  const getColor   = (index)     => avatarColors[index % avatarColors.length];

  const formatDate = (dateStr, timeStr) => {
    if (!dateStr) return '—';
    return `${dateStr}${timeStr ? ' at ' + timeStr : ''}`;
  };

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="dashboard-wrapper">
      <main className="dashboard-content">
        <div className="content-inner">

          {/* Welcome */}
          <section className="welcome-section">
            <h2>Dashboard</h2>
            <h3>Welcome back, {userName}! 👋</h3>
            <p>Here's what's happening with your bookings.</p>
          </section>

          <div className="dash-booking">

            {/* ── Stats Grid ──────────────────────────────── */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
              <div className="stat-card">
                <div className="stat-icon-box blue">📅</div>
                <div>
                  <h4>{loading ? '...' : totalBookings}</h4>
                  <p>Total Bookings</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-box yellow">🕒</div>
                <div>
                  <h4>{loading ? '...' : pendingBookings}</h4>
                  <p>Pending</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>✔️</div>
                <div>
                  <h4>{loading ? '...' : acceptedBookings}</h4>
                  <p>Accepted</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-box green">✅</div>
                <div>
                  <h4>{loading ? '...' : completedBookings}</h4>
                  <p>Completed</p>
                </div>
              </div>
            </div>

            {/* ── Recent Bookings ─────────────────────────── */}
            <div className="recent-bookings">
              <div className="table-header">
                <h4>Recent Bookings</h4>
                <Link to="/customer/bookings" className="view-all">
                  View all →
                </Link>
              </div>

              {/* Loading */}
              {loading && (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '20px 0' }}>
                  Loading bookings...
                </p>
              )}

              {/* Error */}
              {!loading && error && (
                <p style={{ color: '#dc2626', textAlign: 'center', padding: '20px 0' }}>
                  {error}
                </p>
              )}

              {/* Empty */}
              {!loading && !error && recentBookings.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                  <p style={{ fontSize: '32px', marginBottom: '8px' }}>📋</p>
                  <p>No bookings yet.</p>
                  <Link
                    to="/services"
                    style={{
                      display: 'inline-block', marginTop: '10px',
                      background: '#2563eb', color: 'white',
                      padding: '8px 20px', borderRadius: '8px',
                      textDecoration: 'none', fontSize: '13px', fontWeight: '600'
                    }}
                  >
                    Browse Services
                  </Link>
                </div>
              )}

              {/* Booking rows */}
              {!loading && !error && recentBookings.map((booking, index) => {
                const providerName = booking.provider?.user?.name || 'Unknown Provider';
                const category     = booking.provider?.category?.name || 'Service';
                const status       = booking.status || 'Pending';
                const statusClass  = status.toLowerCase();

                return (
                  <div key={booking._id} className="booking-row">
                    <div className="booking-main">
                      <div
                        className="avatar"
                        style={{ backgroundColor: getColor(index) }}
                      >
                        {getInitial(providerName)}
                      </div>
                      <div className="booking-details">
                        <strong>{providerName}</strong>
                        <span>{category}</span>
                        <small>{formatDate(booking.date, booking.time)}</small>
                      </div>
                    </div>

                    <div className="booking-meta">
                      <span className={`status-badge ${statusClass}`}>
                        {status}
                      </span>
                      <span className="price">
                        Rs {booking.totalAmount || 0}
                      </span>
                    </div>
                  </div>
                );
              })}

            </div>
            {/* End recent-bookings */}

          </div>
          {/* End dash-booking */}

        </div>
        {/* End content-inner */}
      </main>
    </div>
  );
};

export default CustomerDashboard;