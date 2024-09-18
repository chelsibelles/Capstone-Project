import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../index.css'; 

const EditFlower = () => {
  const { flowerId } = useParams(); // Get flowerId from URL params
  const [flower, setFlower] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlower = async () => {
      try {
        const response = await fetch(`/api/flowers/${flowerId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token in headers
          }
        });

        if (!response.ok) throw new Error('Failed to fetch flower data');
        const data = await response.json();
        setFlower(data);
        setName(data.name);
        setDescription(data.description);
        setCareInstructions(data.care_instructions);
        setImageURL(data.img_url);
      } catch (error) {
        console.error('Error fetching flower data:', error);
        setError('Failed to load flower data. Please try again later.');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchFlower();
  }, [flowerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/flowers/${flowerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token in headers
        },
        body: JSON.stringify({
          name,
          description,
          care_instructions: careInstructions,
          img_url: imageURL
        })
      });

      if (!response.ok) throw new Error('Failed to update flower');
      navigate('/my-garden'); // Redirect to MyGarden after successful update
    } catch (error) {
      console.error('Error updating flower:', error);
      setError('Failed to update flower. Please try again later.');
    }
  };

  return (
    <div className="edit-flower-container">
      <h1>Edit Flower: {name}</h1>
      {loading ? (
        <p>Loading...</p> // Show loading message while fetching
      ) : error ? (
        <p className="error-message">{error}</p> // Show error message if there is an error
      ) : flower ? (
        <form onSubmit={handleSubmit} className="edit-flower-form">
          <label htmlFor="name">
            Flower Name:
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label htmlFor="description">
            Description:
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label htmlFor="careInstructions">
            Care Instructions:
            <textarea
              id="careInstructions"
              value={careInstructions}
              onChange={(e) => setCareInstructions(e.target.value)}
              required
            />
          </label>
          <label htmlFor="imageURL">
            Image URL:
            <input
              id="imageURL"
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            />
          </label>
          <button type="submit" className="submit-button">Update Flower</button>
        </form>
      ) : (
        <p>No flower data available.</p> // Show message if flower data is not available
      )}
    </div>
  );
};

export default EditFlower;
