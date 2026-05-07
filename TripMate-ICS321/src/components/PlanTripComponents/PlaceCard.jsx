import "../../styles/PlaceCard.css";

function PlaceCard({ place, onAdd, onClick }) {

    const getImageUrl = (place) => {
        const raw = place.image_url || place.image;
        if (!raw) return "/placeholder.jpg";
        if (raw.startsWith("http")) return raw;
        // استخرج اسم الملف فقط → src/assets/imgs/Jabal-Alqara.jpg
        const filename = raw.split("/").pop();
        return `/src/assets/imgs/${filename}`;
    };

    return (
        <div className="place-card" onClick={onClick} style={{ cursor: "pointer" }}>
            <div className="card-image-wrapper">
                <img
                    src={getImageUrl(place)}
                    alt={place.name}
                    className="card-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.jpg";
                    }}
                />
                <span className="card-badge">{place.category}</span>

                {onAdd && (
                    <button
                        className="card-add-btn"
                        onClick={(e) => {
                            e.stopPropagation();
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