import React, { useState } from 'react';
import axios from '../api';
import './CustomerProfile.css';

const CustomerProfile = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [preferences, setPreferences] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('address', address);
    formData.append('preferences', preferences);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const response = await axios.put('/customer/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error updating profile');
      console.error(error);
    }
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  return (
    <div className="profile-container">
      <h1>Manage Your Profile</h1>
      <div className="profile-card">
        <form onSubmit={handleSubmit}>
          {/* Profile Picture Upload */}
          <div className="profile-picture-section">
            <img
              src={profilePicture ? URL.createObjectURL(profilePicture) : '/default-profile.png'}
              alt="Profile Preview"
              className="profile-picture-preview"
            />
            <input
              type="file"
              onChange={handleProfilePictureChange}
              className="profile-picture-upload"
              accept="image/*"
            />
          </div>

          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              required
            />
          </div>

          {/* Preferences */}
          <div className="form-group">
            <label>Preferences</label>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Any dietary preferences or notes"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="save-button">Save Changes</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default CustomerProfile;
