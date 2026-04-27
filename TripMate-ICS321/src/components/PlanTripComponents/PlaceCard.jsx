import "../../styles/PlaceCard.css";

function PlaceCard({ place, onAdd, onClick }) {
    return (
        <div className="place-card" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="card-image-wrapper">
                <img src={place.image} alt={place.name} className="card-image" />
                <span className="card-badge">{place.category}</span>

                {onAdd && (
                    <button
                        className="card-add-btn"
                        onClick={(e) => {
                            e.stopPropagation(); // Stops the modal from opening when clicking "+"
                            onAdd(place);
                        }}
                    >
                        +
                    </button>
                )}
            </div>

            <div className="card-info">
                <h3 className="card-name">{place.name}</h3>
                <p className="card-description">{place.description}</p>
                <div className="card-footer">
                    <span className="card-rating">⭐ {place.rating}</span>
                </div>
            </div>
        </div>
    );
}

export default PlaceCard;