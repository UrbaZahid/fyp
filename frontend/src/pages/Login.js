// src/pages/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import './Login.css';

const Login = ({ setRole }) => {
  const [role, setLocalRole] = useState('Customer');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', { email, password });

      // Token aur user localStorage mein save karo
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // App.js ka role state update karo
      setRole(data.user.role);

      // Role ke hisaab se redirect karo
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.user.role === 'provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/customer/dashboard');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixit-container">
      <div className="login-page">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your account</p>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#fee2e2', color: '#dc2626',
              padding: '10px 14px', borderRadius: '8px',
              marginBottom: '16px', fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div className="role-selection">
            <p className="label">Login as</p>
            <div className="role-buttons">
              <button
                type="button"
                className={role === 'Customer' ? 'active' : ''}
                onClick={() => setLocalRole('Customer')}
              >
                <span className="role-icon">👤</span> Customer
              </button>
              <button
                type="button"
                className={role === 'Provider' ? 'active' : ''}
                onClick={() => setLocalRole('Provider')}
              >
                <span className="role-icon">💼</span> Provider
              </button>
              <button
                type="button"
                className={role === 'Admin' ? 'active' : ''}
                onClick={() => setLocalRole('Admin')}
              >
                <span className="role-icon">🛡️</span> Admin
              </button>
            </div>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <div className="label-row">
                <label>Password</label>
                <a href="#" className="forgot-pass">Forgot password?</a>
              </div>
              <div className="password-wrapper">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="eye-icon">👁️</span>
              </div>
            </div>

            <button type="submit" className="sign-in-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="register-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

      {/* Footer — same as before */}
      <footer className="main-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo-area light">
              <div className="logo-box">🔧</div>
              <span className="logo-name">FixIT</span>
            </div>
            <p>Connecting you with trusted service professionals for all your home needs.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/register">Become a Provider</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Popular Services</h4>
            <ul>
              <li><Link to="/services">Electrician</Link></li>
              <li><Link to="/services">Plumber</Link></li>
              <li><Link to="/services">Carpenter</Link></li>
              <li><Link to="/services">Cleaning</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Contact Us</h4>
            <p className="contact-info">📧 support@fixit.com</p>
            <p className="contact-info">📞 +92 300-1234567</p>
            <p className="contact-info">📍 Lahore, Pakistan</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 FixIT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;