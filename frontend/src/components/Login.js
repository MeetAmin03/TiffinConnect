import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Login.css'; // Custom styles for login form

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Store token and role in sessionStorage
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('role', data.role);

      // Redirect based on role
      if (data.role === 'customer') {
        navigate('/customer-dashboard');
      } else if (data.role === 'provider') {
        navigate('/provider-dashboard');
      } else if (data.role === 'driver') {
        navigate('/driver-dashboard');
      } else if (data.role === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="decorative-circle"></div>
      <div className="decorative-circle"></div>
      <div className="decorative-circle"></div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
