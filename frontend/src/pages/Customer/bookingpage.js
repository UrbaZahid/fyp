// src/pages/Customer/bookingpage.js

import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../../api/api';
import '../bookingpage.css';

const BookingPage = () => {
  const navigate    = useNavigate();
  const { providerId } = useParams();

  const [bookingData, setBookingData] = useState({
    name:     '',
    email:    '',
    phone:    '',
    address:  '',
    city:     '',
    date:     '',
    time:     '',
    duration: '1',
    notes:    ''
  });

  const [fieldErrors, setFieldErrors]   = useState({});
  const [isSubmitted, setIsSubmitted]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
  ];
  const unavailableSlots = ['12:00 PM', '03:00 PM'];

  // ── Phone auto-format: always starts with +92, max 12 digits total ──
  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('+92')) {
      val = '+92' + val.replace(/^\+?9?2?/, '').replace(/\D/g, '');
    }
    const digits = val.slice(3).replace(/\D/g, '').slice(0, 10);
    val = '+92' + digits;
    setBookingData(prev => ({ ...prev, phone: val }));
    // clear inline error as user types
    if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: '' }));
  };

  const handleChange = (e) => {
    setBookingData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name])
      setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  // ── Validate phone inline ──
  const validatePhone = () => {
    const digits = bookingData.phone.replace(/\D/g, '');
    if (!bookingData.phone.startsWith('+92')) {
      return 'Phone number must start with +92 (Pakistan).';
    }
    if (digits.length !== 12) {
      return 'Phone number must be exactly 12 digits (e.g. +923001234567).';
    }
    return '';
  };

  const handlePhoneBlur = () => {
    const err = validatePhone();
    if (err) setFieldErrors(prev => ({ ...prev, phone: err }));
  };

  const isFormValid = () =>
    bookingData.name && bookingData.email && bookingData.phone &&
    bookingData.address && bookingData.city &&
    bookingData.date && bookingData.time && !validatePhone();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run all inline validations before submit
    const phoneErr = validatePhone();
    if (phoneErr) {
      setFieldErrors(prev => ({ ...prev, phone: phoneErr }));
      return;
    }
    if (!isFormValid()) return;

    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    setLoading(true);
    setError('');

    try {
      await API.post('/bookings', {
        providerId,
        customerName:  bookingData.name,
        customerEmail: bookingData.email,
        customerPhone: bookingData.phone,
        address:       bookingData.address,
        city:          bookingData.city,
        date:          bookingData.date,
        time:          bookingData.time,
        duration:      bookingData.duration,
        notes:         bookingData.notes,
      });

      setIsSubmitted(true);
      setTimeout(() => navigate('/customer/bookings'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">

        {/* Progress Steps */}
        <div className="booking-progress">
          <div className="progress-step">
            <div className="step-circle completed">✓</div>
            <span className="step-label">Select Provider</span>
          </div>
          <div className="progress-divider"></div>
          <div className="progress-step">
            <div className="step-circle active">2</div>
            <span className="step-label active">Booking Details</span>
          </div>
          <div className="progress-divider"></div>
          <div className="progress-step">
            <div className="step-circle">3</div>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        {/* Success */}
        {isSubmitted && (
          <div className="success-message">
            <span className="icon">✅</span>
            <div className="text">
              <h4>Booking Request Sent!</h4>
              <p>Redirecting to My Bookings...</p>
            </div>
          </div>
        )}

        {/* Top-level error (server errors only) */}
        {error && (
          <div className="booking-top-error">{error}</div>
        )}

        {/* Form */}
        {!isSubmitted && (
          <div className="booking-grid">
            <div className="booking-form-section">
              <h2 className="section-title">Complete Your Booking</h2>

              <form onSubmit={handleSubmit}>

                {/* Personal Information */}
                <div className="form-section">
                  <h3>👤 Personal Information</h3>
                  <div className="form-grid">

                    <div className="form-field">
                      <label>Full Name *</label>
                      <input
                        type="text" name="name"
                        value={bookingData.name}
                        onChange={handleChange}
                        placeholder="John Doe" required
                        className={fieldErrors.name ? 'input-error' : ''}
                      />
                    </div>

                    <div className="form-field">
                      <label>Email Address *</label>
                      <input
                        type="email" name="email"
                        value={bookingData.email}
                        onChange={handleChange}
                        placeholder="john@example.com" required
                        className={fieldErrors.email ? 'input-error' : ''}
                      />
                    </div>

                    {/* Phone — inline error below label */}
                    <div className="form-field full-width">
                      <label>
                        Phone Number *
                        {fieldErrors.phone && (
                          <span className="field-error-msg">
                            &nbsp;— {fieldErrors.phone}
                          </span>
                        )}
                      </label>
                      <input
                        type="tel" name="phone"
                        value={bookingData.phone}
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneBlur}
                        placeholder="+923001234567"
                        required
                        className={fieldErrors.phone ? 'input-error' : ''}
                      />
                      <span className="field-hint">Format: +92 followed by 10 digits</span>
                    </div>

                  </div>
                </div>

                {/* Service Location */}
                <div className="form-section">
                  <h3>📍 Service Location</h3>
                  <div className="form-grid">
                    <div className="form-field full-width">
                      <label>Street Address *</label>
                      <input
                        type="text" name="address"
                        value={bookingData.address}
                        onChange={handleChange}
                        placeholder="123 Main Street" required
                      />
                    </div>
                    <div className="form-field">
                      <label>City *</label>
                      <input
                        type="text" name="city"
                        value={bookingData.city}
                        onChange={handleChange}
                        placeholder="Gujranwala" required
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="form-section">
                  <h3>📅 Schedule Your Service</h3>
                  <div className="form-grid">

                    <div className="form-field">
                      <label>Select Date *</label>
                      <input
                        type="date" name="date"
                        value={bookingData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label>Estimated Duration</label>
                      <select name="duration" value={bookingData.duration} onChange={handleChange}>
                        <option value="1">1 hour</option>
                        <option value="2">2 hours</option>
                        <option value="3">3 hours</option>
                        <option value="4">4 hours</option>
                        <option value="5">5+ hours</option>
                      </select>
                    </div>

                    {/* Time slot — single dropdown */}
                    <div className="form-field full-width">
                      <label>
                        Select Time Slot *
                        {fieldErrors.time && (
                          <span className="field-error-msg">&nbsp;— {fieldErrors.time}</span>
                        )}
                      </label>
                      <select
                        name="time"
                        value={bookingData.time}
                        onChange={(e) => {
                          handleChange(e);
                          if (fieldErrors.time)
                            setFieldErrors(prev => ({ ...prev, time: '' }));
                        }}
                        required
                        className={fieldErrors.time ? 'input-error' : ''}
                      >
                        <option value="">-- Choose a time slot --</option>
                        {timeSlots.map(slot => (
                          <option
                            key={slot}
                            value={slot}
                            disabled={unavailableSlots.includes(slot)}
                          >
                            {slot}{unavailableSlots.includes(slot) ? ' (Unavailable)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>

                {/* Notes */}
                <div className="form-section">
                  <h3>📝 Additional Details</h3>
                  <div className="form-field">
                    <label>Special Instructions (Optional)</label>
                    <textarea
                      name="notes"
                      value={bookingData.notes}
                      onChange={handleChange}
                      placeholder="Please describe the issue or any special requirements..."
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="form-actions">
                  <button
                    type="submit"
                    className="confirm-booking-btn"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Booking Request →'}
                  </button>
                  <button
                    type="button"
                    className="cancel-booking-btn"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo-area light">
              <div className="logo-box">🔧</div>
              <span className="logo-name">FixIT</span>
            </div>
            <p>Connecting you with trusted service professionals.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 FixIT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BookingPage;