import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import CustomerDashboard from './components/CustomerDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';
import Home from './components/Home';
import Footer from './components/Footer';


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
        <Route path="/" element={<Home />} />
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
            path='admin-dashboard'
            element={<ProtectedRoute component={AdminDashboard} role="admin"/>}
            />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
};

export default App;
