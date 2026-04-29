import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import './Services.css';

const Services = () => {
  const [categories, setCategories]     = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  // Backend se categories fetch karo
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data.categories);
      } catch (err) {
        setError('Could not load services. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Filter logic
  const filteredCategories = selectedCategory === 'All'
    ? categories
    : categories.filter(c => c.name === selectedCategory);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', fontSize: '16px', color: '#6b7280' }}>
      Loading services...
    </div>
  );

  return (
    <div className="fixit-container">

      {/* Header */}
      <section className="services-header">
        <h1>Browse All Services</h1>
        <p>Find the perfect professional for your needs</p>
      </section>

      {error && (
        <div style={{
          textAlign: 'center', color: '#dc2626',
          background: '#fee2e2', padding: '12px',
          borderRadius: '8px', margin: '0 8% 20px'
        }}>
          {error}
        </div>
      )}

      <section className="services-content">

        {/* Category Filter Buttons */}
        <div className="category-filter">
          <button
            className={`filter-btn ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`filter-btn ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
            <p style={{ fontSize: '48px' }}>🔧</p>
            <p>No services found. Admin ne abhi koi service add nahi ki.</p>
          </div>
        ) : (
          <div className="services-grid">
            {filteredCategories.map((item) => (
              <div className="service-detail-card" key={item._id}>
                <div className="card-icon-large">{item.icon || '🔧'}</div>
                <h3>{item.name}</h3>
                <p className="card-desc">{item.description || 'Professional service at your doorstep'}</p>
                <Link to={`/services/${item.name}`}>
                  <button className="book-now-btn">View Providers</button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
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

export default Services;
