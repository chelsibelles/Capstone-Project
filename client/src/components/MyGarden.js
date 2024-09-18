import React, { useState, useEffect } from 'react';
import '../index.css';

const MyGarden = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('/api/plants', { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch plants');
          return;
        }

        const data = await response.json();
        setPlants(data);
      } catch (error) {
        setError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  return (
    <div>
      <div className="mygarden-container">
        <h1>My Garden</h1>
        {loading && <p>Loading plants...</p>}
        {error && <p className="error-message">{error}</p>}
        {plants.length > 0 ? (
          <ul className="plants-list">
            {plants.map((plant) => (
              <li key={plant.flower_id} className="plant-item">
                {plant.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No plants found in your garden.</p>
        )}
      </div>
    </div>
  );
};

export default MyGarden;
