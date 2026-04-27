import { useState } from "react";
import TripForm from "../components/PlanTripComponents/TripForm";
import CategoryFilter from "../components/PlanTripComponents/CategoryFilter";
import DayTabs from "../components/PlanTripComponents/DayTabs";
import ItineraryPanel from "../components/PlanTripComponents/ItineraryPanel";
import MemberPanel from "../components/PlanTripComponents/MemberPanel";
import PlaceCard from "../components/PlanTripComponents/PlaceCard";
import placesData from "../components/PlanTripComponents/data/places";
import Navbar from "../components/Navbar";
import { saveUserTrip, deleteUserTrip } from "../utils/trips";
import "../styles/createTrip.css";

function CreateTrip({ onNavigate, user, currentPage, setUser }) {
    const [tripName, setTripName] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [numDays, setNumDays] = useState(1);
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeDay, setActiveDay] = useState(1);
    // Collection of all trips
    const [trips, setTrips] = useState([]);
    const [activeTripId, setActiveTripId] = useState(null);
    // Temporary state for form validation errors
    const [formError, setFormError] = useState("");
    const [placeError, setPlaceError] = useState("");

    // Get the currently selected trip object
    const activeTrip = trips.find(t => t.id === activeTripId);

    // Create a new Trip entry
    const handleCreateNewTrip = () => {
        if (!tripName.trim()) {
            setFormError("Please enter a trip name.");
            setTimeout(() => setFormError(""), 3000);
            return;
        }
        if (!selectedCity) {
            setFormError("Please select a destination.");
            setTimeout(() => setFormError(""), 3000);
            return;
        }

        const newItinerary = {};
        for (let i = 1; i <= numDays; i++) {
            newItinerary[i] = [];
        }

        const newTrip = {
            id: Date.now(),
            name: tripName,
            city: selectedCity,
            days: numDays,
            itinerary: newItinerary,
            members: [{ id: 1, name: "You", email: "you@email.com", role: "Organizer" }]
        };

        setTrips([...trips, newTrip]);
        setActiveTripId(newTrip.id);
        if (user?.email) saveUserTrip(user.email, newTrip);
        setTripName("");
        setSelectedCity("");
        setNumDays(1);
    };

    // Add place to the ACTIVE trip
    const handleAddPlace = (place) => {
        // if no trip selected, show error and stop
        if (!activeTrip) {
            setPlaceError("Please select or create a trip first!");
            setTimeout(() => setPlaceError(""), 3000);
            return;
        }
    setPlaceError("");

    setTrips(prevTrips => prevTrips.map(trip => {
            if (trip.id === activeTripId) {
                const currentDayPlaces = trip.itinerary[activeDay] || [];
                if (currentDayPlaces.find(p => p.id === place.id)) return trip;

                return {
                    ...trip,
                    itinerary: {
                        ...trip.itinerary,
                        [activeDay]: [...currentDayPlaces, place]
                    }
                };
            }
            return trip;
        }))
};

    const handleRemovePlace = (day, placeId) => {
        setTrips(prevTrips => prevTrips.map(trip => {
            if (trip.id === activeTripId) {
                return {
                    ...trip,
                    itinerary: {
                        ...trip.itinerary,
                        [day]: trip.itinerary[day].filter(p => p.id !== placeId)
                    }
                };
            }
            return trip;
        }));
    };

    const handleAddMember = (newMember) => {
        setTrips(prevTrips => prevTrips.map(trip => {
            if (trip.id === activeTripId) {
                return { ...trip, members: [...trip.members, { ...newMember, id: Date.now(), role: "Member" }] };
            }
            return trip;
        }));
    };

    //Remove member from the ACTIVE trip
    const handleRemoveMember = (memberId) => {
        setTrips(prevTrips => prevTrips.map(trip => {
            if (trip.id === activeTripId) {
                return { ...trip, members: trip.members.filter(m => m.id !== memberId) };
            }
            return trip;
        }));
    };

    const normalize = (str = "") => str.trim().toLowerCase().replace(/\s+/g, "");

    const filteredPlaces = placesData.filter((p) => {
        const currentCity = activeTrip ? activeTrip.city : selectedCity;

        const cityMatch =
            !currentCity ||
            normalize(currentCity) === "all" ||
            normalize(p.city) === normalize(currentCity);

        const categoryMatch =
            activeCategory === "all" || p.category === activeCategory;

        return cityMatch && categoryMatch;
    });

    {/* Delete Trip function */}
    const handleDeleteTrip = (tripId) => {
        setTrips(prevTrips => prevTrips.filter(t => t.id !== tripId));
        if (activeTripId === tripId) {
            setActiveTripId(null);
        }
        if (user?.email) deleteUserTrip(user.email, tripId);
    };

    // Add a new day to the ACTIVE trip
    const handleAddDay = () => {
        if (!activeTrip || activeTrip.days >= 12) return;

        setTrips(prevTrips => prevTrips.map(trip => {
            if (trip.id === activeTripId) {
                return {
                    ...trip,
                    days: trip.days + 1,
                    itinerary: {
                        ...trip.itinerary,
                        [trip.days + 1]: []   // add empty array for the new day
                    }
                };
            }
            return trip;
        }));
    };

