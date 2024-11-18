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
import SubscriptionPlanList from './components/SubscriptionPlanList';
import CustomerProfile from './components/CustomerProfile';
import SubscriptionProcess from './components/SubscriptionProcess'; // Import SubscriptionProcess component
import './App.css';
import CheckoutPage from './components/CheckoutPage';
import BillingForm from './components/BillingForm';
import DriverProfile from './components/DriverProfile';
import DriverRegisterVehicle from './components/DriverRegisterVehicle';
import DriverOrders from './components/DriverOrders';
import AdminOrders from './components/AdminOrders'; 



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
            path="/customer-profile"
            element={<ProtectedRoute component={CustomerProfile} role="customer" />}
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
          {/* Route for subscription process to view all available tiffin subscriptions */}
          <Route
            path="/subscription-process"
            element={<SubscriptionProcess />}
          />
          <Route path="/checkout/:subscriptionId" element={<CheckoutPage />} />
          <Route path="/billing" element={<BillingForm />} />
          <Route path="/driver-profile" element={<ProtectedRoute component={DriverProfile} role="driver" />} />
          <Route path="/driver-register-vehicle" element={<ProtectedRoute component={DriverRegisterVehicle} role="driver" />} />
          <Route path="/driver-orders" element={<ProtectedRoute component={DriverOrders} role="driver" />} />

          <Route path="/admin/orders" element={<AdminOrders />} />


        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
