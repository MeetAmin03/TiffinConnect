import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Register.css'; // Custom styles for Register page

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role is set to 'customer'
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Add a success message state
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset the error message

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);

      // Show success message and redirect after a delay
      setSuccessMessage(`${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully! Redirecting to login...`);
      setTimeout(() => {
        navigate('/login'); // Redirect to login after showing the success message
      }, 2000); // Delay for 2 seconds
    } catch (error) {
      setError(error.message); // Set the error message if any
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* Role dropdown */}
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="customer">Customer</option>
          <option value="provider">Provider</option>
          <option value="driver">Driver</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>} {/* Display success message */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
