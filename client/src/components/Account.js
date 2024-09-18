import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'; // Import global styles

const Account = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
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
          setError('Failed to load user data. Please try again later.');
        } finally {
          setLoading(false); // Set loading to false after data is fetched
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
    <div className="account-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p> // Display error message if any
      ) : user ? (
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
        <p>User data not found.</p> // Handle case where user data is not available
      )}
    </div>
  );
};

export default Account;
