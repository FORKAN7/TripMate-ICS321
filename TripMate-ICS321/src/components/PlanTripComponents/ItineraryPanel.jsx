import React from "react";

function ItineraryPanel({ tripName, itinerary, numDays, onRemove }) {
    const days = Array.from({ length: numDays }, (_, i) => i + 1);

    return (
        <div className="itinerary-panel">
            <h2 className="itinerary-panel__title">🗒️ Your Itinerary</h2>

            {/* Display the Trip Name prominently if it exists [cite: 183] */}
            {tripName && (
                <p className="itinerary-panel__trip-name" style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#2d5ab8',
                    margin: '0 0 15px 0',
                    borderBottom: '1px dashed #ddd',
                    paddingBottom: '8px'
                }}>
                    {tripName}
                </p>
            )}

            {days.map((day) => {
                const places = itinerary[day] || [];

                return (
                    <div key={day} className="itinerary-panel__day">
                        <div className="itinerary-panel__day-header">
                            <span>Day {day}</span>
                            <span className="itinerary-panel__count">
                                {places.length} {places.length === 1 ? "place" : "places"}
                            </span>
                        </div>

                        {places.length === 0 ? (
                            <p className="itinerary-panel__empty">No places added yet</p>
                        ) : (
                            <ul className="itinerary-panel__list">
                                {places.map((place) => (
                                    <li key={place.id} className="itinerary-panel__item">
                                        <span>{place.name}</span>
                                        <button
                                            className="itinerary-panel__remove"
                                            onClick={() => onRemove(day, place.id)}
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default ItineraryPanel;