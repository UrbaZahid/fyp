import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import '../../pages/Profile.css';

const CustomerProfile = () => {
  // ─── State ────────────────────────────────────────────────
  const [form, setForm]       = useState({ name: '', phone: '', area: '' });
  const [email, setEmail]     = useState('');
  const [areas, setAreas]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  const [phoneError, setPhoneError] = useState('');

  // ─── Load user data on mount ──────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch fresh user info from API + available areas in parallel
        const [meRes, areasRes] = await Promise.all([
          API.get('/auth/me'),
          API.get('/areas'),
        ]);

        const u = meRes.data.user;
        setForm({
          name:  u.name  || '',
          phone: u.phone || '',
          area:  u.area  || '',
        });
        setEmail(u.email || '');
        setAreas(areasRes.data.areas || []);
      } catch (err) {
        setError('Could not load profile data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ─── Handle input changes ─────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess('');
    setError('');
  };

  // ─── Handle save ──────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    // Phone validation — inline under field
    if (form.phone) {
      const digits = form.phone.replace(/\D/g, '');
      if (!form.phone.startsWith('+92')) {
        setPhoneError('Phone number must start with +92 (Pakistan).');
        return;
      }
      if (digits.length !== 12) {
        setPhoneError('Must be exactly 12 digits (e.g. +923001234567).');
        return;
      }
    }
    setPhoneError('');

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const res = await API.put('/auth/profile', {
        name:  form.name.trim(),
        phone: form.phone.trim(),
        area:  form.area.trim(),
      });

      // ── Update localStorage so navbar/dashboard show new name ──
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const updated = { ...stored, ...res.data.user };
      localStorage.setItem('user', JSON.stringify(updated));

      setSuccess('Profile updated successfully! ✅');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // ─── Avatar initial ───────────────────────────────────────
  const initial = form.name ? form.name.charAt(0).toUpperCase() : '?';

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="dashboard-wrapper">
      <main className="dashboard-content">
        <div className="content-inner">
          <h2>Profile Settings</h2>

          {loading ? (
            <p style={{ color: '#64748b', padding: '40px 0' }}>Loading profile...</p>
          ) : (
            <div className="profile-container">

              {/* ── Avatar Card ──────────────────────────── */}
              <div className="profile-card">
                <div className="avatar-section">
                  <div className="large-avatar">{initial}</div>
                  <div className="avatar-ops">
                    <p style={{ fontWeight: '600', fontSize: '16px', color: '#1e293b' }}>
                      {form.name}
                    </p>
                    <p>{email}</p>
                    <p style={{ marginTop: '4px' }}>
                      📍 {form.area || 'No area set'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Personal Info Card ────────────────────── */}
              <div className="profile-card">
                <h3>Personal Information</h3>

                {/* Success / Error messages */}
                {success && (
                  <div style={{
                    background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                    borderRadius: '8px', padding: '10px 16px', marginBottom: '16px',
                    fontSize: '14px', fontWeight: '600'
                  }}>
                    {success}
                  </div>
                )}
                {error && (
                  <div style={{
                    background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                    borderRadius: '8px', padding: '10px 16px', marginBottom: '16px',
                    fontSize: '14px', fontWeight: '600'
                  }}>
                    {error}
                  </div>
                )}

                <div className="profile-form">
                  <div className="form-row">

                    {/* Full Name */}
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                      />
                    </div>

                    {/* Email — read only */}
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        style={{ cursor: 'not-allowed', opacity: 0.7 }}
                      />
                    </div>
                  </div>

                  <div className="form-row">

                    {/* Phone */}
                    <div className="form-group">
                      <label>
                        Phone Number
                        {phoneError && (
                          <span style={{ color: '#dc2626', fontSize: '12px', fontWeight: '600', marginLeft: '6px' }}>
                            — {phoneError}
                          </span>
                        )}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        placeholder="+923001234567"
                        style={phoneError ? { borderColor: '#dc2626', background: '#fff5f5' } : {}}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (!val.startsWith('+92')) {
                            val = '+92' + val.replace(/^\+?9?2?/, '').replace(/\D/g, '');
                          }
                          const digits = val.slice(3).replace(/\D/g, '').slice(0, 10);
                          val = '+92' + digits;
                          setForm({ ...form, phone: val });
                          setSuccess('');
                          setError('');
                          if (phoneError) setPhoneError('');
                        }}
                      />
                    </div>

                    {/* Area — dropdown from DB */}
                    <div className="form-group">
                      <label>Your Area (Gujranwala)</label>
                      <select
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        style={{
                          padding: '12px', border: '1px solid #e2e8f0',
                          borderRadius: '8px', background: '#f8fafc',
                          outline: 'none', fontSize: '14px', fontFamily: 'inherit'
                        }}
                      >
                        <option value="">-- Select your area --</option>
                        {areas.map((a) => (
                          <option key={a._id} value={a.name}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Save button */}
                  <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;