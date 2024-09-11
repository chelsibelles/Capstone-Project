import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar'; 
import '../index.css'; 

const Account = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token'); // Example token check
      if (!token) {
        navigate('/login'); // Redirect to login if no token
        return;
      }
      setIsAuthenticated(true);
    };

    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/user'); 
          if (!response.ok) throw new Error('Failed to fetch user data');
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    setIsAuthenticated(false);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <>
      <NavBar /> 
      <div className="account-container">
        {user ? (
          <>
            <h1>My Profile</h1>
            <div className="account-details">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default Account;
