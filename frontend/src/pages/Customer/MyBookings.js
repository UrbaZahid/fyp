// src/pages/Customer/MyBookings.js
// Payment uses Stripe.js loaded from CDN (no npm install needed).
// Test card: 4242 4242 4242 4242 | Any future date | Any CVV

import React, { useState, useEffect, useRef } from 'react';
import API from '../../api/api';
import './MyBookings.css';

// ── Stripe publishable key (test/sandbox) ────────────────────────
// Set REACT_APP_STRIPE_PK=pk_test_... in your frontend/.env file
const STRIPE_PK = process.env.REACT_APP_STRIPE_PK || '';

const MyBookingsEnhanced = () => {
  const [bookings, setBookings]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking]   = useState(null);
  const [paymentLoading, setPaymentLoading]     = useState(false);
  const [paymentSuccess, setPaymentSuccess]     = useState(false);
  const [paymentError, setPaymentError]         = useState('');
  const [clientSecret, setClientSecret]         = useState('');
  const [stripeReady, setStripeReady]           = useState(false);

  // Refs for Stripe elements
  const stripeRef   = useRef(null);
  const elementsRef = useRef(null);
  const cardRef     = useRef(null);
  const cardMountRef = useRef(null); // DOM div where card mounts

  // ── Load Stripe.js from CDN once ──────────────────────────────
  useEffect(() => {
    if (!STRIPE_PK) return; // skip if key not configured
    if (window.Stripe) { setStripeReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload  = () => setStripeReady(true);
    script.onerror = () => console.error('Failed to load Stripe.js');
    document.head.appendChild(script);
  }, []);

  // ── Mount Stripe Card Element when modal opens ─────────────────
  useEffect(() => {
    if (!showPaymentModal || !clientSecret || !stripeReady || !cardMountRef.current) return;
    if (cardRef.current) return; // already mounted

    stripeRef.current   = window.Stripe(STRIPE_PK);
    elementsRef.current = stripeRef.current.elements({ clientSecret });
    cardRef.current     = elementsRef.current.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#1e293b',
          '::placeholder': { color: '#94a3b8' },
        },
      },
    });
    cardRef.current.mount(cardMountRef.current);
    cardRef.current.on('change', (e) => {
      if (e.error) setPaymentError(e.error.message);
      else setPaymentError('');
    });

    return () => {
      if (cardRef.current) { cardRef.current.destroy(); cardRef.current = null; }
    };
  }, [showPaymentModal, clientSecret, stripeReady]);

  // ── Fetch bookings ─────────────────────────────────────────────
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

  // ── Cancel booking ─────────────────────────────────────────────
  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking.');
    }
  };

  // ── Open payment modal — fetch clientSecret from backend ───────
  const handlePayNow = async (booking) => {
    setSelectedBooking(booking);
    setPaymentSuccess(false);
    setPaymentError('');
    setClientSecret('');
    cardRef.current = null;

    if (!STRIPE_PK) {
      // Stripe not configured — use simple confirm flow for dev/demo
      setShowPaymentModal(true);
      return;
    }

    try {
      const { data } = await API.post('/payments/create-intent', { bookingId: booking._id });
      setClientSecret(data.clientSecret);
      setShowPaymentModal(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not initiate payment.');
    }
  };

  // ── Handle payment submit ──────────────────────────────────────
  const handlePaymentComplete = async () => {
    setPaymentLoading(true);
    setPaymentError('');

    try {
      let stripePaymentIntentId = '';

      // === Stripe sandbox mode ===
      if (STRIPE_PK && stripeRef.current && cardRef.current && clientSecret) {
        const { error, paymentIntent } = await stripeRef.current.confirmCardPayment(
          clientSecret,
          { payment_method: { card: cardRef.current } }
        );

        if (error) {
          setPaymentError(error.message);
          setPaymentLoading(false);
          return;
        }

        stripePaymentIntentId = paymentIntent.id;
      }

      // Tell backend to record payment + mark booking Completed
      await API.post('/payments/confirm', {
        bookingId:             selectedBooking._id,
        stripePaymentIntentId,
        method:                STRIPE_PK ? 'card' : 'card',
      });

      setPaymentSuccess(true);
      fetchBookings();
      setTimeout(() => {
        setShowPaymentModal(false);
        setSelectedBooking(null);
        setPaymentSuccess(false);
      }, 2500);

    } catch (err) {
      setPaymentError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const closeModal = () => {
    if (cardRef.current) { cardRef.current.destroy(); cardRef.current = null; }
    setShowPaymentModal(false);
    setSelectedBooking(null);
    setClientSecret('');
    setPaymentError('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':   return '#f59e0b';
      case 'Accepted':  return '#3b82f6';
      case 'Completed': return '#10b981';
      case 'Rejected':  return '#ef4444';
      default:          return '#6b7280';
    }
  };

  const getInitial = (booking) =>
    booking?.provider?.user?.name?.charAt(0).toUpperCase() || 'P';

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

          {loading && (
            <p style={{ color: '#6b7280', padding: '40px', textAlign: 'center' }}>
              Loading bookings...
            </p>
          )}

          {error && (
            <div style={{
              background: '#fee2e2', color: '#dc2626',
              padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          {!loading && bookings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px', color: '#6b7280' }}>
              <p style={{ fontSize: '48px' }}>📅</p>
              <p style={{ fontSize: '18px', marginTop: '12px' }}>No bookings yet!</p>
              <p>Browse services and book your first appointment.</p>
            </div>
          )}

          <div className="bookings-detailed-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="detailed-booking-card">
                <div className="card-top">
                  <div className="provider-info">
                    <div className="avatar-large" style={{ backgroundColor: '#4f46e5' }}>
                      {getInitial(booking)}
                    </div>
                    <div className="info-text">
                      <strong>{booking.provider?.user?.name || 'Provider'}</strong>
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
                        color:      getStatusColor(booking.status),
                        border:     `1px solid ${getStatusColor(booking.status)}40`,
                        padding:    '4px 12px',
                        borderRadius: '20px',
                        fontSize:   '13px',
                        fontWeight: '600',
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

                <div className="card-actions">
                  {booking.status === 'Pending' && (
                    <button className="cancel-btn" onClick={() => handleCancel(booking._id)}>
                      Cancel Booking
                    </button>
                  )}

                  {booking.status === 'Accepted' && !booking.isPaid && (
                    <>
                      <button className="cancel-btn" onClick={() => handleCancel(booking._id)}>
                        Cancel Booking
                      </button>
                      <button className="complete-btn" onClick={() => handlePayNow(booking)}>
                        💳 Pay Now
                      </button>
                    </>
                  )}

                  {booking.status === 'Completed' && booking.isPaid && (
                    <span style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>
                      ✅ Service completed &amp; paid
                    </span>
                  )}

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

        {/* ── Payment Modal ─────────────────────────────────────── */}
        {showPaymentModal && selectedBooking && (
          <div className="modal-overlay">
            <div className="payment-modal">
              <div className="modal-header">
                <h3>💳 Complete Payment</h3>
                <button className="close-modal" onClick={closeModal}>×</button>
              </div>

              {paymentSuccess ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#10b981' }}>
                  <p style={{ fontSize: '48px' }}>✅</p>
                  <h3>Payment Successful!</h3>
                  <p>Your booking is now marked as Completed.</p>
                </div>
              ) : (
                <>
                  <div className="modal-body">
                    {/* Summary */}
                    <div className="payment-summary">
                      <div className="summary-row">
                        <span>Provider:</span>
                        <strong>{selectedBooking.provider?.user?.name}</strong>
                      </div>
                      <div className="summary-row">
                        <span>Date &amp; Time:</span>
                        <strong>{selectedBooking.date} at {selectedBooking.time}</strong>
                      </div>
                      <div className="summary-row">
                        <span>Address:</span>
                        <strong>{selectedBooking.address}</strong>
                      </div>
                      <div className="summary-row total">
                        <span>Total:</span>
                        <strong style={{ color: '#4f46e5', fontSize: '18px' }}>
                          Rs. {selectedBooking.totalAmount}
                        </strong>
                      </div>
                    </div>

                    {/* Stripe card element — or fallback info */}
                    {STRIPE_PK ? (
                      <div style={{ marginTop: '20px' }}>
                        {/* Test card hint */}
                        <div style={{
                          background: '#eff6ff', border: '1px solid #bfdbfe',
                          borderRadius: '8px', padding: '10px 14px', marginBottom: '14px',
                          fontSize: '13px', color: '#1d4ed8',
                        }}>
                          🧪 <strong>Test Mode:</strong> Use card <strong>4242 4242 4242 4242</strong>
                          &nbsp;| Any future date | Any 3-digit CVV
                        </div>

                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '8px' }}>
                          Card Details
                        </label>
                        <div
                          ref={cardMountRef}
                          style={{
                            border: '1.5px solid #d1d5db', borderRadius: '8px',
                            padding: '12px 14px', background: '#fff',
                            minHeight: '44px',
                          }}
                        />
                        {!stripeReady && (
                          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                            Loading Stripe...
                          </p>
                        )}
                      </div>
                    ) : (
                      <div style={{
                        background: '#fef9c3', border: '1px solid #fde68a',
                        borderRadius: '8px', padding: '12px 14px', marginTop: '16px',
                        fontSize: '13px', color: '#92400e',
                      }}>
                        ⚠️ Stripe not configured. Add <strong>REACT_APP_STRIPE_PK=pk_test_...</strong> to
                        frontend/.env and restart. Payment will be recorded without Stripe validation.
                      </div>
                    )}

                    {/* Error */}
                    {paymentError && (
                      <div style={{
                        background: '#fee2e2', color: '#dc2626',
                        borderRadius: '8px', padding: '10px 14px', marginTop: '12px',
                        fontSize: '13px',
                      }}>
                        ❌ {paymentError}
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button className="cancel-payment-btn" onClick={closeModal} disabled={paymentLoading}>
                      Cancel
                    </button>
                    <button
                      className="proceed-payment-btn"
                      onClick={handlePaymentComplete}
                      disabled={paymentLoading || (STRIPE_PK && !stripeReady)}
                    >
                      {paymentLoading
                        ? 'Processing...'
                        : `Pay Rs. ${selectedBooking.totalAmount} →`}
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
