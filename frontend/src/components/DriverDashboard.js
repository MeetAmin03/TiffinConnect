import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import './DriverDashboard.css';

const DriverDashboard = () => {
  const [driverProfile, setDriverProfile] = useState(null);
  const navigate = useNavigate();

  const fetchDriverProfile = async () => {
    try {
      const response = await axios.get('/driver/profile');
      setDriverProfile(response.data);
    } catch (error) {
      console.error('Error fetching driver profile:', error);
    }
  };

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  return (
    <div className="driver-dashboard">
      <div className="dashboard-header">
  <h1>Welcome, {driverProfile?.userId?.name || 'Driver'}!</h1>
  <p className="dashboard-description">
    Manage your profile, view statistics, and check upcoming deliveries.
  </p>
</div>

      <div className="dashboard-main">
        {/* Profile Section */}
        <div className="dashboard-card profile-section">
          <h2>Your Profile</h2>
          <div className="profile-photo-container">
            {driverProfile?.profilePhoto ? (
              <img
                src={`http://localhost:5000${driverProfile.profilePhoto}`}
                alt="Profile"
                className="profile-photo"
              />
            ) : (
              <div className="profile-placeholder">No Photo</div>
            )}
          </div>
          <div className="profile-info">
  <p>
    <strong>Name:</strong> {driverProfile?.userId?.name || 'Not provided'}
  </p>
  <p>
    <strong>Phone Number:</strong> {driverProfile?.phoneNumber || 'Not provided'}
  </p>
  <p>
    <strong>Status:</strong> {driverProfile?.currentStatus || 'N/A'}
  </p>
</div>
          <button onClick={() => navigate('/driver-profile')} className="action-button">
            Edit Profile
          </button>
        </div>

        {/* Statistics Section */}
        <div className="dashboard-card stats-section">
          <h2>Statistics</h2>
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Deliveries</h3>
              <p>{driverProfile?.completedDeliveries || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Earnings</h3>
              <p>${driverProfile?.earnings?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="stat-card">
              <h3>Rating</h3>
              <p>{driverProfile?.rating || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Information Section */}
        <div className="dashboard-card vehicle-section">
          <h2>Vehicle Information</h2>
          <div className="vehicle-info">
            <p>
              <strong>Vehicle Type:</strong> {driverProfile?.vehicleType || 'Not registered'}
            </p>
            <p>
              <strong>License Number:</strong> {driverProfile?.licenseNumber || 'Not registered'}
            </p>
            <p>
              <strong>Delivery Radius:</strong> {`${driverProfile?.deliveryRadius || 'N/A'} km`}
            </p>
          </div>
          <button onClick={() => navigate('/driver-register-vehicle')} className="action-button">
            Register/Update Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
