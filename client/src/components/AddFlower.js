import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar'; 
import '../index.css'; 

const AddFlower = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [imageURL, setImageURL] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      navigate('/mygarden'); // Redirect to MyGarden after successful addition
    } catch (error) {
      console.error('Error adding flower:', error);
    }
  };

  return (
    <>
      <NavBar /> 
      <div className="add-flower-container">
        <h1>Add a New Flower</h1>
        <form onSubmit={handleSubmit} className="add-flower-form">
          <label>
            Flower Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Care Instructions:
            <textarea
              value={careInstructions}
              onChange={(e) => setCareInstructions(e.target.value)}
              required
            />
          </label>
          <label>
            Image URL:
            <input
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            />
          </label>
          <button type="submit" className="submit-button">Add Flower</button>
        </form>
      </div>
    </>
  );
};

export default AddFlower;
