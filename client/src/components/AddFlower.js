import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'; 

const AddFlower = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while submitting
    setError(null); // Reset error state before submission

    try {
      const response = await fetch('/api/flowers', {
        method: 'POST',
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

      if (!response.ok) throw new Error('Failed to add flower');
      navigate('/my-garden'); // Redirect to MyGarden after successful addition
    } catch (error) {
      console.error('Error adding flower:', error);
      setError('Failed to add flower. Please try again.'); // Set error message for user
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  return (
    <div className="add-flower-container">
      <h1>Add a New Flower</h1>
      <form onSubmit={handleSubmit} className="add-flower-form">
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
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Adding Flower...' : 'Add Flower'}
        </button>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
      </form>
    </div>
  );
};

export default AddFlower;
