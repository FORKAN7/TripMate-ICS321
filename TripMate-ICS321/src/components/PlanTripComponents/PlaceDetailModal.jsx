import { useState, useEffect } from "react";
import "../../styles/PlaceDetailModal.css";

const API = import.meta.env.VITE_API;
const getToken = () => localStorage.getItem("tripmate_token");

const getImageSrc = (place) => {
    const raw = place.image_url || place.image;
    if (!raw) return "/placeholder.jpg";
    if (raw.startsWith("http")) return raw;
    const filename = raw.split("/").pop();
    return `/src/assets/imgs/${filename}`;
};

function PlaceDetailModal({ place, onClose, onAddToTrip }) {
    if (!place) return null;

    const [comment, setComment] = useState("");
    const [rating,  setRating]  = useState(0);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const placeId = place.place_id || place.id;

    // ── Fetch reviews from DB ──────────────────────────────────────────────
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res  = await fetch(`${API}/reviews/${placeId}`);
                const data = await res.json();
                setReviews(Array.isArray(data) ? data : []);
            } catch {
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [placeId]);

    const avgRating =
        reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : place.rating;

    // ── Submit review to DB ────────────────────────────────────────────────
    const handleAddReview = async () => {
        if (!comment || rating === 0) return;

        try {
            const res  = await fetch(`${API}/reviews`, {
                method:  "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ place_id: placeId, rating, comment }),
            });

            const saved = await res.json();

            if (res.ok) {
                // أضف الـ review الجديد فوق القائمة
                setReviews(prev => [saved, ...prev]);
                setComment("");
                setRating(0);
            }
        } catch {
            console.error("Failed to submit review");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                {/* ── Hero ── */}
                <div className="modal-hero">
                    <img
                        src={getImageSrc(place)}
                        alt={place.name}
                        className="modal-image"
                        onError={e => { e.target.onerror = null; e.target.src = "/placeholder.jpg"; }}
                    />
                    <button className="modal-close" onClick={onClose}>&times;</button>
                    <div className="modal-hero-text">
                        <span className="modal-badge">
                            <span className="modal-badge-icon">🏛️</span>
                            {place.category}
                        </span>
                        <h2 className="modal-title">{place.name}</h2>
                    </div>
                </div>

                {/* ── Info ── */}
                <div className="modal-info">
                    <div className="modal-meta">
                        <span className="meta-item location">📍 {place.city_name || place.city}</span>
                        <span className="meta-item rating">⭐ {avgRating} ({reviews.length} reviews)</span>
                        <span className="meta-item duration">⏱️ 2-3 hrs</span>
                    </div>

                    <p className="modal-description">{place.description}</p>

                    {onAddToTrip && (
                        <button className="modal-add-btn" onClick={() => onAddToTrip(place)}>
                            + Add to Trip
                        </button>
                    )}

                    {/* ── Add Review ── */}
                    <div className="review-section">
                        <h3>Add Review</h3>

                        <textarea
                            placeholder="Write your comment..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />

                        <div className="stars">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    style={{
                                        cursor:   "pointer",
                                        color:    star <= rating ? "gold" : "#ccc",
                                        fontSize: "22px",
                                    }}
                                >★</span>
                            ))}
                        </div>

                        <button onClick={handleAddReview} disabled={!comment || rating === 0}>
                            Submit Review
                        </button>
                    </div>

                    {/* ── Reviews List ── */}
                    <div className="reviews-list">
                        <h3>Reviews</h3>
                        {loading ? (
                            <p>Loading reviews...</p>
                        ) : reviews.length === 0 ? (
                            <p>No reviews yet. Be the first!</p>
                        ) : (
                            reviews.map((rev, i) => (
                                <div key={rev.review_id || i} className="review-item">
                                    <strong>{rev.user_name || rev.name || "Anonymous"}</strong>
                                    <div>
                                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
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