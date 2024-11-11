import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import './DriverDashboard.css';

const DriverDashboard = () => {
  const [driverProfile, setDriverProfile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  const fetchDriverProfile = async () => {
    try {
      const response = await axios.get('/driver/profile');
      setDriverProfile(response.data);
      if (response.data) {
        setProfilePhoto(response.data.profilePhoto);
      }
    } catch (error) {
      console.error('Error fetching driver profile:', error);
    }
  };

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    const photoFormData = new FormData();
    photoFormData.append('profilePhoto', file);

    try {
      await axios.post('/driver/uploadProfilePhoto', photoFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchDriverProfile();
    } catch (error) {
      console.error('Error uploading profile photo:', error);
    }
  };

  return (
    <div className="driver-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {driverProfile?.name || 'Driver'}!</h1>
        <p className="dashboard-description">
          Manage your profile, view statistics, and check upcoming deliveries.
        </p>
      </div>

      <div className="dashboard-main">
        {/* Profile Section */}
        <div className="dashboard-card profile-section">
          <h2>Your Profile</h2>
          <div className="profile-photo-container">
            {profilePhoto ? (
              <img
                src={`http://localhost:5000${profilePhoto}`}
                alt="Profile"
                className="profile-photo"
              />
            ) : (
              <div className="profile-placeholder">No Photo</div>
            )}
            <input type="file" onChange={handlePhotoUpload} className="upload-input" />
          </div>
          <div className="profile-info">
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
