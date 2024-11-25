import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import './SubscriptionProcess.css';

const SubscriptionProcess = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get('/provider/getAllSubscriptionPlans');
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());
  const handleFilterChange = (e) => setFilter(e.target.value);

  const filteredSubscriptions = subscriptions.filter((plan) => {
    const planNameMatch = plan.planName.toLowerCase().includes(searchQuery);
    const providerNameMatch = plan.providerId?.restaurantName?.toLowerCase().includes(searchQuery); // Optional chaining
    const mealNameMatch = plan.meals.some(meal => meal.mealName.toLowerCase().includes(searchQuery));

    return (
      (searchQuery === '' || planNameMatch || providerNameMatch || mealNameMatch) &&
      (filter === '' || plan.duration === filter)
    );
  });

  const goToCheckout = (subscriptionId) => {
    navigate(`/checkout/${subscriptionId}`);
  };
  
  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="subscription-page">
      <button className="back-button-Customer" onClick={handleBackClick}>&#11013;</button>
      <h1>Available Tiffin Subscriptions</h1>
      <div className="subscription-controls">
        <input
          type="text"
          placeholder="Search for subscriptions..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
        />
        <select value={filter} onChange={handleFilterChange} className="filter-dropdown">
          <option value="">All Durations</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="subscription-list">
        {filteredSubscriptions.map((plan, index) => (
          <div className="subscription-card" key={index}>
            <h2>{plan.planName}</h2>
            <p><strong>Provider:</strong> {plan.providerId?.restaurantName || 'Provider not available'}</p>
            <p>{plan.description}</p>
            <p><strong>Price:</strong> ${plan.price}</p>
            <p><strong>Duration:</strong> {plan.duration}</p>
            <div className="meals-list">
              {plan.meals.map((meal, idx) => (
                <span key={idx}>{meal.mealName}</span>
              ))}
            </div>
            <button
              className="checkout-button"
              onClick={() => goToCheckout(plan._id)}
            >
              Checkout
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionProcess;
