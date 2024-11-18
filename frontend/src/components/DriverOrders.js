import React, { useEffect, useState } from 'react';
import axios from '../api';
import './DriverOrders.css';

const DriverOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedOrders = async () => {
      try {
        console.log('Fetching assigned orders for driver...');
        const response = await axios.get('/driver/orders');
        console.log('API Response:', JSON.stringify(response.data, null, 2));
        setOrders(response.data);
      } catch (error) {
        console.error(
          'Error fetching assigned orders:',
          error.response?.data || error.message || error
        );
        setError(
          error.response?.data?.message || 'Failed to fetch assigned orders.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedOrders();
  }, []);

  if (loading) {
    console.log('Loading assigned orders...');
    return <div className="loader">Loading your assigned orders...</div>;
  }

  if (error) {
    console.log('Error message:', error);
    return <div className="error-message">{error}</div>;
  }

  console.log('Rendering assigned orders:', JSON.stringify(orders, null, 2));

  return (
    <div className="driver-orders">
      <h1>Your Assigned Orders</h1>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Provider</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customerId?.userId?.name || 'N/A'}</td>
                <td>{order.providerId?.restaurantName || 'N/A'}</td>
                <td>{order.status || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="empty-state">
                No assigned orders available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DriverOrders;
