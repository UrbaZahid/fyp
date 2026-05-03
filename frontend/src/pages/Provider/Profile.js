
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/api';
import '../../pages/ProviderProfile.css';

const ProviderProfile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [form, setForm]     = useState({
    skills: '', experience: '', charges: '', bio: '', serviceAreas: ''
  });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');

  // Provider profile fetch karo
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/providers/me/profile');
        const p = data.provider;
        setForm({
          skills:       p.skills?.join(', ') || '',
          experience:   p.experience || '',
          charges:      p.charges || '',
          bio:          p.bio || '',
          serviceAreas: p.serviceAreas?.join(', ') || '',
        });
      } catch (err) {
        // Profile nahi bani abhi
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await API.put('/providers/profile', {
        skills:       form.skills.split(',').map(s => s.trim()).filter(Boolean),
        experience:   Number(form.experience),
        charges:      Number(form.charges),
        bio:          form.bio,
        serviceAreas: form.serviceAreas.split(',').map(s => s.trim()).filter(Boolean),
      });
      setSuccess('Profile updated successfully! ✅');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="provider-layout">
      <Sidebar role="provider" />
      <main className="p-main">
        <div className="p-content-inner">
          <h2>My Profile</h2>

          {/* Basic Info — read only */}
          <div className="profile-section-card">
            <h3>Basic Information</h3>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          {/* Editable Info */}
          <div className="profile-section-card">
            <h3>Service Information</h3>

            {error   && <p style={{ color: '#dc2626', marginBottom: '12px' }}>{error}</p>}
            {success && <p style={{ color: '#059669', marginBottom: '12px' }}>{success}</p>}

            {loading ? <p style={{ color: '#6b7280' }}>Loading...</p> : (
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>Skills (comma separated)</label>
                  <input
                    type="text" name="skills"
                    value={form.skills} onChange={handleChange}
                    placeholder="Wiring, Fan installation, Short circuit repair"
                  />
                </div>
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input
                    type="number" name="experience"
                    value={form.experience} onChange={handleChange}
                    placeholder="5"
                  />
                </div>
                <div className="form-group">
                  <label>Charges per visit (Rs.)</label>
                  <input
                    type="number" name="charges"
                    value={form.charges} onChange={handleChange}
                    placeholder="1500"
                  />
                </div>
                <div className="form-group">
                  <label>Service Areas (comma separated)</label>
                  <input
                    type="text" name="serviceAreas"
                    value={form.serviceAreas} onChange={handleChange}
                    placeholder="Lahore, Rawalpindi"
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={form.bio} onChange={handleChange}
                    placeholder="Tell customers about yourself..."
                  />
                </div>
                <button type="submit" className="accept-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderProfile;