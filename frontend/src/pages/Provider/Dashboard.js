import React from 'react';
import Sidebar from '../../components/Sidebar';
import '../../pages/ProviderDashboard.css';

const ProviderDashboard = () => {
  return (
    <div className="provider-layout">
      <Sidebar role="provider" />
      <main className="p-main">
        <div className="p-content-inner">
          <h2>Dashboard</h2>
          <div className="p-stats-grid">
            <div className="p-stat-card">
              <div className="p-icon-box orange">🔔</div>
              <div><h4>1</h4><p>Pending Requests</p></div>
            </div>
            <div className="p-stat-card">
              <div className="p-icon-box blue">📅</div>
              <div><h4>3</h4><p>Total Bookings</p></div>
            </div>
            <div className="p-stat-card">
              <div className="p-icon-box green">✅</div>
              <div><h4>2</h4><p>Completed</p></div>
            </div>
            <div className="p-stat-card">
              <div className="p-icon-box gold">₹</div>
              <div><h4>₹3,900</h4><p>Total Earnings</p></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;
