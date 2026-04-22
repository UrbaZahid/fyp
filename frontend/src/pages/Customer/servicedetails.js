import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../pages/ServiceDetails.css';

const ServiceDetails = () => {
  const navigate = useNavigate();
  const { serviceName } = useParams();

  const [filters, setFilters] = useState({
    experience: 'all',
    price: 'all',
    search: ''
  });

  // Dummy providers data
  const providers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      category: serviceName,
      bio: 'Certified professional with years of experience.',
      experience: 8,
      hourlyRate: 500,
      completedJobs: 230,
      skills: ['Wiring', 'Repairs', 'Installation'],
      verified: true,
      initial: 'R',
      color: '#3b82f6'
    },
    {
      id: 2,
      name: 'Suresh Patel',
      category: serviceName,
      bio: 'Reliable and punctual service provider.',
      experience: 10,
      hourlyRate: 650,
      completedJobs: 310,
      skills: ['Emergency Repairs', 'Maintenance'],
      verified: true,
      initial: 'S',
      color: '#6366f1'
    },
    {
      id: 3,
      name: 'Amit Singh',
      category: serviceName,
      bio: 'Customer satisfaction is my top priority.',
      experience: 6,
      hourlyRate: 450,
      completedJobs: 185,
      skills: ['Troubleshooting', 'Installations'],
      verified: true,
      initial: 'A',
      color: '#4f46e5'
    }
  ];

  const filteredProviders = providers.filter(p => {
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.experience !== 'all' && p.experience < parseInt(filters.experience)) {
      return false;
    }
    if (filters.price === 'low' && p.hourlyRate > 500) return false;
    if (filters.price === 'medium' && (p.hourlyRate < 500 || p.hourlyRate > 700)) return false;
    if (filters.price === 'high' && p.hourlyRate < 700) return false;
    return true;
  });

  return (
    <div className="service-details-page">
      {/* Filters */}
      <div className="filters-bar">
       

        <select
          value={filters.experience}
          onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
        >
          <option value="all">All Experience</option>
          <option value="5">5+ Years</option>
          <option value="8">8+ Years</option>
          <option value="10">10+ Years</option>
        </select>

        <select
          value={filters.price}
          onChange={(e) => setFilters({ ...filters, price: e.target.value })}
        >
          <option value="all">All Prices</option>
          <option value="low">Up to ₹500</option>
          <option value="medium">₹500–700</option>
          <option value="high">₹700+</option>
        </select>
      </div>

      {/* Providers */}
      <section className="providers-section">
        {filteredProviders.length === 0 && (
          <p>No providers found</p>
        )}

        <div className="providers-grid">
          {filteredProviders.map(provider => (
            <div key={provider.id} className="provider-card">
              <div className="provider-header">
                <div
                  className="provider-avatar"
                  style={{ backgroundColor: provider.color }}
                >
                  {provider.initial}
                </div>

                <div>
                  <h3>{provider.name}</h3>
                  <p>{provider.category}</p>
                  {provider.verified && <span className="verified">✔ Verified</span>}
                </div>
              </div>

              <p className="provider-bio">{provider.bio}</p>

              <div className="provider-meta">
                <span>{provider.experience} yrs experience</span>
                <span>{provider.completedJobs} jobs done</span>
              </div>

              <div className="skills">
                {provider.skills.map((s, i) => (
                  <span key={i} className="skill">{s}</span>
                ))}
              </div>

              <div className="provider-footer">
                <strong>₹{provider.hourlyRate}/hr</strong>
                <button
                  className="book-btn"
                  onClick={() =>
                    navigate(`/book/${serviceName}/${provider.id}`)
                  }
                >
                  Book Now →
                </button>
              </div>
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

export default ServiceDetails;
