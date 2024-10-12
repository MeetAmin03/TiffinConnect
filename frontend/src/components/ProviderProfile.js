// frontend/components/ProviderProfile.js
import React, { useState, useEffect } from 'react';
import { getProviderProfile, updateProviderProfile } from '../api'; // API functions
import './ProviderProfile.css'; // Custom CSS for profile styling

const ProviderProfile = () => {
  const [profile, setProfile] = useState({
    restaurantName: '',
    address: '',
    deliveryOptions: '',
    restaurantLogoURL: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProviderProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProviderProfile(profile);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="profile-container">
      <h2>Manage Provider Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Restaurant Name:
          <input
            type="text"
            name="restaurantName"
            value={profile.restaurantName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Delivery Options:
          <input
            type="text"
            name="deliveryOptions"
            value={profile.deliveryOptions}
            onChange={handleChange}
          />
        </label>
        <label>
          Restaurant Logo URL:
          <input
            type="text"
            name="restaurantLogoURL"
            value={profile.restaurantLogoURL}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Profile</button>
      </form>
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default ProviderProfile;
