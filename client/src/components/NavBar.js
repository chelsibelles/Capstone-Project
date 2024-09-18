import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const NavBar = ({ isAuthenticated, onLogout }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        {!isAuthenticated ? (
          <>
            <Link to="/register" className="nav-link">Register</Link>
            <Link to="/login" className="nav-link">Login</Link>
          </>
        ) : (
          <>
            <div className="dropdown">
              <button 
                onClick={handleDropdownToggle} 
                className="dropdown-button" 
                aria-expanded={isDropdownOpen} 
                aria-haspopup="true"
                aria-label="Flowers Menu"
              >
                Flowers
              </button>
              {isDropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/flowers/add" className="nav-link">Add Flower</Link>
                </div>
              )}
            </div>
            <Link to="/account" className="nav-link">Account</Link>
            <button onClick={onLogout} className="nav-link">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
