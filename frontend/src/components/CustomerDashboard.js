import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPause, faPlay, faTrash, faCalendar, faStar, faBell } from '@fortawesome/free-solid-svg-icons';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/customer-profile');
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome, Customer!</h1>
      
      {/* Subscription Management */}
      <div className="dashboard-card">
        <h2><FontAwesomeIcon icon={faCalendar} /> Manage Your Subscription</h2>
        <p><strong>Meal Plan:</strong> Monthly Vegetarian</p>
        <p><strong>Status:</strong> Active</p>
        <p><strong>Next Delivery:</strong> Tomorrow at 12:00 PM</p>
        <div className="subscription-controls">
          <button className="pause-button">
            <FontAwesomeIcon icon={faPause} /> Pause
          </button>
          <button className="resume-button">
            <FontAwesomeIcon icon={faPlay} /> Resume
          </button>
          <button className="cancel-button">
            <FontAwesomeIcon icon={faTrash} /> Cancel
          </button>
        </div>
      </div>

      {/* Upcoming Deliveries */}
      <div className="dashboard-card">
        <h2><FontAwesomeIcon icon={faCalendar} /> Upcoming Deliveries</h2>
        <ul>
          <li>Oct 25 - Lunch at 12:00 PM - Vegetarian Meal</li>
          <li>Oct 26 - Lunch at 12:00 PM - Vegan Meal</li>
          {/* Add more upcoming deliveries as needed */}
        </ul>
      </div>

      {/* Favorite Providers */}
      <div className="dashboard-card">
        <h2><FontAwesomeIcon icon={faStar} /> Favorite Providers</h2>
        <ul>
          <li>Tiffin House - 4.8 stars</li>
          <li>Homemade Bites - 4.6 stars</li>
        </ul>
      </div>

      {/* Notifications */}
      <div className="dashboard-card">
        <h2><FontAwesomeIcon icon={faBell} /> Notifications</h2>
        <ul>
          <li>Subscription renewal on Oct 30</li>
          <li>New offer from Tiffin House: 10% off</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="button-group">
        <button className="profile-button" onClick={goToProfile}>
          <FontAwesomeIcon icon={faUser} /> Go to Profile
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
