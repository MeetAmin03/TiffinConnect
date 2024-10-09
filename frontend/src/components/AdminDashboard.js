import React, { useState, useEffect } from 'react';
import './adminDashboard.css'; 
import './Auth.css';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State to hold selected user for view/edit
  const [selectedProvider, setSelectedProvider] = useState(null); // State to hold selected provider for view/edit
  const [editMode, setEditMode] = useState(false); // State to handle edit mode
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUsers();
        await fetchProviders();
        await fetchOrders();
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}` // Pass the JWT token
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch providers from the backend
  const fetchProviders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/providers', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      setProviders(response.data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // View User Details
  const handleViewUser = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setSelectedUser(response.data); // Set the selected user data in state
      setEditMode(false); // Disable edit mode when viewing
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Edit User - Enter edit mode
  const handleEditUser = (user) => {
    setSelectedUser(user); // Set the selected user for editing
    setEditMode(true); // Enable edit mode
  };

  // Save Edited User
  const handleSaveUser = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${selectedUser._id}`, selectedUser, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setEditMode(false); // Exit edit mode
      fetchUsers(); // Refresh the user list after editing
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // View Provider Details
  const handleViewProvider = async (providerId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/providers/${providerId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setSelectedProvider(response.data); // Set the selected provider data in state
      setEditMode(false); // Disable edit mode when viewing
    } catch (error) {
      console.error('Error fetching provider:', error);
    }
  };

  // Edit Provider - Enter edit mode
  const handleEditProvider = (provider) => {
    setSelectedProvider(provider); // Set the selected provider for editing
    setEditMode(true); // Enable edit mode
  };

  // Save Edited Provider
  const handleSaveProvider = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/providers/${selectedProvider._id}`, selectedProvider, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      setEditMode(false); // Exit edit mode
      fetchProviders(); // Refresh the provider list after editing
    } catch (error) {
      console.error('Error updating provider:', error);
    }
  };

  // Handle input changes for editing
  const handleInputChange = (event, type) => {
    const { name, value } = event.target;
    if (type === 'user') {
      setSelectedUser({ ...selectedUser, [name]: value });
    } else if (type === 'provider') {
      setSelectedProvider({ ...selectedProvider, [name]: value });
    }
  };

  // Delete User
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        setUsers(users.filter(user => user._id !== userId)); // Remove user from state
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Delete Provider
  const handleDeleteProvider = async (providerId) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/providers/${providerId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        setProviders(providers.filter(provider => provider._id !== providerId)); // Remove provider from state
      } catch (error) {
        console.error('Error deleting provider:', error);
      }
    }
  };

  // Handle loading and error states
  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Manage Users Section */}
      <section>
        <h2>Manage Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleViewUser(user._id)}>View</button>
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* View or Edit User Form */}
        {selectedUser && (
          <div className="form-container">
            <div className="form-card">
              {/* Cross button to close the form */}
              <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>

              <h3>{editMode ? 'Edit User' : 'View User'}</h3>
              <div className="form-group">
                <label>Name:</label>
                <input
                  className="form-input"
                  name="name"
                  value={selectedUser.name}
                  onChange={(e) => handleInputChange(e, 'user')}
                  readOnly={!editMode}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  className="form-input"
                  name="email"
                  value={selectedUser.email}
                  onChange={(e) => handleInputChange(e, 'user')}
                  readOnly={!editMode}
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <input
                  className="form-input"
                  name="role"
                  value={selectedUser.role}
                  onChange={(e) => handleInputChange(e, 'user')}
                  readOnly={!editMode}
                />
              </div>
              <div className="form-actions">
                {editMode ? (
                  <div>
                    <button className="btn btn-save" onClick={handleSaveUser}>Save</button>
                    <button className="btn btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Manage Providers Section */}
      <section>
        <h2>Manage Providers</h2>
        <table>
          <thead>
            <tr>
              <th>Restaurant Name</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map(provider => (
              <tr key={provider._id}>
                <td>{provider.restaurantName}</td>
                <td>{provider.rating}</td>
                <td>
                  <button onClick={() => handleViewProvider(provider._id)}>View</button>
                  <button onClick={() => handleEditProvider(provider)}>Edit</button>
                  <button onClick={() => handleDeleteProvider(provider._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* View or Edit Provider Form */}
        {selectedProvider && (
          <div className="form-container">
            <div className="form-card">
              {/* Cross button to close the form */}
              <button className="close-btn" onClick={() => setSelectedProvider(null)}>×</button>

              <h3>{editMode ? 'Edit Provider' : 'View Provider'}</h3>
              <div className="form-group">
                <label>Restaurant Name:</label>
                <input
                  className="form-input"
                  name="restaurantName"
                  value={selectedProvider.restaurantName}
                  onChange={(e) => handleInputChange(e, 'provider')}
                  readOnly={!editMode}
                />
              </div>
              <div className="form-group">
                <label>Rating:</label>
                <input
                  className="form-input"
                  name="rating"
                  value={selectedProvider.rating}
                  onChange={(e) => handleInputChange(e, 'provider')}
                  readOnly={!editMode}
                />
              </div>
              <div className="form-actions">
                {editMode ? (
                  <div>
                    <button className="btn btn-save" onClick={handleSaveProvider}>Save</button>
                    <button className="btn btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Manage Orders Section */}
      <section>
        <h2>Manage Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Provider</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customerId?.name || 'Unknown Customer'}</td>
                <td>{order.providerId?.restaurantName || 'Unknown Provider'}</td>
                <td>${order.totalAmount}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
