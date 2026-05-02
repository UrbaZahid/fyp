import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // ─── State ────────────────────────────────────────────────
  const [stats, setStats]           = useState(null);
  const [recentBookings, setRecent] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [activeBar, setActiveBar]   = useState(null);

  const [chartData, setChartData] = useState([]);

  // ─── Fetch stats + recent bookings + monthly data ─────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [statsRes, bookingsRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/bookings'),
        ]);

        setStats(statsRes.data);

        const all = bookingsRes.data.bookings || [];
        setRecent(all.slice(0, 4));

        // Build monthly chart data from real bookings
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const counts = {};
        all.forEach(b => {
          const d = new Date(b.createdAt);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          counts[key] = (counts[key] || 0) + 1;
        });

        // Last 6 months
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          months.push({ month: monthNames[d.getMonth()], bookings: counts[key] || 0 });
        }
        const maxVal = Math.max(...months.map(m => m.bookings), 1);
        setChartData(months.map(m => ({
          ...m,
          h: `${Math.round((m.bookings / maxVal) * 90) + 5}%`,
        })));

      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ─── Stat cards config ─────────────────────────────────────
  // Built from real API data once loaded
  const statCards = stats
    ? [
        {
          title: 'Total Users',
          value: stats.totalUsers.toLocaleString(),
          icon: '👤',
          color: 'blue',
        },
        {
          title: 'Service Providers',
          value: stats.totalProviders.toLocaleString(),
          extra: stats.pendingProviders > 0
            ? `${stats.pendingProviders} pending approval`
            : 'All approved',
          icon: '💼',
          color: 'orange',
        },
        {
          title: 'Total Bookings',
          value: stats.totalBookings.toLocaleString(),
          extra: `${stats.pendingBookings} pending`,
          icon: '📅',
          color: 'green',
        },
        {
          title: 'Revenue',
          value: `Rs ${stats.totalRevenue.toLocaleString()}`,
          extra: `${stats.completedBookings} completed`,
          icon: '💳',
          color: 'yellow',
        },
      ]
    : [];

  // ─── Status pill style helper ──────────────────────────────
  const pillClass = (status = '') => {
    const s = status.toLowerCase();
    if (s === 'completed') return 'completed';
    if (s === 'pending')   return 'pending';
    return 'cancelled'; // rejected / cancelled
  };

  // ─── Render ───────────────────────────────────────────────
  return (
    <AdminLayout>
      <div className="dashboard-scroll-wrapper">

        {/* Header */}
        <div className="dash-main-header">
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">
            Overview of your platform performance
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
            borderRadius: '10px', padding: '14px 20px', marginBottom: '20px',
            fontSize: '14px', fontWeight: '600'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── 1. Stats Cards ──────────────────────────────── */}
        {loading ? (
          <div className="stats-row-container">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card" style={{ opacity: 0.4, minHeight: '90px' }}>
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>Loading...</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="stats-row-container">
            {statCards.map((item, index) => (
              <div key={index} className="stat-card">
                <div className="stat-content">
                  <p className="stat-label">{item.title}</p>
                  <h2 className="stat-value">{item.value}</h2>
                  {item.extra && (
                    <p className="stat-trend">
                      <span className="month-text">{item.extra}</span>
                    </p>
                  )}
                </div>
                <div className={`stat-icon-box ${item.color}`}>{item.icon}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── 2. Charts Row ────────────────────────────────── */}
        <div className="parallel-charts-grid">

          {/* Bar chart — static visual */}
          <div className="chart-box">
            <h3 className="chart-title">Monthly Bookings</h3>
            <div className="graph-area">
              <div className="y-axis-labels">
                <span>120</span><span>90</span>
                <span>60</span><span>30</span><span>0</span>
              </div>
              <div className="bars-box">
                {chartData.map((d, i) => (
                  <div
                    key={i}
                    className="bar-wrapper"
                    onMouseEnter={() => setActiveBar(i)}
                    onMouseLeave={() => setActiveBar(null)}
                  >
                    {activeBar === i && (
                      <div className="bar-tooltip">
                        <strong>{d.month}</strong>
                        <span>bookings: {d.bookings}</span>
                      </div>
                    )}
                    <div className="actual-blue-bar" style={{ height: d.h }} />
                    <span className="bar-month-label">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Donut chart — percentages from real stats */}
          <div className="chart-box">
            <h3 className="chart-title">Booking Status</h3>
            <div className="donut-center-container">
              <div className="donut-ring-visual" />
              <div className="donut-legend-list">
                <div className="leg-item">
                  <span className="dot g" />
                  Completed
                  {stats && (
                    <strong style={{ marginLeft: '6px', color: '#0f172a' }}>
                      {stats.completedBookings}
                    </strong>
                  )}
                </div>
                <div className="leg-item">
                  <span className="dot y" />
                  Pending
                  {stats && (
                    <strong style={{ marginLeft: '6px', color: '#0f172a' }}>
                      {stats.pendingBookings}
                    </strong>
                  )}
                </div>
                <div className="leg-item">
                  <span className="dot r" />
                  Other
                  {stats && (
                    <strong style={{ marginLeft: '6px', color: '#0f172a' }}>
                      {stats.totalBookings - stats.completedBookings - stats.pendingBookings}
                    </strong>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Recent Bookings Table ──────────────────────── */}
        <div className="recent-bookings-section">
          <h3 className="section-title-text">Recent Bookings</h3>
          <div className="table-card-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>CUSTOMER</th>
                  <th>SERVICE</th>
                  <th>PROVIDER</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '30px' }}>
                      Loading bookings...
                    </td>
                  </tr>
                )}

                {!loading && recentBookings.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '30px' }}>
                      No bookings yet.
                    </td>
                  </tr>
                )}

                {!loading && recentBookings.map((bk, i) => {
                  // Safely pull nested fields
                  const customerName = bk.customer?.name || '—';
                  const providerName = bk.provider?.user?.name || '—';
                  const service      = bk.provider?.category?.name || '—';
                  const shortId      = `BK-${String(i + 1).padStart(3, '0')}`;
                  const date         = bk.date || bk.createdAt?.slice(0, 10) || '—';

                  return (
                    <tr key={bk._id}>
                      <td className="bold-id">{shortId}</td>
                      <td>{customerName}</td>
                      <td>{service}</td>
                      <td>{providerName}</td>
                      <td>
                        <span className={`status-pill ${pillClass(bk.status)}`}>
                          {bk.status}
                        </span>
                      </td>
                      <td className="date-cell">{date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;