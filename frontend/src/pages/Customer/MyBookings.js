// src/pages/Customer/MyBookings.js

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/api';
import './MyBookings.css';

const MyBookingsEnhanced = () => {
  const [bookings, setBookings]                       = useState([]);
  const [loading, setLoading]                         = useState(true);
  const [error, setError]                             = useState('');
  const [showPaymentModal, setShowPaymentModal]       = useState(false);
  const [selectedBooking, setSelectedBooking]         = useState(null);
  const [paymentMethod, setPaymentMethod]             = useState('card');
  const [paymentLoading, setPaymentLoading]           = useState(false);
  const [paymentSuccess, setPaymentSuccess]           = useState(false);

  // Bookings fetch karo
  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my');
      setBookings(data.bookings);
    } catch (err) {
      setError('Could not load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // Booking cancel karo
  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${bookingId}/cancel`);
      fetchBookings(); // Refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking.');
    }
  };

  // Payment modal kholo
  const handlePayNow = (booking) => {
    setSelectedBooking(booking);
    setPaymentSuccess(false);
    setShowPaymentModal(true);
  };

  // Payment complete karo
  const handlePaymentComplete = async () => {
    setPaymentLoading(true);
    try {
      await API.post('/payments/confirm', {
        bookingId: selectedBooking._id,
        method: paymentMethod,
      });
      setPaymentSuccess(true);
      fetchBookings(); // Booking status refresh karo
      setTimeout(() => {
        setShowPaymentModal(false);
        setSelectedBooking(null);
        setPaymentSuccess(false);
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed.');
    } finally {
      setPaymentLoading(false);
    }
  };

  // Status ke hisaab se color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':   return '#f59e0b';
      case 'Accepted':  return '#3b82f6';
      case 'Completed': return '#10b981';
      case 'Rejected':  return '#ef4444';
      default:          return '#6b7280';
    }
  };

  // Provider ka pehla letter (avatar ke liye)
  const getInitial = (booking) => {
    return booking?.provider?.user?.name?.charAt(0).toUpperCase() || 'P';
  };

  return (
    <div className="dashboard-wrapper">
      <main className="dashboard-content">
        <div className="content-inner">
          <header className="content-header">
            <h2>My Bookings</h2>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Track all your service bookings
            </p>
          </header>

          {/* Loading */}
          {loading && (
            <p style={{ color: '#6b7280', padding: '40px', textAlign: 'center' }}>
              Loading bookings...
            </p>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: '#fee2e2', color: '#dc2626',
              padding: '12px 16px', borderRadius: '8px', marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && bookings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>
              <p style={{ fontSize: '48px' }}>📅</p>
              <p style={{ fontSize: '18px', marginTop: '12px' }}>No bookings yet!</p>
              <p>Browse services and book your first appointment.</p>
            </div>
          )}

          {/* Bookings List */}
          <div className="bookings-detailed-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="detailed-booking-card">
                <div className="card-top">
                  <div className="provider-info">
                    <div
                      className="avatar-large"
                      style={{ backgroundColor: '#4f46e5' }}
                    >
                      {getInitial(booking)}
                    </div>
                    <div className="info-text">
                      <strong>
                        {booking.provider?.user?.name || 'Provider'}
                      </strong>
                      <span className="service-tag">
                        {booking.provider?.category?.name || 'Service'}
                      </span>
                      <div className="meta-info">
                        <span>📅 {booking.date} | 🕐 {booking.time}</span>
                        <p className="address-text">📍 {booking.address}, {booking.city}</p>
                      </div>
                    </div>
                  </div>

                  <div className="price-status">
                    <span
                      className="status-pill"
                      style={{
                        background: getStatusColor(booking.status) + '20',
                        color: getStatusColor(booking.status),
                        border: `1px solid ${getStatusColor(booking.status)}40`,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      {booking.status}
                    </span>
                    <div className="price-tag">
                      <strong>Rs. {booking.totalAmount}</strong>
                      <small style={{ color: booking.isPaid ? '#10b981' : '#ef4444' }}>
                        {booking.isPaid ? '✅ Paid' : 'Unpaid'}
                      </small>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="card-notes">
                    <p><strong>Notes:</strong> {booking.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="card-actions">
                  {/* Pending — cancel option */}
                  {booking.status === 'Pending' && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  )}

                  {/* Accepted — cancel + pay */}
                  {booking.status === 'Accepted' && !booking.isPaid && (
                    <>
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel Booking
                      </button>
                      <button
                        className="complete-btn"
                        onClick={() => handlePayNow(booking)}
                      >
                        💳 Pay Now
                      </button>
                    </>
                  )}

                  {/* Completed + Paid */}
                  {booking.status === 'Completed' && booking.isPaid && (
                    <span style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>
                      ✅ Service completed & paid
                    </span>
                  )}

                  {/* Rejected */}
                  {booking.status === 'Rejected' && (
                    <span style={{ color: '#ef4444', fontSize: '14px' }}>
                      ❌ Booking was cancelled/rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Payment Modal ────────────────────────── */}
        {showPaymentModal && selectedBooking && (
          <div className="modal-overlay">
            <div className="payment-modal">
              <div className="modal-header">
                <h3>Complete Payment</h3>
                <button
                  className="close-modal"
                  onClick={() => setShowPaymentModal(false)}
                >×</button>
              </div>

              {paymentSuccess ? (
                <div style={{
                  textAlign: 'center', padding: '40px',
                  color: '#10b981'
                }}>
                  <p style={{ fontSize: '48px' }}>✅</p>
                  <h3>Payment Successful!</h3>
                  <p>Your booking is now complete.</p>
                </div>
              ) : (
                <>
                  <div className="modal-body">
                    {/* Summary */}
                    <div className="payment-summary">
                      <div className="summary-row">
                        <span>Service Provider:</span>
                        <strong>{selectedBooking.provider?.user?.name}</strong>
                      </div>
                      <div className="summary-row">
                        <span>Date:</span>
                        <strong>{selectedBooking.date} at {selectedBooking.time}</strong>
                      </div>
                      <div className="summary-row">
                        <span>Address:</span>
                        <strong>{selectedBooking.address}</strong>
                      </div>
                      <div className="summary-row total">
                        <span>Total Amount:</span>
                        <strong>Rs. {selectedBooking.totalAmount}</strong>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="payment-methods">
                      <h4>Select Payment Method</h4>
                      <div className="payment-options">
                        <label className="payment-option">
                          <input
                            type="radio" name="payment" value="card"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                          />
                          <span className="option-content">
                            <span className="option-icon">💳</span>
                            <span>Credit/Debit Card</span>
                          </span>
                        </label>
                        <label className="payment-option">
                          <input
                            type="radio" name="payment" value="mobile_wallet"
                            checked={paymentMethod === 'mobile_wallet'}
                            onChange={() => setPaymentMethod('mobile_wallet')}
                          />
                          <span className="option-content">
                            <span className="option-icon">📱</span>
                            <span>Mobile Wallet</span>
                          </span>
                        </label>
                        <label className="payment-option">
                          <input
                            type="radio" name="payment" value="net_banking"
                            checked={paymentMethod === 'net_banking'}
                            onChange={() => setPaymentMethod('net_banking')}
                          />
                          <span className="option-content">
                            <span className="option-icon">🏦</span>
                            <span>Net Banking</span>
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Card Details */}
                    {paymentMethod === 'card' && (
                      <div className="card-details-form">
                        <div className="form-row">
                          <input type="text" placeholder="Card Number" />
                        </div>
                        <div className="form-row-split">
                          <input type="text" placeholder="MM/YY" />
                          <input type="text" placeholder="CVV" />
                        </div>
                      </div>
                    )}
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
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? 'Processing...' : `Pay Rs. ${selectedBooking.totalAmount} →`}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookingsEnhanced;