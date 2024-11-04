import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logoImage from '../Images/Logo.png'; // Adjust path as needed

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session storage on logout
    sessionStorage.clear();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logoImage} alt="Tiffin Connect Logo" />
      </Link>
      <div className="nav-links">
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
        <button onClick={handleLogout} className="nav-link">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
