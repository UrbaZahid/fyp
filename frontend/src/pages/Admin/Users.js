// src/pages/Admin/Users.js

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import API from '../../api/api';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/users');
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="users-page-container">
        <div className="users-header">
          <div className="header-text">
            <h1 className="page-main-title">Manage Users</h1>
            <p className="page-subtitle">Overview of all platform customers</p>
          </div>
          <span className="total-badge">{users.length} Total Users</span>
        </div>

        <div className="search-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="users-search-input"
          />
        </div>

        {loading ? (
          <div className="admin-loading">⏳ Loading users...</div>
        ) : (
          <div className="users-table-card">
            <table className="users-data-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>AREA</th>
                  <th>JOINED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" className="empty-row">No users found</td></tr>
                ) : filtered.map(u => (
                  <tr key={u._id} className="table-row">
                    <td className="user-name-cell">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td>{u.area || '—'}</td>
                    <td className="joined-date">
                      {new Date(u.createdAt).toLocaleDateString('en-PK')}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="delete-btn"
                          title="Delete User"
                          onClick={() => handleDelete(u._id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;