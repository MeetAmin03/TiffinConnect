// components/DriverProfile.js
import React, { useState, useEffect } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

const DriverProfile = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    currentStatus: 'available',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('/driver/profile');
        setFormData({
          phoneNumber: response.data.phoneNumber || '',
          currentStatus: response.data.currentStatus || 'available',
        });
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/driver/profile', formData);
      navigate('/driver-dashboard'); // Redirect back to the dashboard
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleFormSubmit}>
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Status:
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
        <button type="submit" className="save-button">Save</button>
        <button type="button" className="cancel-button" onClick={() => navigate('/driver-dashboard')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default DriverProfile;
