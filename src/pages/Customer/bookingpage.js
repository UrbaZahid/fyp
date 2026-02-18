import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/CustomerNavbar'; 
import '../bookingpage.css';

const BookingPage = ({ provider, service, onConfirm, onCancel }) => {
   const navigate = useNavigate(); 

  const handleBack = () => {
    navigate('/services'); 
  };
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    date: '',
    time: '',
    duration: '1',
    notes: ''
  });

  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  // Some slots are unavailable (example)
  const unavailableSlots = ['12:00 PM', '03:00 PM'];

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleTimeSelect = (time) => {
    if (!unavailableSlots.includes(time)) {
      setSelectedTime(time);
      setBookingData({ ...bookingData, time });
    }
  };

  const calculateTotal = () => {
    const hours = parseInt(bookingData.duration) || 1;
    const hourlyRate = provider?.hourlyRate || 500;
    const subtotal = hours * hourlyRate;
    const tax = subtotal * 0.18; // 18% GST
    return {
      subtotal,
      tax,
      total: subtotal + tax
    };
  };

  const isFormValid = () => {
    return (
      bookingData.name &&
      bookingData.email &&
      bookingData.phone &&
      bookingData.address &&
      bookingData.city &&
      bookingData.date &&
      bookingData.time
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setIsSubmitted(true);
      // Send booking request to provider
      setTimeout(() => {
        if (onConfirm) {
          onConfirm({
            ...bookingData,
            provider: provider,
            service: service,
            total: calculateTotal().total,
            status: 'pending'
          });
        }
      }, 2000);
    }
  };

  const prices = calculateTotal();

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

        {/* Success Message */}
        {isSubmitted && (
          <div className="success-message">
            <span className="icon">✅</span>
            <div className="text">
              <h4>Booking Request Sent!</h4>
              <p>Your booking request has been sent to the provider. You'll be notified once they accept.</p>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="booking-grid">
          {/* Left Side - Booking Form */}
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
                      type="text"
                      name="name"
                      value={bookingData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleChange}
                      placeholder="+92 300-1234567"
                      required
                    />
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
                      type="text"
                      name="address"
                      value={bookingData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street, Apartment 4B"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={bookingData.city}
                      onChange={handleChange}
                      placeholder="Lahore"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={bookingData.zipCode}
                      onChange={handleChange}
                      placeholder="54000"
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
                      type="date"
                      name="date"
                      value={bookingData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Estimated Duration</label>
                    <select
                      name="duration"
                      value={bookingData.duration}
                      onChange={handleChange}
                    >
                      <option value="1">1 hour</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                      <option value="4">4 hours</option>
                      <option value="5">5+ hours</option>
                    </select>
                  </div>
                </div>

                <div className="form-field" style={{ marginTop: '16px' }}>
                  <label>Select Time Slot *</label>
                  <div className="time-slots">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot}
                        className={`time-slot ${
                          selectedTime === slot ? 'selected' : ''
                        } ${unavailableSlots.includes(slot) ? 'unavailable' : ''}`}
                        onClick={() => handleTimeSelect(slot)}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="form-section">
                <h3>📝 Additional Details</h3>
                <div className="form-field">
                  <label>Special Instructions (Optional)</label>
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleChange}
                    placeholder="Please describe the issue or any special requirements..."
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="submit"
                className="confirm-booking-btn"
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitted}
              >
                {isSubmitted ? '✓ Request Sent' : 'Send Booking Request →'}
              </button>

              <button
                type="button"
                className="cancel-booking-btn"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
            </form>
          </div>

          
        </div>
      </div>

      {/* Footer */}
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

export default BookingPage;