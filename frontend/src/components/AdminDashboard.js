import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminDashboard.css';
import './Auth.css';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUsers();
        await fetchProviders();
        await fetchOrders();
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://tiffinconnect.onrender.com/api/admin/users', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await axios.get('https://tiffinconnect.onrender.com/api/admin/providers', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      setProviders(response.data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://tiffinconnect.onrender.com/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await axios.get(`https://tiffinconnect.onrender.com/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      setSelectedUser(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditMode(true);
  };

  const handleSaveUser = async () => {
    try {
      await axios.put(`https://tiffinconnect.onrender.com/api/admin/users/${selectedUser._id}`, selectedUser, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      setEditMode(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`https://tiffinconnect.onrender.com/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return <div className="loader">Loading data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-cards fancy-cards">
        <div className="card fancy-card users-card">
          <h3>Total Users</h3>
          <div className="card-content">
            <i className="fas fa-users"></i>
            <p>{users.length}</p>
          </div>
        </div>
        <div className="card fancy-card providers-card">
          <h3>Total Providers</h3>
          <div className="card-content">
            <i className="fas fa-utensils"></i>
            <p>{providers.length}</p>
          </div>
        </div>
        <div
          className="card fancy-card orders-card"
          onClick={() => navigate('/admin/orders')}
        >
          <h3>Total Orders</h3>
          <div className="card-content">
            <i className="fas fa-box"></i>
            <p>{orders.length}</p>
          </div>
        </div>
      </div>

      <section className="table-section">
        <h2>Manage Users</h2>
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="action-button view-button"
                      onClick={() => handleViewUser(user._id)}
                    >
                      View
                    </button>
                    <button
                      className="action-button edit-button"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editMode ? 'Edit User' : 'View User'}</h3>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={selectedUser.name || ''}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={selectedUser.email || ''}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <input
                type="text"
                name="role"
                value={selectedUser.role || ''}
                onChange={handleInputChange}
                readOnly={!editMode}
              />
            </div>
            <div className="modal-actions">
              {editMode && (
                <button onClick={handleSaveUser} className="save-button">
                  Save
                </button>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="close-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
