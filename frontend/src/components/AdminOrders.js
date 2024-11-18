import React, { useEffect, useState } from 'react';
import axios from '../api';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrdersAndDrivers = async () => {
      try {
        console.log('Fetching orders and drivers...');

        // Fetch all orders
        const ordersResponse = await axios.get('/admin/orders');
        console.log('Orders fetched:', ordersResponse.data);
        setOrders(ordersResponse.data);

        // Fetch all drivers
        const driversResponse = await axios.get('/admin/drivers');
        console.log('Drivers fetched:', driversResponse.data);
        setDrivers(driversResponse.data);

        setLoading(false);
        console.log('Data fetching completed successfully.');
      } catch (error) {
        console.error('Error fetching orders or drivers:', error);
        setError('Failed to load orders or drivers. Please try again.');
        setLoading(false);
      }
    };

    fetchOrdersAndDrivers();
  }, []);

  const handleAssignOrder = async (orderId, driverId) => {
    console.log(`Assigning order: ${orderId} to driver: ${driverId}`);

    if (!driverId) {
      alert('Please select a driver to assign.');
      return;
    }

    const confirmation = window.confirm(
      `Are you sure you want to assign this order to the selected driver?`
    );

    if (confirmation) {
      try {
        const response = await axios.post('/admin/assignOrder', {
          orderId,
          driverId,
        });

        console.log('Order assignment response:', response.data);

        // Update the order list to reflect the assigned driver
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, driverId } : order
          )
        );

        alert('Order successfully assigned.');
      } catch (error) {
        console.error('Error assigning order:', error);
        alert('Failed to assign the order. Please try again.');
      }
    }
  };

  if (loading) {
    console.log('Loading data...');
    return <div className="loader">Loading orders and drivers...</div>;
  }

  if (error) {
    console.error('Error state:', error);
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-orders">
      <h1>Orders</h1>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Provider</th>
            <th>Status</th>
            <th>Assigned Driver</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customerId?.name || 'N/A'}</td>
                <td>{order.providerId?.restaurantName || 'N/A'}</td>
                <td>{order.status}</td>
                <td>
                  {order.driverId
                    ? drivers.find((driver) => driver._id === order.driverId)?.userId.name || 'N/A'
                    : 'Unassigned'}
                </td>
                <td>
                  <select
                    onChange={(e) => handleAssignOrder(order._id, e.target.value)}
                    value={order.driverId || ''}
                  >
                    <option value="" disabled>
                      {order.driverId ? 'Reassign Driver' : 'Assign Driver'}
                    </option>
                    {drivers.map((driver) => (
                      <option key={driver._id} value={driver._id}>
                        {driver.userId?.name || 'Unknown Driver'}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty-state">
                No orders available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;