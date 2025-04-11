import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; // ← added useNavigate
import '../styles/Navbar.css';

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate(); // ← hook for navigation

  const handleLogout = () => {
    logout();         // clears token/session
    navigate('/login'); // redirects to login page
  };

  return (
    <header className="navbar">
      <nav className="navbar-container">
        <Link to="/" className="navbar-brand">CoinDCX Trading</Link>
        <div className="navbar-links">
          {token ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="btn logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn register-btn">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
