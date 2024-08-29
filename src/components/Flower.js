import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from './NavBar'; 
import './index.css'; 

const Flower = () => {
  const { id } = useParams(); // Get the flower ID from the URL parameters
  const [flower, setFlower] = useState(null);
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
      }
    };

    fetchFlower();
  }, [id]);

  const handleDelete = async () => {
    try {
      await fetch(`/api/flowers/${id}`, { method: 'DELETE' });
      navigate('/mygarden'); // Redirect to MyGarden after successful delete
    } catch (error) {
      console.error('Error deleting flower:', error);
    }
  };

  return (
    <>
      <NavBar /> 
      <div className="flower-container">
        {flower ? (
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
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default Flower;
