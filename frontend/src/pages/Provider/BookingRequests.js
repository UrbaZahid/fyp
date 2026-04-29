// import React from 'react';
// import Sidebar from '../../components/Sidebar';
// import '../../pages/BookingRequests.css';

// const BookingRequests = () => {
//   return (
//     <div className="provider-layout">
//       <Sidebar role="provider" />
//       <main className="p-main">
//         <div className="p-content-inner">
//           <h2>Booking Requests</h2>
//           <div className="request-card">
//             <div className="request-status-tag">🕒 New Booking Request</div>
//             <div className="request-body">
//               <div className="request-user-info">
//                 <div className="request-avatar">J</div>
//                 <div>
//                   <strong>John Doe</strong>
//                   <span className="service-name">Plumber</span>
//                   <div className="request-meta">
//                     <span>📅 2024-01-20</span>
//                     <span>🕒 02:00 PM</span>
//                     <p>📍 123 Main Street</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="request-price">
//                 <strong>₹900</strong>
//                 <span>Estimated earning</span>
//               </div>
//             </div>
//             <div className="request-notes">
//               <strong>Notes:</strong> Bathroom leak repair
//             </div>
//             <div className="request-actions">
//               <button className="reject-btn">✗ Reject</button>
//               <button className="accept-btn">✓ Accept</button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default BookingRequests;
// src/pages/Provider/BookingRequests.js

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import API from '../../api/api';
import '../../pages/BookingRequests.css';

const avatarColors = ['#3b82f6', '#6366f1', '#4f46e5', '#0891b2', '#7c3aed', '#db2777'];

const BookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [actionLoad, setActionLoad] = useState(''); // booking id jis par action ho raha hai

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await API.get('/bookings/requests');
      // Sirf Pending dikhaao
      setBookings(data.bookings.filter((b) => b.status === 'Pending'));
    } catch (err) {
      setError(err.response?.data?.message || 'Requests load nahi ho sake.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (bookingId, action) => {
    try {
      setActionLoad(bookingId);
      await API.put(`/bookings/${bookingId}/${action}`);
      // List refresh karo
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Action fail ho gaya');
    } finally {
      setActionLoad('');
    }
  };

  const getInitial = (name = '') => name.charAt(0).toUpperCase() || '?';
  const getColor   = (i)         => avatarColors[i % avatarColors.length];

  return (
    <div className="provider-layout">
      <Sidebar role="provider" />
      <main className="p-main">
        <div className="p-content-inner">

          <div className="req-page-header">
            <h2>Booking Requests</h2>
            <p className="req-subtitle">Naye booking requests yahan aate hain — Accept ya Reject karein</p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="req-loading">
              <span>⏳</span> Loading requests...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="req-error">
              ❌ {error}
              <button onClick={fetchRequests} className="req-retry-btn">Retry</button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && bookings.length === 0 && (
            <div className="req-empty">
              <div className="req-empty-icon">📭</div>
              <h3>No pending request</h3>
              <p>When customers book you, requests will come here..</p>
            </div>
          )}

          {/* Booking cards */}
          {!loading && !error && bookings.length > 0 && (
            <div className="requests-container">
              {bookings.map((booking, index) => {
                const customerName = booking.customer?.name || booking.customerName || 'Customer';
                const isProcessing = actionLoad === booking._id;

                return (
                  <div key={booking._id} className="request-card">

                    <div className="request-status-tag">🕒 New Booking Request</div>

                    <div className="request-body">
                      <div className="request-user-info">
                        <div
                          className="request-avatar"
                          style={{ background: getColor(index), color: 'white' }}
                        >
                          {getInitial(customerName)}
                        </div>
                        <div>
                          <strong>{customerName}</strong>
                          <span className="service-name">
                            {booking.customer?.email || booking.customerEmail}
                          </span>
                          <div className="request-meta">
                            <span>📅 {booking.date}</span>
                            <span>🕒 {booking.time}</span>
                            {booking.duration && (
                              <span>⏱ {booking.duration} hr</span>
                            )}
                            <p>📍 {booking.address}, {booking.city}</p>
                            {booking.customer?.phone && (
                              <p>📞 {booking.customer.phone}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="request-price">
                        <strong>Rs {booking.totalAmount?.toLocaleString() || 0}</strong>
                        <span>Estimated earning</span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="request-notes">
                        <strong>Notes:</strong> {booking.notes}
                      </div>
                    )}

                    <div className="request-actions">
                      <button
                        className="reject-btn"
                        onClick={() => handleAction(booking._id, 'reject')}
                        disabled={isProcessing}
                      >
                        {isProcessing ? '...' : '✗ Reject'}
                      </button>
                      <button
                        className="accept-btn"
                        onClick={() => handleAction(booking._id, 'accept')}
                        disabled={isProcessing}
                      >
                        {isProcessing ? '...' : '✓ Accept'}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default BookingRequests;