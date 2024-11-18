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
      {/* Hero Header */}
      <div className="dashboard-hero">
        <h1>Welcome Back, {driverProfile?.userId?.name || 'Driver'}!</h1>
        <p className="dashboard-subtitle">Your tools for managing deliveries and more!</p>
      </div>

      {/* Main Dashboard Sections */}
      <div className="dashboard-main">
        {/* Top Row: Profile and Vehicle Info */}
        <div className="dashboard-card profile-section">
          <div className="profile-header">
            <h2>Driver Profile</h2>
          </div>
          <div className="profile-content">
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
              <button onClick={() => navigate('/driver-profile')} className="action-button">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

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
            <button
              onClick={() => navigate('/driver-register-vehicle')}
              className="action-button highlight-button"
            >
              Register/Update Vehicle
            </button>
          </div>
        </div>

        {/* Bottom Row: Statistics and Orders */}
        <div className="dashboard-card stats-section">
          <h2>Delivery Statistics</h2>
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

        <div className="dashboard-card orders-section">
          <h2>Orders</h2>
          <button
            onClick={() => navigate('/driver-orders')}
            className="action-button orders-button"
          >
            View Unassigned Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
