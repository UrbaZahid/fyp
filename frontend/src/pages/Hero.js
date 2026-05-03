import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';
import Footer from "../components/Footer";
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ providers: 0, bookings: 0, customers: 0 });
  const [loadingCats, setLoadingCats] = useState(true);

  const iconMap = {
    electrician: '⚡', plumber: '💧', carpenter: '🔨', painter: '🖌️',
    ac: '❄️', clean: '✨', appliance: '🔧', pest: '🐞', default: '🛠️',
  };

  const getIcon = (name = '') => {
    const lower = name.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lower.includes(key)) return icon;
    }
    return iconMap.default;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, provRes, bookingsRes] = await Promise.all([
          API.get('/categories'),
          API.get('/providers'),
          // Fetch bookings with completed status — public providers endpoint already works
          // We count completed bookings client-side from the admin endpoint with fallback
          API.get('/admin/public-stats').catch(() => null),
        ]);

        const cats        = catRes.data.categories || [];
        const provs       = provRes.data.providers || [];
        const publicStats = bookingsRes?.data || null;

        // Count providers per category for the service cards
        const countMap = {};
        provs.forEach(p => {
          const name = p.category?.name;
          if (name) countMap[name] = (countMap[name] || 0) + 1;
        });

        setCategories(cats.map(c => ({
          ...c,
          providerCount: countMap[c.name] || 0,
          icon: c.icon || getIcon(c.name),
        })));

        setStats({
          providers: publicStats?.providers  ?? provs.length,
          bookings:  publicStats?.completedBookings ?? 0,
          customers: publicStats?.customers  ?? 0,
        });
      } catch {
        // keep zeros silently
      } finally {
        setLoadingCats(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="fixit-container">

      {/* ── Hero Section ── */}
      <header className="hero-section">
        <div className="trust-pill">★ Trusted Service Platform in Gujranwala</div>
        <h1 className="hero-title">
          Find Trusted <span className="grad-text">Home Service</span><br />Professionals
        </h1>
        <p className="hero-subtitle">
          Book verified electricians, plumbers, carpenters and more. Quality service at your doorstep, guaranteed.
        </p>
        <div className="hero-btns">
          <button className="primary-btn" onClick={() => navigate('/services')}>Explore Services →</button>
           {!user && (
          <button className="secondary-btn" onClick={() => navigate('/register')}>Join as Provider</button>
           )}
        </div>

        <div className="hero-stats">
          <div className="stat-box">
            <strong>{stats.providers > 0 ? `${stats.providers}+` : '—'}</strong>
            <p>Verified Providers</p>
          </div>
          <div className="stat-box border-center">
            <strong>{stats.bookings > 0 ? `${stats.bookings}+` : '0'}</strong>
            <p>Bookings Completed</p>
          </div>
          <div className="stat-box">
            <strong>{stats.customers > 0 ? `${stats.customers}+` : '0'}</strong>
            <p>Registered Customers</p>
          </div>
        </div>
      </header>

      {/* ── Categories ── */}
      <section className="categories-section">
        <h2 className="cat-title">Our Service Categories</h2>
        <p className="cat-subtitle">Choose from a wide range of home services. All providers are verified.</p>
        <div className="services-grid">
          {loadingCats ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '30px', color: '#64748b' }}>
              Loading services...
            </div>
          ) : categories.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '30px', color: '#64748b' }}>
              No services available yet.
            </div>
          ) : (
            categories.map(item => (
              <div className="service-card" key={item._id}>
                <div className="card-icon">{item.icon}</div>
                <h3>{item.name}</h3>
                <p className="card-desc">{item.description || 'Professional service at your doorstep'}</p>
                <p className="provider-count">{item.providerCount} provider{item.providerCount !== 1 ? 's' : ''} available</p>
                <button className="view-providers-btn" onClick={() => navigate(`/services/${item.name}`)}>
                  View Providers →
                </button>
              </div>
            ))
          )}
        </div>
        <button className="view-all-btn" onClick={() => navigate('/services')}>View All Services →</button>
      </section>

      {/* ── How It Works ── */}
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
            <p>Browse services and find the right provider for your needs.</p>
          </div>
          <div className="step-divider"></div>
          <div className="step-item">
            <div className="step-icon-wrapper">
              <span className="step-number">02</span>
              <div className="step-icon">🕒</div>
            </div>
            <h3>Book & Schedule</h3>
            <p>Choose your preferred date and time. Confirm your booking.</p>
          </div>
          <div className="step-divider"></div>
          <div className="step-item">
            <div className="step-icon-wrapper">
              <span className="step-number">03</span>
              <div className="step-icon">✅</div>
            </div>
            <h3>Get Service</h3>
            <p>Our verified professional arrives and completes the job.</p>
          </div>
        </div>
      </section>

      {/* ── Why Choose (condensed) ── */}
      <section className={`why-choose ${user ? 'why-choose-loggedin' : ''}`}>
        <h2 className="why-title">Why Choose FixIT</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feat-icon">🛡️</div>
            <h3>Verified Providers</h3>
            <p>All providers undergo background verification before listing.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon">⏰</div>
            <h3>On-Time Service</h3>
            <p>Punctual service delivery, every time.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon">💰</div>
            <h3>Transparent Pricing</h3>
            <p>No hidden charges. See full pricing before you book.</p>
          </div>
          <div className="feature-card">
            <div className="feat-icon">📱</div>
            <h3>Easy Booking</h3>
            <p>Book, track and manage your services all in one place.</p>
          </div>
        </div>
      </section>

    
      {/* ── CTA ── */}
      {!user && (
      <section className="cta-get-started">
        <h2>Ready to Get Started?</h2>
        <p>Join customers or become a service provider in Gujranwala</p>
        <div className="cta-flex-btns">
          <button className="customer-reg-btn" onClick={() => navigate('/register')}>👥 Register as Customer</button>
          <button className="provider-reg-btn" onClick={() => navigate('/register')}>💼 Become a Provider</button>
        </div>
      </section>
    )}
     <Footer />
    </div>
  );
};

export default Hero;