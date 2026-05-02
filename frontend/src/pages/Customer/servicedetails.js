import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../../api/api';
import '../../pages/ServiceDetails.css';

const avatarColors = ['#3b82f6', '#6366f1', '#4f46e5', '#0891b2', '#7c3aed', '#db2777'];

const ServiceDetails = () => {
  const navigate = useNavigate();
  const { serviceName } = useParams();

  const [providers, setProviders]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filters, setFilters]       = useState({
    experience: 'all',
    price: 'all',
    search: ''
  });

  // ── Auth state ────────────────────────────────────────────────
  const token      = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const user       = JSON.parse(localStorage.getItem('user') || '{}');
  const userArea   = user?.area || '';

  // ── Fetch providers ───────────────────────────────────────────
  // Visitors      → fetch ALL approved providers (no area filter)
  // Logged-in + area set → fetch area-filtered providers
  // Logged-in, no area   → fetch all (show banner to set area)
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError('');

        const query = (isLoggedIn && userArea)
          ? `?area=${encodeURIComponent(userArea)}`
          : '';

        const [res, areasRes] = await Promise.all([
          API.get(`/providers${query}`),
          API.get('/areas'),
        ]);
        const all = res.data.providers || [];
        const totalAreas = (areasRes.data.areas || []).map(a => a.name);

        const decodedService = decodeURIComponent(serviceName).toLowerCase().trim();
        const matched = all
          .filter(p => p.category && p.category.name.toLowerCase().trim() === decodedService)
          .map(p => ({
            ...p,
            _allAreasSelected:
              totalAreas.length > 0 &&
              (p.serviceAreas || []).length === totalAreas.length,
          }));
        setProviders(matched);
      } catch (err) {
        setError('Could not load providers. Please retry.');
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, [serviceName, isLoggedIn, userArea]);

  // ── Client-side filters ────────────────────────────────────────
  const filteredProviders = providers.filter((p) => {
    const name = p.user?.name || '';
    if (filters.search && !name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.experience !== 'all' && p.experience < parseInt(filters.experience)) return false;
    if (filters.price === 'low'    && p.charges > 500)                        return false;
    if (filters.price === 'medium' && (p.charges < 500 || p.charges > 1000)) return false;
    if (filters.price === 'high'   && p.charges < 1000)                       return false;
    return true;
  });

  // ── Book Now — requires login ──────────────────────────────────
  const handleBookNow = (providerId) => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', `/book/${encodeURIComponent(serviceName)}/${providerId}`);
      navigate('/login', {
        state: {
          message: 'Please login to book a service.',
          from: `/services/${encodeURIComponent(serviceName)}`
        }
      });
      return;
    }
    navigate(`/book/${encodeURIComponent(serviceName)}/${providerId}`);
  };

  const getInitial = (name = '') => name.charAt(0).toUpperCase() || '?';
  const getColor   = (i)         => avatarColors[i % avatarColors.length];

  // ── Area info banner ──────────────────────────────────────────
  const renderAreaBanner = () => {
    if (!isLoggedIn) {
      return (
        <span style={{
          background: '#f0fdf4', color: '#166534',
          padding: '10px 16px', borderRadius: '10px',
          fontSize: '13px', fontWeight: '600'
        }}>
          🌍 Showing all providers —{' '}
          <Link to="/login" style={{ color: '#166534', textDecoration: 'underline' }}>Login</Link>
          {' '}to filter by your area
        </span>
      );
    }
    if (userArea) {
      return (
        <span style={{
          background: '#eef2ff', color: '#4f46e5',
          padding: '10px 16px', borderRadius: '10px',
          fontSize: '13px', fontWeight: '600'
        }}>
          📍 Area: <strong>{userArea}</strong>
        </span>
      );
    }
    return (
      <span style={{
        background: '#fef9c3', color: '#a16207',
        padding: '10px 16px', borderRadius: '10px',
        fontSize: '13px', fontWeight: '600'
      }}>
        ⚠️ No area set —{' '}
        <Link to="/customer/profile" style={{ color: '#a16207', textDecoration: 'underline' }}>
          Set your area
        </Link>
        {' '}to see nearby providers
      </span>
    );
  };

  return (
    <div className="service-details-page">

      {/* ── Filter Bar ───────────────────────────────────────── */}
      <div className="filters-bar">
        <select
          value={filters.experience}
          onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
        >
          <option value="all">All Experience</option>
          <option value="2">2+ Years</option>
          <option value="5">5+ Years</option>
          <option value="8">8+ Years</option>
          <option value="10">10+ Years</option>
        </select>
        <select
          value={filters.price}
          onChange={(e) => setFilters({ ...filters, price: e.target.value })}
        >
          <option value="all">All Prices</option>
          <option value="low">Up to Rs 500</option>
          <option value="medium">Rs 500 – 1000</option>
          <option value="high">Rs 1000+</option>
        </select>
        {renderAreaBanner()}
      </div>

      {/* ── Providers Section ────────────────────────────────── */}
      <section className="providers-section">
        <h2 style={{ marginBottom: '24px', color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
          {decodeURIComponent(serviceName)} Providers
          {!loading && filteredProviders.length > 0 && (
            <span style={{ color: '#64748b', fontSize: '15px', fontWeight: '500', marginLeft: '10px' }}>
              ({filteredProviders.length} found)
            </span>
          )}
        </h2>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
            <p>Loading providers...</p>
          </div>
        )}

        {!loading && error && (
          <div style={{
            textAlign: 'center', padding: '40px', background: '#fef2f2',
            borderRadius: '12px', color: '#dc2626'
          }}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} style={{
              marginTop: '12px', padding: '8px 20px', background: '#dc2626',
              color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
            }}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredProviders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ marginBottom: '8px', color: '#1e293b' }}>No providers found</h3>
            <p>
              {isLoggedIn && userArea
                ? `No approved ${decodeURIComponent(serviceName)} providers in ${userArea} yet.`
                : `No ${decodeURIComponent(serviceName)} providers available yet.`
              }
            </p>
          </div>
        )}

        {!loading && !error && filteredProviders.length > 0 && (
          <div className="providers-grid">
            {filteredProviders.map((provider, index) => {
              const name   = provider.user?.name  || 'Unknown';
              const skills = provider.skills       || [];
              const areas  = provider.serviceAreas || [];

              return (
                <div key={provider._id} className="provider-card">
                  <div className="provider-header">
                    <div className="provider-avatar" style={{ backgroundColor: getColor(index) }}>
                      {getInitial(name)}
                    </div>
                    <div>
                      <h3>{name}</h3>
                      <p>{provider.category?.name}</p>
                      <span className="verified">✔ Verified</span>
                    </div>
                  </div>

                  {provider.bio && <p className="provider-bio">{provider.bio}</p>}

                  <div className="provider-meta">
                    <span>🏅 {provider.experience || 0} yrs experience</span>
                    <span>📋 {provider.totalBookings || 0} jobs done</span>
                  </div>

                  {areas.length > 0 && (
                    <div style={{ marginBottom: '12px', fontSize: '13px', color: '#64748b' }}>
                      📍 Serves:{' '}
                      {/* If provider selected all available areas, show city name instead of long list */}
                      {provider._allAreasSelected
                        ? 'Gujranwala (All Areas)'
                        : areas.join(', ')}
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div className="skills">
                      {skills.map((s, i) => <span key={i} className="skill">{s}</span>)}
                    </div>
                  )}

                  <div className="provider-footer">
                    <strong>Rs {provider.charges}/visit</strong>
                    <button className="book-btn" onClick={() => handleBookNow(provider._id)}>
                      {isLoggedIn ? 'Book Now →' : '🔒 Login to Book'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
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
            <p className="contact-info">📍 Gujranwala, Pakistan</p>
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