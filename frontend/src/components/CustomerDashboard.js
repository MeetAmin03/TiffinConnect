// CustomerDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPause, faPlay, faTrash, faCalendar, faStar, faBell, faReceipt } from '@fortawesome/free-solid-svg-icons';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/customer-profile');
  };

  const goToSubscriptionProcess = () => {
    navigate('/subscription-process');
  };

  const goToOrderHistory = () => {
    navigate('/customer-orders');
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome, Customer!</h1>
      
      {/* Subscription Management */}
      <div className="dashboard-card subscription-card">
        <h2><FontAwesomeIcon icon={faCalendar} /> Manage Your Subscription</h2>
        <p><strong>Meal Plan:</strong> Monthly Vegetarian</p>
        <p><strong>Status:</strong> Active</p>
        <p><strong>Next Delivery:</strong> Tomorrow at 12:00 PM</p>
        <div className="subscription-controls">
          <button className="control-button pause-button">
            <FontAwesomeIcon icon={faPause} /> Pause
          </button>
          <button className="control-button resume-button">
            <FontAwesomeIcon icon={faPlay} /> Resume
          </button>
          <button className="control-button cancel-button">
            <FontAwesomeIcon icon={faTrash} /> Cancel
          </button>
        </div>
      </div>

      {/* Upcoming Deliveries */}
      <div className="dashboard-card upcoming-deliveries">
        <h2><FontAwesomeIcon icon={faCalendar} /> Upcoming Deliveries</h2>
        <ul className="delivery-list">
          <li>Oct 25 - Lunch at 12:00 PM - Vegetarian Meal</li>
          <li>Oct 26 - Lunch at 12:00 PM - Vegan Meal</li>
        </ul>
      </div>

      {/* Favorite Providers */}
      <div className="dashboard-card favorite-providers">
        <h2><FontAwesomeIcon icon={faStar} /> Favorite Providers</h2>
        <div className="providers-container">
          <div className="provider-card">
            <img src="https://via.placeholder.com/150" alt="Tiffin House" className="provider-image" />
            <div className="provider-details">
              <h5 className="provider-name">Homemade Bites</h5>
              <p className="provider-rating">⭐ 4.8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="dashboard-card notifications-card">
        <h2><FontAwesomeIcon icon={faBell} /> Notifications</h2>
        <ul className="notification-list">
          <li>Subscription renewal on Oct 30</li>
          <li>New offer from Tiffin House: 10% off</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="button-group">
        <button className="nav-button profile-button" onClick={goToProfile}>
          <FontAwesomeIcon icon={faUser} /> Go to Profile
        </button>
        <button className="nav-button tiffins-button" onClick={goToSubscriptionProcess}>
          Available Tiffins
        </button>
        <button className="nav-button orders-button" onClick={goToOrderHistory}>
          <FontAwesomeIcon icon={faReceipt} /> Order History
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
