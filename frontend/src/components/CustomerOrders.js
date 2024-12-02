import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import './CustomerOrders.css';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/customer/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
        setError('Failed to fetch order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleBackClick = () => {
    navigate('/customer-dashboard');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
<div className="customer-orders-container">
  <button className="back-button" onClick={handleBackClick}>
    &#11013; Back to Dashboard
  </button>
  <h1 className="order-history-title">Your Order History</h1>
  <div className="orders-table-wrapper">
  <div className="orders-grid">
  {orders.length > 0 ? (
    orders.map((order) => (
      <div key={order._id} className="order-card">
        <div className="order-header">
          <span className={`status-badge status-${order.status.toLowerCase()}`}>
            {order.status}
          </span>
          <h3 className="order-id">Order #{order._id}</h3>
        </div>
        
        <div className="order-details">
          <div className="detail-item">
            <span className="detail-label">Provider</span>
            <span className="detail-value">{order.providerId?.restaurantName || "N/A"}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Subscription Plan</span>
            <span className="detail-value">{order.subscriptionPlanId?.planName || "N/A"}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Start Date</span>
            <span className="detail-value">{new Date(order.startDate).toLocaleDateString()}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">End Date</span>
            <span className="detail-value">{new Date(order.endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="no-orders">No orders found.</div>
  )}
</div>
  </div>
</div>

  );
};

export default CustomerOrders;
