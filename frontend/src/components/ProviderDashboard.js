import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProviderProfile, getMenuItems } from '../api'; // Import the API functions
import './ProviderDashboard.css'; // Assuming you have a CSS file for styling

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch provider profile
        const profileResponse = await getProviderProfile();
        setProfile(profileResponse.data);

        // Fetch menu items
        const menuResponse = await getMenuItems();
        setMenuItems(menuResponse.data); // Set menu items to state

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

  return (
<div className="provider-dashboard">
  <header className="dashboard-header">
    <h1>Welcome, {profile.restaurantName}!</h1>
    <p>Your one-stop dashboard to manage your restaurant's profile and menu.</p>
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
      <button onClick={handleProfileClick} className="dashboard-btn">Go to Profile</button>
    </div>

    <div className="card menu-card">
      <h3>Manage Menu</h3>
      <p>Add, edit, or delete menu items for your restaurant.</p>
      <button onClick={handleMenuClick} className="dashboard-btn">Go to Menu</button>
    </div>
  </section>
</div>

  );
};

export default ProviderDashboard;
