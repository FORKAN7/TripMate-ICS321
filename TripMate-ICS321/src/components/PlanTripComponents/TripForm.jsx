import React, { useState, useEffect } from 'react';
 
function TripForm({ tripName, setTripName, selectedCity, setSelectedCity, numDays, setNumDays, onCreate, formError }) {
 
    const [cities, setCities] = useState([]);
    const dayOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
 
    useEffect(() => {
        const fetchCities = async () => {
            try {
const res = await fetch("http://localhost:3001/api/admin/cities-list");                const data = await res.json();
                setCities(Array.isArray(data) ? data.map(c => c.name) : []);
            } catch {
                setCities(["AlHassa", "Riyadh", "Jeddah", "Abha", "AlUla"]);
            }
        };
        fetchCities();
    }, []);
 
    return (
        <div className="trip-form">
 
            <div className="trip-form__field">
                <label className="trip-form__label">Trip Name</label>
                <input
                    className="trip-form__input"
                    type="text"
                    placeholder="e.g. Al-Hassa vacation"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                />
            </div>
 
            <div className="trip-form__field">
                <label className="trip-form__label">Destination</label>
                <select
                    className="trip-form__select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>
 
            <div className="trip-form__field">
                <label className="trip-form__label">Duration</label>
                <select
                    className="trip-form__select"
                    value={numDays}
                    onChange={(e) => setNumDays(Number(e.target.value))}
                >
                    {dayOptions.map((day) => (
                        <option key={day} value={day}>{day} {day === 1 ? "Day" : "Days"}</option>
                    ))}
                </select>
            </div>
 
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