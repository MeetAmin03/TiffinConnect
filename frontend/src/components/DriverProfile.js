// components/DriverProfile.js
import React, { useState, useEffect } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import './DriverProfile.css';

const DriverProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    currentStatus: 'available',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('/driver/profile');
        setFormData({
          name: response.data.user.name || '',
          address: response.data.user.address || '',
          phoneNumber: response.data.phoneNumber || '',
          currentStatus: response.data.currentStatus || 'available',
        });
        setProfilePhoto(response.data.profilePhoto || null); // Fetch existing profile photo
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update profile information
      await axios.put('/driver/profile', formData);

      // If a new profile photo is selected, upload it
      if (profilePhoto) {
        const formData = new FormData();
        formData.append('profilePhoto', profilePhoto);
        await axios.post('/driver/upload-profile-photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/driver-dashboard'); // Redirect back to the dashboard
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="profile-photo-container">
          {profilePhoto ? (
            <img
              src={URL.createObjectURL(profilePhoto)}
              alt="Profile"
              className="profile-photo-preview"
            />
          ) : (
            <p>No Profile Photo</p>
          )}
          <input
            type="file"
            name="profilePhoto"
            onChange={handlePhotoChange}
            accept="image/*"
          />
        </div>
        <label>
          <i className="fas fa-user"></i> Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          <i className="fas fa-map-marker-alt"></i> Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </label>
        <label>
          <i className="fas fa-phone-alt"></i> Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          <i className="fas fa-user-tag"></i> Status:
          <select
            name="currentStatus"
            value={formData.currentStatus}
            onChange={handleInputChange}
          >
            <option value="available">Available</option>
            <option value="on delivery">On Delivery</option>
            <option value="off duty">Off Duty</option>
          </select>
        </label>
        <div className="button-container">
        <button type="submit" className="save-button-Drive">Save</button>
        <button type="button" className="cancel-button" onClick={() => navigate('/driver-dashboard')}>
          Cancel
        </button>
        </div>
      </form>
    </div>
  );
};

export default DriverProfile;
