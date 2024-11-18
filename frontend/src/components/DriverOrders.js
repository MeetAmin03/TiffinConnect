import React, { useEffect, useState } from 'react';
import axios from '../api';
import './DriverOrders.css';

const DriverOrders = () => {
  const [orders, setOrders] = useState([]);
  const [driverId, setDriverId] = useState(null);

  useEffect(() => {
    // Fetch all orders and the logged-in driver details
    const fetchOrdersAndDriver = async () => {
      try {
        // Fetch logged-in driver details
        const driverResponse = await axios.get('/driver/profile');
        setDriverId(driverResponse.data._id);

        // Fetch all orders
        const ordersResponse = await axios.get('/driver/orders');
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error('Error fetching orders or driver details:', error);
      }
    };

    fetchOrdersAndDriver();
  }, []);

  // Function to assign an order to the logged-in driver
  const handleAssignOrder = async (orderId) => {
    try {
      const response = await axios.post('/driver/assignOrder', { orderId });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, driverId: driverId, status: 'assigned' } : order
        )
      );
      alert('Order successfully assigned to you.');
    } catch (error) {
      console.error('Error assigning order:', error);
    }
  };

  // Function to unassign an order from the logged-in driver
  const handleUnassignOrder = async (orderId) => {
    try {
      const response = await axios.post('/driver/unassignOrder', { orderId });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, driverId: null, status: 'pending' } : order
        )
      );
      alert('Order successfully unassigned.');
    } catch (error) {
      console.error('Error unassigning order:', error);
    }
  };

  return (
    <div className="driver-orders">
      <h1>Orders</h1>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Provider</th>
            <th>Status</th>
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
                <td>
                  {order.driverId === null
                    ? 'Unassigned'
                    : order.driverId === driverId
                    ? 'Assigned to You'
                    : 'Assigned'}
                </td>
                <td>
                  {order.driverId === null ? (
                    <button
                      className="assign-button"
                      onClick={() => handleAssignOrder(order._id)}
                    >
                      Assign
                    </button>
                  ) : order.driverId === driverId ? (
                    <button
                      className="unassign-button"
                      onClick={() => handleUnassignOrder(order._id)}
                    >
                      Unassign
                    </button>
                  ) : (
                    <span>Assigned</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="empty-state">
                No orders available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DriverOrders;
