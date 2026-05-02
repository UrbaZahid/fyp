// src/pages/Provider/BookingHistory.js

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/api';
import '../../pages/BookingHistory.css';

const avatarColors = ['#3b82f6', '#6366f1', '#4f46e5', '#0891b2', '#7c3aed', '#db2777'];

const ProviderBookingHistory = () => {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/bookings/history');
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load booking history. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filtered = bookings.filter((b) => {
    const name = b.customer?.name || b.customerName || '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getInitial = (name = '') => name.charAt(0).toUpperCase() || '?';
  const getColor   = (i)         => avatarColors[i % avatarColors.length];

  return (
    <div className="provider-layout">
      <Sidebar role="provider" />
      <main className="p-main">
        <div className="p-content-inner">

          <div className="req-page-header">
            <h2>Booking History</h2>
            <p className="req-subtitle">Record of completed and cancelled bookings</p>
          </div>

          {/* Filters */}
          <div className="history-filters">
            <input
              type="text"
              className="search-input"
              placeholder="Customer name se search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Cancelled/Rejected</option>
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="req-loading">⏳ Loading history...</div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="req-error">❌ {error}</div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="req-empty">
              <div className="req-empty-icon">📂</div>
              <h3>No records found</h3>
              <p>No completed or cancelled bookings yet.</p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && filtered.length > 0 && (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>CLIENT</th>
                    <th>SERVICE</th>
                    <th>DATE</th>
                    <th>ADDRESS</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => {
                    const name = b.customer?.name || b.customerName || 'Customer';
                    const statusClass = b.status === 'Completed' ? 'completed' : 'cancelled';
                    return (
                      <tr key={b._id}>
                        <td>
                          <div className="client-cell">
                            <div
                              className="mini-avatar"
                              style={{ background: getColor(i) }}
                            >
                              {getInitial(name)}
                            </div>
                            {name}
                          </div>
                        </td>
                        <td>
                          <span className="svc-badge">
                            {b.provider?.category?.name || 'Service'}
                          </span>
                        </td>
                        <td>{b.date}</td>
                        <td style={{ fontSize: '13px', color: '#64748b' }}>
                          {b.address}, {b.city}
                        </td>
                        <td style={{ fontWeight: 700 }}>
                          Rs {b.totalAmount?.toLocaleString() || 0}
                        </td>
                        <td>
                          <span className={`status-dot ${statusClass}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ProviderBookingHistory;