// Remove the last day from the ACTIVE trip
    const handleRemoveDay = (dayToRemove) => {
        if (!activeTrip || activeTrip.days <= 1) return;

        // if user is viewing the day being removed, move them to day 1
        if (activeDay === dayToRemove) setActiveDay(1);

        setTrips(prevTrips => prevTrips.map(trip => {
            if (trip.id === activeTripId) {

                const updatedItinerary = {};

                // Rebuild itinerary — shift days down after the removed one
                let newDayNumber = 1;
                for (let i = 1; i <= trip.days; i++) {
                    if (i === dayToRemove) continue; // skip the deleted day
                    updatedItinerary[newDayNumber] = trip.itinerary[i] || [];
                    newDayNumber++;
                }

                return {
                    ...trip,
                    days: trip.days - 1,
                    itinerary: updatedItinerary
                };
            }
            return trip;
        }));
    };



    return (
        <div>
            <Navbar onNavigate={onNavigate} user={user} currentPage={currentPage} setUser={setUser} />
            <div className="create-trip-page">
            <h1 className="create-trip-title">Plan Your <span className="create-trip-title--highlight">Trip</span></h1>

            <div className="trip-creation-header">
                <TripForm
                    tripName={tripName}
                    setTripName={setTripName}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    numDays={numDays}
                    setNumDays={setNumDays}
                    onCreate={handleCreateNewTrip}
                    formError={formError}
                />
            </div>

            <div className="create-trip-layout">
                <div className="create-trip-main">
                    <CategoryFilter selected={activeCategory} onSelect={setActiveCategory} />
                    {activeTrip && (
                        <DayTabs
                            numDays={activeTrip.days}
                            activeDay={activeDay}
                            setActiveDay={setActiveDay}
                            onAddDay={handleAddDay}
                            onRemoveDay={handleRemoveDay}
                        />
                    )}

                    {placeError && (
                        <p className="place-error">{placeError}</p>
                    )}

                    <div className="place-cards-container">
                        {filteredPlaces.map(place => (
                            <PlaceCard key={place.id} place={place} onAdd={handleAddPlace} />
                        ))}
                    </div>

                </div>

                <div className="create-trip-sidebar">
                    <h3 className="sidebar-section-title">Your Trips</h3>
                    <div className="trip-selector-list">
                        {trips.map(t => (
                            <div key={t.id} className="trip-tab-row">
                                {/* Trip name button */}
                                <button
                                    className={`trip-tab ${activeTripId === t.id ? 'active' : ''}`}
                                    onClick={() => setActiveTripId(t.id)}
                                >
                                    {t.name} ({t.city})
                                </button>

                                {/* Delete icon beside the trip */}
                                <button
                                    className="trip-tab__delete"
                                    onClick={() => handleDeleteTrip(t.id)}
                                    title="Delete trip"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>

                    {activeTrip ? (
                        <>
                            <ItineraryPanel
                                itinerary={activeTrip.itinerary}
                                numDays={activeTrip.days}
                                onRemove={handleRemovePlace}
                            />
                            <MemberPanel
                                members={activeTrip.members}
                                onAdd={handleAddMember}
                                onRemove={handleRemoveMember}
                                tripName={activeTrip.name}
                            />
                        </>
                    ) : (
                        <p className="no-trip-msg">Select a trip to view its details</p>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
}

export default CreateTrip;