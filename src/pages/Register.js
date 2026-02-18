import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [role, setRole] = useState('Customer');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Navigate based on role after registration
    if (role === 'Customer') {
      navigate('/customer/dashboard');
    } else if (role === 'Provider') {
      navigate('/provider/dashboard');
    }
  };

  return (
    <div className="fixit-container">

      {/* Register Form Section */}
      <div className="register-page">
        <div className="register-card">
          <h2>Create Account</h2>
          <p className="subtitle">Join FixIT today</p>

          <div className="register-as-section">
            <p className="label">Register as</p>
            <div className="role-cards">
              <div 
                className={`role-card ${role === 'Customer' ? 'active' : ''}`}
                onClick={() => setRole('Customer')}
              >
                <div className="role-icon-box blue">👤</div>
                <div className="role-text">
                  <strong>Customer</strong>
                  <span>Book services</span>
                </div>
              </div>

              <div 
                className={`role-card ${role === 'Provider' ? 'active' : ''}`}
                onClick={() => setRole('Provider')}
              >
                <div className="role-icon-box gray">💼</div>
                <div className="role-text">
                  <strong>Provider</strong>
                  <span>Offer services</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Admin Approval Message */}
          {role === 'Provider' && (
            <div className="admin-warning">
              <span className="warning-icon">⚠️</span>
              <div className="warning-content">
                <strong>Admin Approval Required</strong>
                <p>Service provider accounts require admin approval before you can start accepting bookings.</p>
              </div>
            </div>
          )}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" required />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" required />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+92 300-1234567" required />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="pass-input">
                <input type="password" placeholder="••••••••" required />
                <span className="eye-btn">👁️</span>
              </div>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            <button type="submit" className="create-acc-btn">Create Account</button>
          </form>

          <p className="bottom-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Footer Section */}
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
            <h4>Contact Us</h4>
            <p className="contact-info">📧 support@fixit.com</p>
            <p className="contact-info">📞 +92 300-1234567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 FixIT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Register;
