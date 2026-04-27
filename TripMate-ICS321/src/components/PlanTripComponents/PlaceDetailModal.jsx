import React, { useState } from "react";
import "../../styles/PlaceDetailModal.css";

function PlaceDetailModal({ place, onClose, onAddToTrip }) {
    if (!place) return null;

    const [comment, setComment] = useState("");
    const [userName, setUserName] = useState("");
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);


    const avgRating =
        reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : place.rating;

    // Handle adding a new review
    const handleAddReview = () => {
        if (!userName || !comment || rating === 0) return;

        const newReview = {
            name: userName,
            comment,
            rating,
        };

        setReviews([newReview, ...reviews]); // Add new review to the top of the list

        // reset
        setComment("");
        setUserName("");
        setRating(0);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* 1. Modal Container */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                {/* 2. Top Section (Image + Text Overlays) */}
                <div className="modal-hero">
                    <img src={place.image} alt={place.name} className="modal-image" />
                    
                    {/* Positioned at top-right */}
                    <button className="modal-close" onClick={onClose}>&times;</button>
                    
                    {/* Positioned at bottom-left */}
                    <div className="modal-hero-text">
                        <span className="modal-badge">
                            <span className="modal-badge-icon">🏛️</span>
                            {place.category}
                        </span>
                        <h2 className="modal-title">{place.name}</h2>
                    </div>
                </div>

                {/* 3. Bottom Section (Info + Button) */}
                <div className="modal-info">
                    <div className="modal-meta">
                        <span className="meta-item location">📍 {place.city}</span>
                        <span className="meta-item rating"> ⭐ {avgRating} ({reviews.length})</span>
                        <span className="meta-item duration">⏱️ 2-3 hrs</span>
                    </div>
                    
                    <p className="modal-description">{place.description}</p>


                    {/* Add Review */}
                    <div className="review-section">
                        <h3>Add Review</h3>

                        <input
                            type="text"
                            placeholder="Your name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />

                        <textarea
                            placeholder="Write your comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        {/* Stars */}
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    style={{
                                        cursor: "pointer",
                                        color: star <= rating ? "gold" : "#ccc",
                                        fontSize: "22px",
                                    }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <button onClick={handleAddReview}>
                            Submit Review
                        </button>
                    </div>

                    {/* Reviews List */}
                    <div className="reviews-list">
                        <h3>Reviews</h3>

                        {reviews.length === 0 ? (
                            <p>No reviews yet</p>
                        ) : (
                            reviews.map((rev, index) => (
                                <div key={index} className="review-item">
                                    <strong>{rev.name}</strong>

                                    <div>
                                        {"★".repeat(rev.rating)}
                                        {"☆".repeat(5 - rev.rating)}
                                    </div>

                                    <p>{rev.comment}</p>
                                </div>
                            ))
                        )}
                    </div>


                </div>
            </div>
        </div>
    );
}

export default PlaceDetailModal;