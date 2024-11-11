// components/VehicleRegistrationForm.js

import React, { useState, useEffect } from 'react';
import axios from '../api';
import './VehicleRegistrationForm.css';


const VehicleRegistrationForm = ({ onClose, initialData = {} }) => {
  const [formData, setFormData] = useState({
    vehicleType: initialData.vehicleType || '',
    licenseNumber: initialData.licenseNumber || '',
    deliveryRadius: initialData.deliveryRadius || '',
    phoneNumber: initialData.phoneNumber || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData.vehicleType) {
        // If initialData exists, we're updating
        await axios.put('/driver/profile', formData);
      } else {
        // Else, we're registering new vehicle details
        await axios.post('/driver/registerVehicle', formData);
      }
      onClose();
      window.location.reload(); // Refresh to reflect changes in the profile view
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="vehicle-registration-form">
      <h2>{initialData.vehicleType ? 'Edit Vehicle Information' : 'Register Your Vehicle'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Vehicle Type</label>
        <input
          type="text"
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
          required
        />

        <label>License Number</label>
        <input
          type="text"
          name="licenseNumber"
          value={formData.licenseNumber}
          onChange={handleChange}
          required
        />

        <label>Delivery Radius (km)</label>
        <input
          type="number"
          name="deliveryRadius"
          value={formData.deliveryRadius}
          onChange={handleChange}
          required
        />

        <label>Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        <button type="submit">{initialData.vehicleType ? 'Save Changes' : 'Register'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default VehicleRegistrationForm;
