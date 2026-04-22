import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar'; 
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  const services = [
    { title: 'Electrician', desc: 'Electrical repairs, installations, and maintenance', providers: 45, icon: '⚡' },
    { title: 'Plumber', desc: 'Plumbing repairs, installations, and maintenance', providers: 38, icon: '💧' },
    { title: 'Carpenter', desc: 'Furniture repair, woodwork, and installations', providers: 32, icon: '🔨' },
    { title: 'Painter', desc: 'Interior and exterior painting services', providers: 28, icon: '🖌️' },
    { title: 'AC Repair', desc: 'Air conditioner repair and maintenance', providers: 22, icon: '❄️' },
    { title: 'Cleaner', desc: 'Home and office cleaning services', providers: 55, icon: '✨' },
    { title: 'Appliance Repair', desc: 'Repair for home appliances', providers: 18, icon: '🔧' },
    { title: 'Pest Control', desc: 'Pest removal and prevention', providers: 15, icon: '🐞' },
  ];

  return (
    <div className="fixit-container">

      {/* Hero Section */}
      <header className="hero-section">
        <div className="trust-pill">★ Trusted by 10,000+ customers</div>
        <h1 className="hero-title">
          Find Trusted <span className="grad-text">Home Service</span> <br /> Professionals
        </h1>
        <p className="hero-subtitle">
          Book verified electricians, plumbers, carpenters and more. Quality service at your doorstep, guaranteed.
        </p>
        <div className="hero-btns">
          <button className="primary-btn" onClick={() => navigate('/services')}>
            Explore Services →
          </button>
          <button className="secondary-btn" onClick={() => navigate('/register')}>
            Join as Provider
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-box"><strong>85+</strong><p>Verified Providers</p></div>
          <div className="stat-box border-center"><strong>3400+</strong><p>Bookings Completed</p></div>
          <div className="stat-box"><strong>4.8</strong><p>Average Rating</p></div>
        </div>
      </header>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="cat-title">Our Service Categories</h2>
        <p className="cat-subtitle">Choose from a wide range of home services. All our providers are verified and rated by customers.</p>
        <div className="services-grid">
          {services.map((item, index) => (
            <div className="service-card" key={index}>
              <div className="card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p className="card-desc">{item.desc}</p>
              <p className="provider-count">{item.providers} providers available</p>
               <button 
                  className="view-providers-btn"
                  onClick={() => navigate(`/services/${item.title}`)}>
                  View Providers →
               </button>
            </div>
          ))}
        </div>
        <button className="view-all-btn" onClick={() => navigate('/services')}>
          View All Services →
        </button>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-heading">How It Works</h2>
        <p className="section-subheading">Book a service in just 3 simple steps</p>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-icon-wrapper">
              <span className="step-number">01</span>
              <div className="step-icon">🔍</div>
            </div>
            <h3>Search & Select</h3>
            <p>Browse services and find the right provider for your needs based on ratings and reviews.</p>
          </div>
          <div className="step-divider"></div>
          <div className="step-item">
            <div className="step-icon-wrapper">
              <span className="step-number">02</span>
              <div className="step-icon">🕒</div>
            </div>
            <h3>Book & Schedule</h3>
            <p>Choose your preferred date and time. Confirm your booking with secure online payment.</p>
          </div>
          <div className="step-divider"></div>
          <div className="step-item">
            <div className="step-icon-wrapper">
              <span className="step-number">03</span>
              <div className="step-icon">✅</div>
            </div>
            <h3>Get Service</h3>
            <p>Our verified professional arrives at your doorstep and completes the service.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-choose">
        <h2 className="why-title">Why Choose FixIT</h2>
        <p className="why-subtitle">We ensure quality service with verified professionals</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feat-icon">🛡️</div>
            <h3>Verified Providers</h3>
            <p>All service providers undergo background verification</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon">⭐</div>
            <h3>Quality Assured</h3>
            <p>Rated and reviewed by real customers</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon">⏰</div>
            <h3>On-Time Service</h3>
            <p>Punctual service delivery guaranteed</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon">💰</div>
            <h3>Best Prices</h3>
            <p>Transparent pricing with no hidden charges</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-get-started">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of satisfied customers or become a service provider</p>
        <div className="cta-flex-btns">
          <button className="customer-reg-btn" onClick={() => navigate('/register')}>
            👥 Register as Customer
          </button>
          <button className="provider-reg-btn" onClick={() => navigate('/register')}>
            💼 Become a Provider
          </button>
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

export default Hero;
