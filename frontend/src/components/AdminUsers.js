// AdminUsers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://tiffinconnect.onrender.com/api/admin/users', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
    return <div className="loader">Loading users...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-users">
      <h1>Manage Users</h1>
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

export default AdminUsers;
