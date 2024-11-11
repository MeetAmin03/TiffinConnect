// components/DriverRegisterVehicle.js
import React, { useState, useEffect } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import './DriverRegisterVehicle.css';

const DriverRegisterVehicle = () => {
  const [formData, setFormData] = useState({
    vehicleType: '',
    licenseNumber: '',
    deliveryRadius: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await axios.get('/driver/profile');
        setFormData({
          vehicleType: response.data.vehicleType || '',
          licenseNumber: response.data.licenseNumber || '',
          deliveryRadius: response.data.deliveryRadius || '',
        });
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };
    fetchVehicleData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/driver/registerVehicle', formData);
      navigate('/driver-dashboard'); // Redirect back to the dashboard
    } catch (error) {
      console.error("Error registering vehicle:", error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleFormSubmit}>
        <h2>Register/Update Vehicle</h2>
        <label>
          Vehicle Type:
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a type</option>
            <option value="Car">Car</option>
            <option value="Van">Van</option>
            <option value="Bike">Bike</option>
            <option value="Truck">Truck</option>
          </select>
        </label>
        <label>
          License Number:
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Delivery Radius (km):
          <input
            type="number"
            name="deliveryRadius"
            value={formData.deliveryRadius}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit" className="save-button">Save</button>
        <button type="button" className="cancel-button" onClick={() => navigate('/driver-dashboard')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default DriverRegisterVehicle;