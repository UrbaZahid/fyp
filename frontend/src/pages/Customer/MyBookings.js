
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import './MyBookings.css';
import CustomerNavbar from '../../components/CustomerNavbar';
import Sidebar from '../../components/Sidebar';


const MyBookingsEnhanced = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);

  const allBookings = [
    { 
      id: 1, 
      name: 'Rajesh Kumar', 
      service: 'Electrician', 
      date: '2024-01-15', 
      time: '10:00 AM', 
      address: '123 Main Street, Downtown', 
      price: '₹1,500', 
      status: 'Completed', 
      payment: 'Paid', 
      notes: 'Fix electrical wiring in bedroom', 
      initial: 'R', 
      color: '#3b82f6',
      canMarkComplete: false,
      isPaid: true
    },
    { 
      id: 2, 
      name: 'Suresh Patel', 
      service: 'Plumber', 
      date: '2024-01-20', 
      time: '02:00 PM', 
      address: '123 Main Street, Downtown', 
      price: '₹900', 
      status: 'Accepted', 
      payment: 'Unpaid', 
      notes: 'Bathroom leak repair', 
      initial: 'S', 
      color: '#6366f1', 
      hasActions: true,
      canMarkComplete: true,
      isPaid: false,
      acceptedAt: new Date().toISOString()
    },
    { 
      id: 3, 
      name: 'Amit Singh', 
      service: 'Carpenter', 
      date: '2024-01-22', 
      time: '11:00 AM', 
      address: '456 Oak Avenue, Andheri', 
      price: '₹2,400', 
      status: 'Pending', 
      payment: 'Unpaid', 
      notes: 'Kitchen cabinet installation', 
      initial: 'A', 
      color: '#4f46e5',
      canMarkComplete: false,
      isPaid: false
    },
  ];

  const [bookings, setBookings] = useState(allBookings);

  const handleMarkAsComplete = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking && booking.status === 'Accepted') {
      setSelectedBookingForPayment(booking);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentComplete = () => {
    if (selectedBookingForPayment) {
      setBookings(bookings.map(b => 
        b.id === selectedBookingForPayment.id 
          ? { ...b, status: 'Completed', payment: 'Paid', isPaid: true, canMarkComplete: false }
          : b
      ));
      setShowPaymentModal(false);
      setSelectedBookingForPayment(null);
      alert('Payment successful! Service marked as completed.');
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Main Content Area */}
      <main className="dashboard-content">
        <div className="content-inner">
          <header className="content-header"><h2>My Bookings</h2></header>

          <div className="bookings-detailed-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="detailed-booking-card">
                <div className="card-top">
                  <div className="provider-info">
                    <div className="avatar-large" style={{backgroundColor: booking.color}}>{booking.initial}</div>
                    <div className="info-text">
                      <strong>{booking.name}</strong>
                      <span className="service-tag">{booking.service}</span>
                      <div className="meta-info">
                        <span>📅 {booking.date}  |  🕐 {booking.time}</span>
                        <p className="address-text">📍 {booking.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="price-status">
                    <span className={`status-pill ${booking.status.toLowerCase()}`}>
                       {booking.status === 'Completed' ? '●' : '○'} {booking.status}
                    </span>
                    <div className="price-tag">
                        <strong>{booking.price}</strong>
                        <small className={booking.isPaid ? 'paid' : 'unpaid'}>{booking.payment}</small>
                    </div>
                  </div>
                </div>

                <div className="card-notes">
                  <p><strong>Notes:</strong> {booking.notes}</p>
                </div>

                {/* Action Buttons */}
                {booking.status === 'Pending' && (
                  <div className="card-actions">
                    <button className="cancel-btn">Cancel Booking</button>
                    <button className="contact-btn">Contact Provider</button>
                  </div>
                )}

                {booking.status === 'Accepted' && booking.canMarkComplete && !booking.isPaid && (
                  <div className="card-actions">
                    <button className="cancel-btn">Cancel Booking</button>
                    <button 
                      className="complete-btn"
                      onClick={() => handleMarkAsComplete(booking.id)}
                    >
                      ✓ Mark as Complete & Pay
                    </button>
                  </div>
                )}

                {booking.status === 'Completed' && booking.isPaid && (
                  <div className="card-actions">
                    <button className="rebook-btn">Book Again</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedBookingForPayment && (
          <div className="modal-overlay">
            <div className="payment-modal">
              <div className="modal-header">
                <h3>Complete Payment</h3>
                <button 
                  className="close-modal"
                  onClick={() => setShowPaymentModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="payment-summary">
                  <div className="summary-row">
                    <span>Service Provider:</span>
                    <strong>{selectedBookingForPayment.name}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Service:</span>
                    <strong>{selectedBookingForPayment.service}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Date:</span>
                    <strong>{selectedBookingForPayment.date}</strong>
                  </div>
                  <div className="summary-row total">
                    <span>Total Amount:</span>
                    <strong>{selectedBookingForPayment.price}</strong>
                  </div>
                </div>

                <div className="payment-methods">
                  <h4>Select Payment Method</h4>
                  <div className="payment-options">
                    <label className="payment-option">
                      <input type="radio" name="payment" defaultChecked />
                      <span className="option-content">
                        <span className="option-icon">💳</span>
                        <span>Credit/Debit Card</span>
                      </span>
                    </label>
                    <label className="payment-option">
                      <input type="radio" name="payment" />
                      <span className="option-content">
                        <span className="option-icon">📱</span>
                        <span>Mobile Wallet</span>
                      </span>
                    </label>
                    <label className="payment-option">
                      <input type="radio" name="payment" />
                      <span className="option-content">
                        <span className="option-icon">🏦</span>
                        <span>Net Banking</span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="card-details-form">
                  <div className="form-row">
                    <input type="text" placeholder="Card Number" />
                  </div>
                  <div className="form-row-split">
                    <input type="text" placeholder="MM/YY" />
                    <input type="text" placeholder="CVV" />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="cancel-payment-btn"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="proceed-payment-btn"
                  onClick={handlePaymentComplete}
                >
                  Pay {selectedBookingForPayment.price} →
                </button>
              </div>
            </div>
          </div>
        )}

       
      </main>
    </div>
  );
};

export default MyBookingsEnhanced;