// src/pages/Register.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import './Register.css';

const Register = () => {
  const [role, setRole]             = useState('Customer');
  const navigate                    = useNavigate();
  const [areas, setAreas]           = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    area:          '',
    selectedAreas: [],
    category:      '',
    skills:        '',
    experience:    '',
    charges:       '',
  });

  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areaRes, catRes] = await Promise.all([
          API.get('/areas'),
          API.get('/categories'),
        ]);
        setAreas(areaRes.data.areas         || []);
        setCategories(catRes.data.categories || []);
      } catch (e) {
        console.error('Could not load data');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleProviderArea = (areaName) => {
    const current = formData.selectedAreas;
    if (current.includes(areaName)) {
      setFormData({ ...formData, selectedAreas: current.filter(a => a !== areaName) });
    } else {
      setFormData({ ...formData, selectedAreas: [...current, areaName] });
    }
  };

  const toggleAll = () => {
    if (formData.selectedAreas.length === areas.length) {
      setFormData({ ...formData, selectedAreas: [] });
    } else {
      setFormData({ ...formData, selectedAreas: areas.map(a => a.name) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword)
      return setError('Passwords do not match!');
    if (role === 'Customer' && !formData.area)
      return setError('Please select your area.');
    if (role === 'Provider' && formData.selectedAreas.length === 0)
      return setError('Please select at least one service area.');
    if (role === 'Provider' && !formData.category)
      return setError('Please select your service category.');

    setLoading(true);
    try {
      const payload = {
        name:     formData.name,
        email:    formData.email,
        phone:    formData.phone,
        password: formData.password,
        role:     role.toLowerCase(),
      };

      if (role === 'Customer') {
        payload.area = formData.area;
      } else {
        payload.serviceAreas = formData.selectedAreas;
        payload.category     = formData.category;
        payload.skills       = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
        payload.experience   = Number(formData.experience) || 0;
        payload.charges      = Number(formData.charges)    || 0;
      }

       await API.post('/auth/register', payload);

      if (role === 'Provider') {
        setSuccess('Account created! Admin approval ke baad login kar sakte hain.');
      } else {
        setSuccess('Account successfully bana! Ab login karo...');
        setTimeout(() => navigate('/login'), 2000);
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const allSelected = areas.length > 0 && formData.selectedAreas.length === areas.length;

  return (
    <div className="fixit-container">
      <div className="register-page">
        <div className="register-card">
          <h2>Create Account</h2>
          <p className="subtitle">Join FixIT today</p>

          {error   && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Role Selection */}
          <div className="register-as-section">
            <p className="label">Register as</p>
            <div className="role-cards">
              <div className={`role-card ${role === 'Customer' ? 'active' : ''}`} onClick={() => setRole('Customer')}>
                <div className="role-icon-box blue">👤</div>
                <div className="role-text"><strong>Customer</strong><span>Book services</span></div>
              </div>
              <div className={`role-card ${role === 'Provider' ? 'active' : ''}`} onClick={() => setRole('Provider')}>
                <div className="role-icon-box gray">💼</div>
                <div className="role-text"><strong>Provider</strong><span>Offer services</span></div>
              </div>
            </div>
          </div>

          {role === 'Provider' && (
            <div className="admin-warning">
              <span className="warning-icon">⚠️</span>
              <div className="warning-content">
                <strong>Admin Approval Required</strong>
                <p>Provider accounts require admin approval before accepting bookings.</p>
              </div>
            </div>
          )}

          <form className="register-form" onSubmit={handleSubmit}>

            {/* Common Fields */}
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="John Doe"
                value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="+92 300-1234567"
                value={formData.phone} onChange={handleChange} required />
            </div>

            {/* Customer — single area */}
            {role === 'Customer' && (
              <div className="input-group">
                <label>Your Area (Gujranwala)</label>
                <select name="area" value={formData.area} onChange={handleChange} required>
                  <option value="">-- Select your area --</option>
                  {areas.map((a) => (
                    <option key={a._id} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Provider — extra fields */}
            {role === 'Provider' && (
              <>
                {/* Category */}
                <div className="input-group">
                  <label>Service Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">-- Select your service --</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Skills */}
                <div className="input-group">
                  <label>Skills <span className="hint">(comma separated)</span></label>
                  <input type="text" name="skills"
                    placeholder="e.g. Wiring, Fan installation, Short circuit repair"
                    value={formData.skills} onChange={handleChange} />
                </div>

                {/* Experience + Charges */}
                <div className="two-col-grid">
                  <div className="input-group">
                    <label>Experience (years)</label>
                    <input type="number" name="experience" placeholder="e.g. 5"
                      value={formData.experience} onChange={handleChange} min="0" />
                  </div>
                  <div className="input-group">
                    <label>Charges/visit (Rs.)</label>
                    <input type="number" name="charges" placeholder="e.g. 1500"
                      value={formData.charges} onChange={handleChange} min="0" />
                  </div>
                </div>

                {/* Service Areas */}
                {areas.length > 0 && (
                  <div className="input-group">
                    <label>Service Areas <span className="hint">(select all that apply)</span></label>
                    <div className="area-chips-box">
                      <button type="button"
                        className={`area-chip all-chip ${allSelected ? 'selected' : ''}`}
                        onClick={toggleAll}>
                        🌍 All Areas
                      </button>
                      {areas.map((a) => (
                        <button type="button" key={a._id}
                          className={`area-chip ${formData.selectedAreas.includes(a.name) ? 'selected' : ''}`}
                          onClick={() => toggleProviderArea(a.name)}>
                          📍 {a.name}
                        </button>
                      ))}
                    </div>
                    {formData.selectedAreas.length > 0 && (
                      <p className="areas-selected-count">
                        ✅ {formData.selectedAreas.length} area(s) selected
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Password */}
            <div className="input-group">
              <label>Password</label>
              <div className="pass-input">
                <input type="password" name="password" placeholder="••••••••"
                  value={formData.password} onChange={handleChange} required />
                <span className="eye-btn">👁️</span>
              </div>
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="••••••••"
                value={formData.confirmPassword} onChange={handleChange} required />
            </div>

            <button type="submit" className="create-acc-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="bottom-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

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