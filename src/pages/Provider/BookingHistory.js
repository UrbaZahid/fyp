import React from 'react';
import Sidebar from '../../components/Sidebar';

const ProviderBookingHistory = () => {
  return (
    <div className="provider-layout">
      <Sidebar role="provider" />
      <main className="p-main">
        <div className="p-content-inner">
          <h2>Booking History</h2>
          <p>Your booking history will appear here.</p>
        </div>
      </main>
    </div>
  );
};

export default ProviderBookingHistory;
