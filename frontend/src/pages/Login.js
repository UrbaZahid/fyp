// src/pages/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import './Login.css';

const Login = ({ setRole }) => {
  const [role, setLocalRole]        = useState('Customer');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot]         = useState(false);
  const [forgotEmail, setForgotEmail]       = useState('');
  const [forgotStep, setForgotStep]         = useState('email'); // 'email' | 'reset'
  const [newPassword, setNewPassword]       = useState('');
  const [confirmNew, setConfirmNew]         = useState('');
  const [forgotError, setForgotError]       = useState('');
  const [forgotSuccess, setForgotSuccess]   = useState('');
  const [forgotLoading, setForgotLoading]   = useState(false);

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const { data } = await API.post('/auth/login', { email, password });

    // ── Admin ko regular login se block karo ──
    if (data.user.role === 'admin') {
      setError('Access denied. Use the authorized admin portal.');
      setLoading(false);
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setRole(data.user.role);

    if (data.user.role === 'provider') {
      navigate('/provider/dashboard');
    } else {
      navigate('/customer/dashboard');
    }

  } catch (err) {
    setError(err.response?.data?.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
  // Step 1: verify email exists
  const handleForgotEmailSubmit = async () => {
    setForgotError('');
    if (!forgotEmail) return setForgotError('Please enter your email.');
    setForgotLoading(true);
    try {
      await API.post('/auth/forgot-password/verify-email', { email: forgotEmail });
      setForgotStep('reset');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'No account found with this email.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: set new password
  const handleResetPassword = async () => {
    setForgotError('');
    if (!newPassword || !confirmNew) return setForgotError('Please fill in both fields.');
    if (newPassword.length < 6) return setForgotError('Password must be at least 6 characters.');
    if (newPassword !== confirmNew) return setForgotError('Passwords do not match.');
    setForgotLoading(true);
    try {
      await API.post('/auth/forgot-password/reset', {
        email: forgotEmail,
        newPassword,
      });
      setForgotSuccess('Password reset successfully! You can now log in.');
      setTimeout(() => {
        setShowForgot(false);
        setForgotStep('email');
        setForgotEmail('');
        setNewPassword('');
        setConfirmNew('');
        setForgotSuccess('');
      }, 2500);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotStep('email');
    setForgotEmail('');
    setNewPassword('');
    setConfirmNew('');
    setForgotError('');
    setForgotSuccess('');
  };

  return (
    <div className="fixit-container">
      <div className="login-page">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your account</p>

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
                <button
                  type="button"
                  className="forgot-pass"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot password?
                </button>
              </div>
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
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
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

      {/* ── Forgot Password Modal ─────────────────────────────── */}
      {showForgot && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '32px',
            width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button
              onClick={closeForgot}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', fontSize: '20px',
                cursor: 'pointer', color: '#64748b'
              }}
            >✕</button>

            <h3 style={{ marginBottom: '6px', color: '#1e293b', fontSize: '20px', fontWeight: '700' }}>
              Reset Password
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              {forgotStep === 'email'
                ? 'Enter your registered email address.'
                : `Enter a new password for ${forgotEmail}`}
            </p>

            {forgotError && (
              <div style={{
                background: '#fee2e2', color: '#dc2626', padding: '10px 14px',
                borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
              }}>
                {forgotError}
              </div>
            )}
            {forgotSuccess && (
              <div style={{
                background: '#dcfce7', color: '#166534', padding: '10px 14px',
                borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
              }}>
                {forgotSuccess}
              </div>
            )}

            {forgotStep === 'email' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px', color: '#374151' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      border: '1.5px solid #d1d5db', fontSize: '14px', outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <button
                  onClick={handleForgotEmailSubmit}
                  disabled={forgotLoading}
                  style={{
                    width: '100%', padding: '12px', background: '#4f46e5',
                    color: '#fff', border: 'none', borderRadius: '8px',
                    fontWeight: '600', fontSize: '15px', cursor: 'pointer'
                  }}
                >
                  {forgotLoading ? 'Checking...' : 'Continue'}
                </button>
              </>
            )}

            {forgotStep === 'reset' && (
              <>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px', color: '#374151' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      border: '1.5px solid #d1d5db', fontSize: '14px', outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px', color: '#374151' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Repeat password"
                    value={confirmNew}
                    onChange={(e) => setConfirmNew(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      border: '1.5px solid #d1d5db', fontSize: '14px', outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => { setForgotStep('email'); setForgotError(''); }}
                    style={{
                      flex: 1, padding: '12px', background: '#f1f5f9',
                      color: '#374151', border: 'none', borderRadius: '8px',
                      fontWeight: '600', fontSize: '14px', cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={forgotLoading}
                    style={{
                      flex: 2, padding: '12px', background: '#4f46e5',
                      color: '#fff', border: 'none', borderRadius: '8px',
                      fontWeight: '600', fontSize: '15px', cursor: 'pointer'
                    }}
                  >
                    {forgotLoading ? 'Saving...' : 'Reset Password'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* <footer className="main-footer">
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
            <p className="contact-info">📍 Gujranwala, Pakistan</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 FixIT. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
  );
};

export default Login;