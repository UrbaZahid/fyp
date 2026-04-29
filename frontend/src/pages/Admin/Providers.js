// src/pages/Admin/Providers.js

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api/api';
import './AdminProviders.css';

const AdminProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('All');
  const [actionId, setActionId]   = useState('');

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/providers');
      setProviders(data.providers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProviders(); }, []);

  const handleApprove = async (id) => {
    try {
      setActionId(id);
      await API.put(`/admin/providers/${id}/approve`);
      fetchProviders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setActionId('');
    }
  };

  const handleReject = async (id) => {
    try {
      setActionId(id);
      await API.put(`/admin/providers/${id}/reject`);
      fetchProviders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setActionId('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Provider delete karna chahte hain?')) return;
    try {
      await API.delete(`/admin/providers/${id}`);
      setProviders(providers.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const filtered = providers.filter(p => {
    const name    = p.user?.name || '';
    const service = p.category?.name || '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
        service.toLowerCase().includes(search.toLowerCase());
    const status  = p.isApproved ? 'Approved' : 'Pending';
    const matchFilter = filter === 'All' || filter === status;
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout>
      <div className="providers-page-container">
        <div className="providers-header">
          <div className="header-text">
            <h1 className="page-main-title">Manage Providers</h1>
            <p className="page-subtitle">Approve, manage, or remove service providers</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Pending', 'Approved'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-pill ${filter === f ? 'active' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="search-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search providers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="providers-search-input"
          />
        </div>

        {loading ? (
          <div className="admin-loading">⏳ Loading providers...</div>
        ) : (
          <div className="providers-table-card">
            <table className="providers-data-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>SERVICE</th>
                  <th>AREAS</th>
                  <th>CHARGES</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" className="empty-row">Koi provider nahi mila</td></tr>
                ) : filtered.map(p => {
                  const isProcessing = actionId === p._id;
                  const approved = p.isApproved;
                  return (
                    <tr key={p._id} className="table-row">
                      <td className="provider-name-cell">{p.user?.name || '—'}</td>
                      <td>{p.user?.email || '—'}</td>
                      <td>{p.category?.name || '—'}</td>
                      <td style={{ fontSize: '12px', color: '#64748b', maxWidth: '160px' }}>
                        {p.serviceAreas?.slice(0, 2).join(', ') || '—'}
                        {p.serviceAreas?.length > 2 && ` +${p.serviceAreas.length - 2}`}
                      </td>
                      <td>Rs {p.charges?.toLocaleString() || 0}</td>
                      <td>
                        <span className={`status-tag ${approved ? 'approved' : 'pending'}`}>
                          {approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {!approved && (
                            <button
                              className="approve-btn"
                              title="Approve"
                              disabled={isProcessing}
                              onClick={() => handleApprove(p._id)}
                            >
                              ✓
                            </button>
                          )}
                          {approved && (
                            <button
                              className="reject-btn-sm"
                              title="Revoke"
                              disabled={isProcessing}
                              onClick={() => handleReject(p._id)}
                            >
                              ✕
                            </button>
                          )}
                          <button
                            className="delete-btn"
                            title="Delete"
                            onClick={() => handleDelete(p._id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProviders;