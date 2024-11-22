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
      <button className="back-button" onClick={handleBackClick}>&#11013; Back to Dashboard</button>
      <h1 className="order-history-title">Your Order History</h1>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Provider</th>
            <th>Subscription Plan</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id} className="order-row">
                <td>{order._id}</td>
                <td>{order.providerId?.restaurantName || 'N/A'}</td>
                <td>{order.subscriptionPlanId?.planName || 'N/A'}</td>
                <td>{new Date(order.startDate).toLocaleDateString()}</td>
                <td>{new Date(order.endDate).toLocaleDateString()}</td>
                <td className={`status-${order.status.toLowerCase()}`}>{order.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-orders">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerOrders;
