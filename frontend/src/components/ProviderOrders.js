import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import './ProviderOrders.css';

const ProviderOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/provider/orders');
        if (response.data.length === 0) {
          setError('No Orders placed yet for you!');
        } else {
          setOrders(response.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="provider-orders">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Go Back to Checkout
      </button>
      <h1>Manage Orders</h1>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Subscription Plan</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customerId?.name || 'N/A'}</td>
                <td>{order.subscriptionPlanId?.planName || 'N/A'}</td>
                <td>{new Date(order.startDate).toLocaleDateString()}</td>
                <td>{new Date(order.endDate).toLocaleDateString()}</td>
                <td>
                  <span className={`status-label ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty-state">No Orders placed yet for you!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProviderOrders;
