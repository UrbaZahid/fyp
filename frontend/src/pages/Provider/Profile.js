import React from 'react';
import Sidebar from '../../components/Sidebar';
import '../../pages/ProviderProfile.css';

const ProviderProfile = () => {
  return (
    <div className="provider-layout">
      <Sidebar role="provider" />
      <main className="p-main">
        <div className="p-content-inner">
          <h2>My Profile</h2>
          <div className="profile-section-card">
            <h3>Basic Information</h3>
            <p>Update your profile information here.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProviderProfile;
