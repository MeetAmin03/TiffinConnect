import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProviderProfile, getMenuItems, getSubscriptionPlans } from '../api'; // Import the API functions
import './ProviderDashboard.css'; // Assuming you have a CSS file for styling

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]); // State for subscription plans

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
    navigate('/subscription-plans'); // Assuming you'll create this route
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
    <p className='typerwriterp'>Your one-stop dashboard to manage your restaurant's profile and menu.</p>
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
  </div>

  <section className="dashboard-options">
    <div className="card profile-card">
      <h3>Manage Profile</h3>
      <p>View and update your restaurant details, delivery options, and more.</p>
      <button onClick={handleProfileClick} className="dashboard-btn">Profile</button>
    </div>

    <div className="card menu-card">
      <h3>Manage Menu</h3>
      <p>Add, edit, or delete menu items for your restaurant.</p>
      <button onClick={handleMenuClick} className="dashboard-btn">Menu</button>
    </div>

    <div className="card">
      <h3>Manage Subscription Plans</h3>
      <p>Create, edit, or delete subscription plans for your customers.</p>
      <button onClick={handleSubscriptionClick} className="dashboard-btn">Subscription</button>
    </div>
  </section>
</div>


  );
};

export default ProviderDashboard;
