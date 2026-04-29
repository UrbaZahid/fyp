import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/api';
import '../../pages/ProviderDashboard.css';

const ProviderDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data } = await API.get('/bookings/requests');
        const histRes = await API.get('/bookings/history');

        const allRequests = data.bookings || [];
        const history = histRes.data.bookings || [];

        const allBookings = [...allRequests, ...history];

        const pending = allRequests.filter(b => b.status === 'Pending').length;
        const accepted = allRequests.filter(b => b.status === 'Accepted').length;
        const completed = history.filter(b => b.status === 'Completed').length;

        const earnings = history
          .filter(b => b.status === 'Completed')
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

        setStats({
          pending,
          total: allBookings.length,
          completed,
          earnings,
        });

        setRecent(allBookings.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusClass = (status) => {
    if (status === 'Completed') return 'status-completed';
    if (status === 'Pending') return 'status-pending';
    if (status === 'Accepted') return 'status-accepted';
    return 'status-cancelled';
  };

  return (
    <div className="provider-layout">
      <Sidebar role="provider" />

      <main className="p-main">
        <div className="p-content-inner">

          <div className="p-header">
            <h2>Welcome back, {user.name || 'Provider'} 👋</h2>
            <p>Aaj ka overview dekho</p>
          </div>

          {loading ? (
            <div className="p-loading">⏳ Loading dashboard...</div>
          ) : (
            <>
              {/* Stats */}
              <div className="p-stats-grid">
                <div className="p-stat-card">
                  <span>🔔</span>
                  <h4>{stats?.pending || 0}</h4>
                  <p>Pending Requests</p>
                </div>

                <div className="p-stat-card">
                  <span>📅</span>
                  <h4>{stats?.total || 0}</h4>
                  <p>Total Bookings</p>
                </div>

                <div className="p-stat-card">
                  <span>✅</span>
                  <h4>{stats?.completed || 0}</h4>
                  <p>Completed</p>
                </div>

                <div className="p-stat-card">
                  <span>💰</span>
                  <h4>Rs {stats?.earnings?.toLocaleString() || 0}</h4>
                  <p>Total Earnings</p>
                </div>
              </div>

              {/* Alert */}
              {stats?.pending > 0 && (
                <div className="p-alert">
                  🔔 {stats.pending} pending request{stats.pending > 1 ? 's' : ''}
                </div>
              )}

              {/* Recent */}
              <h3 className="p-section-title">Recent Bookings</h3>

              <div className="p-recent-list">
                {recent.map((b) => {
                  const name = b.customer?.name || b.customerName || 'Customer';

                  return (
                    <div key={b._id} className="p-booking-item">
                      <div className="p-client">
                        <div className="p-avatar">
                          {name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{name}</strong>
                          <p>📅 {b.date} · {b.time} · {b.city}</p>
                        </div>
                      </div>

                      <div className="p-right">
                        <strong>Rs {b.totalAmount?.toLocaleString() || 0}</strong>

                        <span className={`status ${getStatusClass(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;