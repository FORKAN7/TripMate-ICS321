import { useState, useEffect } from "react";
import TripForm from "../components/PlanTripComponents/TripForm";
import CategoryFilter from "../components/PlanTripComponents/CategoryFilter";
import DayTabs from "../components/PlanTripComponents/DayTabs";
import ItineraryPanel from "../components/PlanTripComponents/ItineraryPanel";
import MemberPanel from "../components/PlanTripComponents/MemberPanel";
import PlaceCard from "../components/PlanTripComponents/PlaceCard";
import Navbar from "../components/Navbar";
import { saveUserTrip, deleteUserTrip } from "../utils/trips";
import "../styles/createTrip.css";
import { checkEmailExists } from "../utils/auth";

const API = "http://localhost:3001/api";
const getToken = () => localStorage.getItem("tripmate_token");

const saveTripToDB = async (trip) => {
    if (!trip?.trip_id) return;
    try {
        await fetch(`${API}/trips/${trip.trip_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
                name:        trip.name,
                destination: trip.city,
                duration:    trip.days,
                itinerary:   trip.itinerary,
                members:     trip.members,
            }),
        });
    } catch (err) {
        console.error("Failed to save trip:", err);
    }
};

function CreateTrip({ onNavigate, user, currentPage, setUser }) {
    const [tripName,       setTripName]       = useState("");
    const [selectedCity,   setSelectedCity]   = useState("");
    const [numDays,        setNumDays]        = useState(1);
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeDay,      setActiveDay]      = useState(1);
    const [trips,          setTrips]          = useState([]);
    const [activeTripId,   setActiveTripId]   = useState(null);
    const [formError,      setFormError]      = useState("");
    const [placeError,     setPlaceError]     = useState("");
    const [placesData,     setPlacesData]     = useState([]);

    // جيب الأماكن
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const res  = await fetch(`${API}/places`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                const data = await res.json();
                setPlacesData(Array.isArray(data) ? data : []);
            } catch {
                setPlacesData([]);
            }
        };
        fetchPlaces();
    }, []);

    // جيب الـ trips
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res  = await fetch(`${API}/trips`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    const formatted = data.map(t => ({
                        ...t,
                        name:      t.title       || t.name,
                        city:      t.destination || t.city,
                        days:      t.duration    || t.days || 1,
                        itinerary: t.itinerary   || {},
                    }));
                    setTrips(formatted);
                    // اختار الـ trip الأول دايمًا بعد الـ fetch
                    setActiveTripId(prev =>
                        formatted.find(t => t.trip_id === prev)
                            ? prev
                            : formatted[0]?.trip_id ?? null
                    );
                }
            } catch {
                console.error("Failed to fetch trips");
            }
        };
        fetchTrips();
    }, []);

    const activeTrip = trips.find(t => t.trip_id === activeTripId);

    const handleCreateNewTrip = async () => {
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
        for (let i = 1; i <= numDays; i++) newItinerary[i] = [];

        const newTrip = {
            name:      tripName,
            city:      selectedCity,
            days:      numDays,
            itinerary: newItinerary,
            members:   [{ name: user?.name || "You", email: user?.email || "", role: "Organizer" }],
        };

        const saved      = await saveUserTrip(newTrip);
        const tripWithId = { ...newTrip, trip_id: saved?.trip_id };

        setTrips(prev => [...prev, tripWithId]);
        setActiveTripId(tripWithId.trip_id);
        setTripName("");
        setSelectedCity("");
        setNumDays(1);
    };

    const handleAddPlace = (place) => {
        if (!activeTrip) {
            setPlaceError("Please select or create a trip first!");
            setTimeout(() => setPlaceError(""), 3000);
            return;
        }
        setPlaceError("");

        setTrips(prevTrips => {
            const updated = prevTrips.map(trip => {
                if (trip.trip_id === activeTripId) {
                    const current = trip.itinerary[activeDay] || [];
                    if (current.find(p => p.place_id === place.place_id)) return trip;
                    return {
                        ...trip,
                        itinerary: { ...trip.itinerary, [activeDay]: [...current, place] },
                    };
                }
                return trip;
            });
            saveTripToDB(updated.find(t => t.trip_id === activeTripId));
            return updated;
        });
    };

    const handleRemovePlace = (day, placeId) => {
        setTrips(prevTrips => {
            const updated = prevTrips.map(trip => {
                if (trip.trip_id === activeTripId) {
                    return {
                        ...trip,
                        itinerary: {
                            ...trip.itinerary,
                            [day]: trip.itinerary[day].filter(p => p.place_id !== placeId),
                        },
                    };
                }
                return trip;
            });
            saveTripToDB(updated.find(t => t.trip_id === activeTripId));
            return updated;
        });
    };

    const handleAddMember = async (newMember) => {
        if (newMember.email.toLowerCase() === user?.email?.toLowerCase()) return "self";
        const exists = await checkEmailExists(newMember.email);
        if (!exists) return false;

        setTrips(prevTrips => {
            const updated = prevTrips.map(trip => {
                if (trip.trip_id === activeTripId) {
                    return { ...trip, members: [...trip.members, { ...newMember, id: Date.now(), role: "Member" }] };
                }
                return trip;
            });
            saveTripToDB(updated.find(t => t.trip_id === activeTripId));
            return updated;
        });
        return true;
    };

    const handleRemoveMember = (memberId) => {
        setTrips(prevTrips => {
            const updated = prevTrips.map(trip => {
                if (trip.trip_id === activeTripId) {
                    return { ...trip, members: trip.members.filter(m => m.id !== memberId) };
                }
                return trip;
            });
            saveTripToDB(updated.find(t => t.trip_id === activeTripId));
            return updated;
        });
    };

    const handleDeleteTrip = async (tripId) => {
        setTrips(prev => {
            const remaining = prev.filter(t => t.trip_id !== tripId);
            // لو حذفت الـ active trip، اختار أقرب trip بديلة
            if (activeTripId === tripId) {
                setActiveTripId(remaining[0]?.trip_id ?? null);
            }
            return remaining;
        });
        await deleteUserTrip(tripId);
    };

    const handleAddDay = () => {
        if (!activeTrip || activeTrip.days >= 12) return;
        setTrips(prevTrips => {
            const updated = prevTrips.map(trip => {
                if (trip.trip_id === activeTripId) {
                    return {
                        ...trip,
                        days:      trip.days + 1,
                        itinerary: { ...trip.itinerary, [trip.days + 1]: [] },
                    };
                }
                return trip;
            });
            saveTripToDB(updated.find(t => t.trip_id === activeTripId));
            return updated;
        });
    };

    const handleRemoveDay = (dayToRemove) => {
        if (!activeTrip || activeTrip.days <= 1) return;
        if (activeDay === dayToRemove) setActiveDay(1);

        setTrips(prevTrips => {
            const updated = prevTrips.map(trip => {
                if (trip.trip_id === activeTripId) {
                    const updatedItinerary = {};
                    let n = 1;
                    for (let i = 1; i <= trip.days; i++) {
                        if (i === dayToRemove) continue;
                        updatedItinerary[n] = trip.itinerary[i] || [];
                        n++;
                    }
                    return { ...trip, days: trip.days - 1, itinerary: updatedItinerary };
                }
                return trip;
            });
            saveTripToDB(updated.find(t => t.trip_id === activeTripId));
            return updated;
        });
    };

    const normalize = (str = "") => str.trim().toLowerCase().replace(/\s+/g, "");

    const filteredPlaces = placesData.filter(p => {
        const currentCity = activeTrip ? activeTrip.city : selectedCity;
        const cityMatch   = !currentCity || normalize(currentCity) === "all" ||
                            normalize(p.city_name ?? p.city) === normalize(currentCity);
        const catMatch    = activeCategory === "all" || p.category === activeCategory;
        return cityMatch && catMatch;
    });

    return (
        <div style={{ overflowX: "hidden" }}>
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
                        {placeError && <p className="place-error">{placeError}</p>}
                        <div className="place-cards-container">
                            {filteredPlaces.map(place => (
                                <PlaceCard key={place.place_id} place={place} onAdd={handleAddPlace} />
                            ))}
                        </div>
                    </div>

                    <div className="create-trip-sidebar">
                        <h3 className="sidebar-section-title">Your Trips</h3>
                        <div className="trip-selector-list">
                            {trips.map(t => (
                                <div key={t.trip_id} className="trip-tab-row">
                                    <button
                                        className={`trip-tab ${activeTripId === t.trip_id ? "active" : ""}`}
                                        onClick={() => setActiveTripId(t.trip_id)}
                                    >
                                        {t.name} ({t.city})
                                    </button>
                                    <button
                                        className="trip-tab__delete"
                                        onClick={() => handleDeleteTrip(t.trip_id)}
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