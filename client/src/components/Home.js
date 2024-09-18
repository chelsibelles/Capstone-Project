import React from 'react';
import '../index.css';
import homeImage from '../assets/homeImage.jpg';

const Home = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <img src={homeImage} alt="Home" className="home-image" />
                <h1>Flower Haven</h1>
                <p>Flower Haven is a vibrant community for garden enthusiasts to share their
                gardens, exchange care instructions, and engage in meaningful discussions. 
                Whether you're a seasoned gardener or just starting, Flower Haven offers 
                a space to connect and grow together.
                </p>
            </header>
        </div>
    );
};

export default Home;