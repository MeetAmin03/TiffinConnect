import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { subscriptionId } = useParams(); // Get subscriptionId from the URL
  const [subscription, setSubscription] = useState(null);
  const [showBillingForm, setShowBillingForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const response = await axios.get(`/provider/getSubscription/${subscriptionId}`);
        setSubscription(response.data);
      } catch (error) {
        console.error("Error fetching subscription details:", error);
      }
    };

    fetchSubscriptionDetails();
  }, [subscriptionId]);

  const handleProceedToPay = () => {
    navigate(`/billing/${subscriptionId}`); // Updated navigation to billing page with subscriptionId
  };

  const handleCancel = () => {
    navigate('/subscription-process');
  };

  return (
    <div className="checkout-page">
      {showBillingForm ? (
        // Removed inline BillingForm, now relying on navigation
        <></>
      ) : (
        <>
          {subscription ? (
            <>
              <h1>Checkout for {subscription.planName}</h1>
              <div className="checkout-details">
                <p><strong>Description:</strong> {subscription.description}</p>
                <p><strong>Price:</strong> ${subscription.price}</p>
                <p><strong>Duration:</strong> {subscription.duration}</p>
                <div className="meals-list">
                  <h3>Included Meals:</h3>
                  {subscription.meals.map((meal, idx) => (
                    <span key={idx}>{meal.mealName}</span>
                  ))}
                </div>
              </div>
              <div className="checkout-buttons">
                <button className="pay-button" onClick={handleProceedToPay}>Proceed to Pay</button>
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
              </div>
            </>
          ) : (
            <p>Loading subscription details...</p>
          )}
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
