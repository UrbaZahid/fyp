// src/pages/AdminLogin.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import './Login.css';

const AdminLogin = ({ setRole }) => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', { email, password });

      // Sirf admin allow karo
      if (data.user.role !== 'admin') {
        setError('Access denied. This portal is for admins only.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setRole(data.user.role);
      navigate('/admin/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-badge">
          🛡️ Admin Portal — FixIT
        </div>

        <h2>Admin Access</h2>
        <p className="subtitle">Authorized personnel only</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Admin Email</label>
            <input
              type="email"
              placeholder="admin@fixit.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="admin-sign-in-btn"
            disabled={loading}
          >
            {loading ? 'Verifying...' : '🔐 Login to Admin Panel'}
          </button>
        </form>

        <div className="admin-login-footer">
          🔒 This page is confidential. Unauthorized access is prohibited.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;