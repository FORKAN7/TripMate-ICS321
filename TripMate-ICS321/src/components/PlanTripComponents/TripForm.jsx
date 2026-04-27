import React from 'react';
// This component doesn't store state itself — it just displays and reports changes
function TripForm({ tripName, setTripName, selectedCity, setSelectedCity, numDays, setNumDays, onCreate, formError }) {

    // List of Saudi cities the organizer can choose from
    const cities = ["Al Hassa", "Riyadh", "Jeddah", "Abha", "AlUla"];

    // Day options: 1 to 7
    const dayOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12];

    return (
        <div className="trip-form">

            {/* Trip Name Input */}
            <div className="trip-form__field">
                <label className="trip-form__label">Trip Name</label>
                <input
                    className="trip-form__input"
                    type="text"
                    placeholder="e.g. Al-Hassa vacation"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}  // tells parent the new value
                />
            </div>

            {/* City Dropdown */}
            <div className="trip-form__field">
                <label className="trip-form__label">Destination</label>
                <select
                    className="trip-form__select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}  // tells parent chosen city
                >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>

            {/* Number of Days Dropdown */}
            <div className="trip-form__field">
                <label className="trip-form__label">Duration</label>
                <select
                    className="trip-form__select"
                    value={numDays}
                    onChange={(e) => setNumDays(Number(e.target.value))}  // convert to number!
                >
                    {dayOptions.map((day) => (
                        <option key={day} value={day}>{day} {day === 1 ? "Day" : "Days"}</option>
                    ))}
                </select>
            </div>

            {/* Create Button */}
            <button className="trip-form__add-btn" onClick={onCreate}>
                + Create Trip
            </button>

            {formError && (
                <p className="trip-form__error">{formError}</p>
            )}

        </div>
    );
}

export default TripForm;