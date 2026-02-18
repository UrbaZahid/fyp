import React from 'react';
import Sidebar from '../../components/Sidebar';
import '../../pages/Profile.css';
import CustomerNavbar from '../../components/CustomerNavbar';

const Profile = () => {
  return (
    <div className="dashboard-wrapper">
      <main className="dashboard-content">
        <div className="content-inner">
          <h2>Profile Settings</h2>
          <div className="profile-container">
            <div className="profile-card">
              <div className="avatar-section">
                <div className="large-avatar">J</div>
                <div className="avatar-ops">
                  <button className="change-pic-btn">Change Photo</button>
                  <p>JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>
            </div>
            <div className="profile-card">
              <h3>Personal Information</h3>
              <form className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" defaultValue="John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue="john@example.com" disabled />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" defaultValue="+92 300-1234567" />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" defaultValue="Lahore, Pakistan" />
                  </div>
                </div>
                <button type="button" className="save-btn">Save Changes</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
