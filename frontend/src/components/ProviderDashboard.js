import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProviderProfile, getMenuItems, getSubscriptionPlans } from '../api'; // Import the API functions
import axios from '../api'; // Assuming axios is configured properly to make requests to your backend
import './ProviderDashboard.css'; // Assuming you have a CSS file for styling

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]); // State for subscription plans
  const [orders, setOrders] = useState([]); // State for orders

  // Fetch provider data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provider profile
        const profileResponse = await getProviderProfile();
        setProfile(profileResponse.data);

        // Fetch menu items
        const menuResponse = await getMenuItems();
        setMenuItems(menuResponse.data); // Set menu items to state

        // Fetch subscription plans
        const plansResponse = await getSubscriptionPlans();
        setSubscriptionPlans(plansResponse.data); // Set subscription plans to state

        // Fetch orders
        const ordersResponse = await axios.get('/provider/orders');
        setOrders(ordersResponse.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Handle unauthorized error: Redirect to login
          console.error('Unauthorized: Redirecting to login.');
          sessionStorage.removeItem('token'); // Remove token from sessionStorage
          navigate('/login'); // Redirect to login
        } else {
          console.error('Error fetching dashboard data:', error);
        }
      }
    };
    fetchData();
  }, [navigate]); // Add navigate to dependencies for proper navigation handling

  const handleProfileClick = () => {
    navigate('/provider-profile');
  };

  const handleMenuClick = () => {
    navigate('/menu-items');
  };

  const handleSubscriptionClick = () => {
    navigate('/subscription-plans'); // Navigate to subscription plans
  };

  const handleOrderHistoryClick = () => {
    navigate('/provider-orders'); // Navigate to provider orders page
  };

  useEffect(() => {
    const typewriterElement = document.querySelector('.TypeWritter');
    const typerwriterp = document.querySelector('.typerwriterp');
    const paragraphElement = document.querySelector('.dashboard-header p');

    // Wait for the typewriter animation to finish (3s)
    setTimeout(() => {
      typewriterElement.classList.add('no-cursor'); // Remove the blinking cursor
      typerwriterp.classList.add('no-cursor');
      paragraphElement.classList.add('show-p'); // Show the <p> tag
    }, 3000); // Matches the typewriter animation duration
  }, []);

  return (
    <div className="provider-dashboard">
      <header className="dashboard-header">
        <h1 className="TypeWritter">Welcome, {profile.restaurantName}!</h1>
        <p className="typerwriterp">Your one-stop dashboard to manage your restaurant's profile and menu.</p>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <h3>Total Menu Items</h3>
          <p className="stat-value">{menuItems.length}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <h3>Address</h3>
          <p>{profile.address}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <h3>Delivery Options</h3>
          <p>{profile.deliveryOptions}</p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <h3>Total Orders</h3>
          <p className="stat-value">{orders.length}</p>
        </div>
      </div>

      <section className="dashboard-options">
        <div className="card profile-card">
          <h3>Manage Profile</h3>
          <button onClick={handleProfileClick} className="dashboard-btn">Profile</button>
        </div>

        <div className="card menu-card">
          <h3>Manage Menu</h3>
          <button onClick={handleMenuClick} className="dashboard-btn">Menu</button>
        </div>

        <div className="card">
          <h3>Manage Plans</h3>
          <button onClick={handleSubscriptionClick} className="dashboard-btn">Subscription</button>
        </div>

        <div className="card">
          <h3>Order History</h3>
          <button onClick={handleOrderHistoryClick} className="dashboard-btn">Orders</button>
        </div>
      </section>
    </div>
  );
};

export default ProviderDashboard;
