import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import './index.css'; 

const EditFlower = () => {
  const { flowerId } = useParams(); // Get flowerId from URL params
  const [flower, setFlower] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [imageURL, setImageURL] = useState('');
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
      navigate('/mygarden'); // Redirect to MyGarden after successful update
    } catch (error) {
      console.error('Error updating flower:', error);
    }
  };

  return (
    <>
      <NavBar /> 
      <div className="edit-flower-container">
        <h1>Edit Flower: {name}</h1>
        {flower ? (
          <form onSubmit={handleSubmit} className="edit-flower-form">
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
            <button type="submit" className="submit-button">Update Flower</button>
          </form>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default EditFlower;
