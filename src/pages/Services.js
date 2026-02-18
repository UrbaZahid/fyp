import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Repair', 'Cleaner', 'Appliance Repair', 'Pest Control'];

  const allServices = [
    { id: 1, title: 'Electrician', desc: 'Electrical repairs, installations, and maintenance', providers: 45, icon: '⚡', rating: 4.8, price: '₹500/hr' },
    { id: 2, title: 'Plumber', desc: 'Plumbing repairs, installations, and maintenance', providers: 38, icon: '💧', rating: 4.7, price: '₹400/hr' },
    { id: 3, title: 'Carpenter', desc: 'Furniture repair, woodwork, and installations', providers: 32, icon: '🔨', rating: 4.9, price: '₹600/hr' },
    { id: 4, title: 'Painter', desc: 'Interior and exterior painting services', providers: 28, icon: '🖌️', rating: 4.6, price: '₹450/hr' },
    { id: 5, title: 'AC Repair', desc: 'Air conditioner repair and maintenance', providers: 22, icon: '❄️', rating: 4.8, price: '₹700/hr' },
    { id: 6, title: 'Cleaner', desc: 'Home and office cleaning services', providers: 55, icon: '✨', rating: 4.5, price: '₹300/hr' },
    { id: 7, title: 'Appliance Repair', desc: 'Repair for home appliances', providers: 18, icon: '🔧', rating: 4.7, price: '₹550/hr' },
    { id: 8, title: 'Pest Control', desc: 'Pest removal and prevention', providers: 15, icon: '🐞', rating: 4.9, price: '₹800/hr' },
  ];

  const filteredServices = selectedCategory === 'All' 
    ? allServices 
    : allServices.filter(s => s.title === selectedCategory);

  return (
    <div className="fixit-container">

      {/* Services Header */}
      <section className="services-header">
        <h1>Browse All Services</h1>
        <p>Find the perfect professional for your needs</p>
      </section>

      {/* Category Filter */}
      <section className="services-content">
        <div className="category-filter">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {filteredServices.map((item) => (
            <div className="service-detail-card" key={item.id}>
              <div className="card-icon-large">{item.icon}</div>
              <h3>{item.title}</h3>
              <p className="card-desc">{item.desc}</p>
              <div className="card-meta">
                <span className="rating">⭐ {item.rating}</span>
                <span className="provider-count">{item.providers} providers</span>
              </div>
              <div className="card-price">{item.price}</div>
              <Link to={`/services/${item.title}`}>
              <button className="book-now-btn">View Providers</button>
            </Link>
            </div>
          ))}
        </div>
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

export default Services;
