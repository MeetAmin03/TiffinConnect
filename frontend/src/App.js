import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import CustomerDashboard from './components/CustomerDashboard';
import ProviderDashboard from './components/ProviderDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import Home from './components/Home';
import Footer from './components/Footer';
import ProviderProfile from './components/ProviderProfile';
import MenuItemList from './components/MenuItemList';
import './App.css';
import SubscriptionPlanList from './components/SubscriptionPlanList';


const ProtectedRoute = ({ component: Component, role, ...rest }) => {
  const userRole = sessionStorage.getItem('role');
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
            path="/admin-dashboard"
            element={<ProtectedRoute component={AdminDashboard} role="admin" />}
          />
          <Route
            path="/provider-profile"
            element={<ProtectedRoute component={ProviderProfile} role="provider" />}
          />
          <Route
            path="/menu-items"
            element={<ProtectedRoute component={MenuItemList} role="provider" />}
          />
          <Route
            path="/subscription-plans"
            element={<ProtectedRoute component={SubscriptionPlanList} role="provider" />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
