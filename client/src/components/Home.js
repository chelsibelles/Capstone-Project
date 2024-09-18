import React, { useEffect, useState } from 'react';
import '../index.css';
import homeImage from '../assets/homeImage.jpg';

const Home = () => {
    const [flowers, setFlowers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [comments, setComments] = useState([]);

    // Fetch flowers, reviews, and comments
    useEffect(() => {
        const fetchFlowers = async () => {
            const response = await fetch('/api/flowers');
            const data = await response.json();
            setFlowers(data);
        };

        const fetchReviews = async () => {
            const response = await fetch('/api/reviews');
            const data = await response.json();
            setReviews(data);
        };

        const fetchComments = async () => {
            const response = await fetch('/api/comments');
            const data = await response.json();
            setComments(data);
        };

        fetchFlowers();
        fetchReviews();
        fetchComments();
    }, []);

    return (
        <div className="home-container">
            <header className="home-header">
                <img src={homeImage} alt="Home" className="home-image" />
                <h1>Flower Haven</h1>
                <p>
                    Flower Haven is a vibrant community for garden enthusiasts to share their
                    gardens, exchange care instructions, and engage in meaningful discussions.
                    Whether you're a seasoned gardener or just starting, Flower Haven offers 
                    a space to connect and grow together.
                </p>
            </header>

            {/* Display Flowers */}
            <section>
                <h2>Flowers</h2>
                <div className="flowers-container">
                    {flowers.length > 0 ? flowers.map(flower => (
                        <div key={flower.flower_id} className="flower-item">
                            <h3>{flower.name}</h3>
                            <p>{flower.description}</p>
                            <p>Care Instructions: {flower.care_instructions}</p>
                            <img src={flower.img_url} alt={flower.name} width="200" />
                        </div>
                    )) : <p>No flowers available at the moment.</p>}
                </div>
            </section>

            {/* Display Reviews */}
            <section>
                <h2>Reviews</h2>
                <div className="reviews-container">
                    {reviews.length > 0 ? reviews.map(review => (
                        <div key={review.id} className="review-item">
                            <p>{review.content}</p>
                            <p>By: {review.user}</p>
                        </div>
                    )) : <p>No reviews available at the moment.</p>}
                </div>
            </section>

            {/* Display Comments */}
            <section>
                <h2>Comments</h2>
                <div className="comments-container">
                    {comments.length > 0 ? comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <p>{comment.text}</p>
                            <p>On Flower: {comment.flower_id}</p>
                        </div>
                    )) : <p>No comments available at the moment.</p>}
                </div>
            </section>
        </div>
    );
};

export default Home;
