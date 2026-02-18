import React from 'react';
import Sidebar from '../../components/Sidebar';
import '../../pages/BookingRequests.css';

const BookingRequests = () => {
  return (
    <div className="provider-layout">
      <Sidebar role="provider" />
      <main className="p-main">
        <div className="p-content-inner">
          <h2>Booking Requests</h2>
          <div className="request-card">
            <div className="request-status-tag">🕒 New Booking Request</div>
            <div className="request-body">
              <div className="request-user-info">
                <div className="request-avatar">J</div>
                <div>
                  <strong>John Doe</strong>
                  <span className="service-name">Plumber</span>
                  <div className="request-meta">
                    <span>📅 2024-01-20</span>
                    <span>🕒 02:00 PM</span>
                    <p>📍 123 Main Street</p>
                  </div>
                </div>
              </div>
              <div className="request-price">
                <strong>₹900</strong>
                <span>Estimated earning</span>
              </div>
            </div>
            <div className="request-notes">
              <strong>Notes:</strong> Bathroom leak repair
            </div>
            <div className="request-actions">
              <button className="reject-btn">✗ Reject</button>
              <button className="accept-btn">✓ Accept</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingRequests;
