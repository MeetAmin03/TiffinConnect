import React, { useState, useEffect } from 'react';
import axios from '../api';
import './CustomerProfile.css';

const CustomerProfile = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [preferences, setPreferences] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/customer/profile');
        const { name, address, preferences, profilePicture } = response.data;

        setName(name);
        setAddress(address);
        setPreferences(preferences.dietaryRestrictions || ''); // Display dietary restrictions
        setProfilePicture(profilePicture);
        console.log("Profile picture URL:", profilePicture); // Log to check URL
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('address', address);
    formData.append('preferences', JSON.stringify({ dietaryRestrictions: preferences })); // Stringify preferences
    if (profilePicture instanceof File) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const response = await axios.put('/customer/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error updating profile');
      console.error('Error in profile update:', error);
    }
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const getProfilePictureUrl = () => {
    if (!profilePicture) {
      return '/default-profile.png';
    }
    if (typeof profilePicture === 'string') {
      return profilePicture.startsWith('http')
        ? profilePicture
        : `http://localhost:5000/${profilePicture}`;
    }
    return URL.createObjectURL(profilePicture); // For newly uploaded image
  };
  const handleBackClick = () => {
    history.back(); // Navigate back to the previous page
  };


  return (
    <div className="profile-container">
      <button className="back-button-Customer" onClick={handleBackClick}>&#11013;</button>
      <h1>Manage Your Profile</h1>
      <div className="profile-card">
        <form onSubmit={handleSubmit}>
          {/* Profile Picture Upload */}
          <div className="profile-picture-section">
            <img
              src={getProfilePictureUrl()}
              alt="Profile"
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
              required
            />
          </div>

          {/* Dietary Restrictions */}
          <div className="form-group">
            <label>Dietary Restrictions</label>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Any dietary restrictions"
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
