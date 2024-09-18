import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../index.css'; 

const Flower = () => {
  const { id } = useParams(); // Get the flower ID from the URL parameters
  const [flower, setFlower] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlower = async () => {
      try {
        const response = await fetch(`/api/flowers/${id}`);
        if (!response.ok) throw new Error('Failed to fetch flower');
        const data = await response.json();
        setFlower(data);
      } catch (error) {
        console.error('Error fetching flower data:', error);
        setError('Failed to load flower data. Please try again later.');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchFlower();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this flower?')) { // Confirmation dialog
      try {
        await fetch(`/api/flowers/${id}`, { method: 'DELETE' });
        navigate('/my-garden'); // Redirect to MyGarden after successful delete
      } catch (error) {
        console.error('Error deleting flower:', error);
        setError('Failed to delete flower. Please try again later.');
      }
    }
  };

  return (
    <div className="flower-container">
      {loading ? (
        <p>Loading...</p> // Show loading message while fetching
      ) : error ? (
        <p className="error-message">{error}</p> // Show error message if there is an error
      ) : flower ? (
        <>
          <h1>My Garden: {flower.name}</h1>
          <div className="flower-details">
            <p><strong>Description:</strong> {flower.description}</p>
            <p><strong>Care Instructions:</strong> {flower.care_instructions}</p>
          </div>
          <div className="flower-actions">
            <button className="edit-button" onClick={() => navigate(`/edit-flower/${id}`)}>Edit</button>
            <button className="delete-button" onClick={handleDelete}>Delete</button>
          </div>
        </>
      ) : (
        <p>No flower data available.</p> // Show message if no flower data is available
      )}
    </div>
  );
};

export default Flower;
