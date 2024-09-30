import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session storage on logout
    sessionStorage.clear();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Tiffin Connect</h1>
      <div className="nav-links">
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
        <button onClick={handleLogout} className="nav-link">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
