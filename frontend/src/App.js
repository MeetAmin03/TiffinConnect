import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import CustomerDashboard from './components/CustomerDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard'; // Import AdminDashboard
import './App.css';

// Higher-Order Component (HOC) for protecting routes
const ProtectedRoute = ({ component: Component, role, ...rest }) => {
  const userRole = sessionStorage.getItem('role'); // Get the user role from sessionStorage

  return userRole === role ? <Component {...rest} /> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/customer-dashboard"
            element={<ProtectedRoute component={CustomerDashboard} role="customer" />}
          />
          <Route
            path="/provider-dashboard"
            element={<ProtectedRoute component={ProviderDashboard} role="provider" />}
          />
          <Route
            path="/driver-dashboard"
            element={<ProtectedRoute component={DriverDashboard} role="driver" />}
          />
          <Route
            path="/admin-dashboard"
            element={<ProtectedRoute component={AdminDashboard} role="admin" />}
          /> {/* Admin protected route */}
          <Route path="/" element={<h1>Welcome to Tiffin Connect</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
