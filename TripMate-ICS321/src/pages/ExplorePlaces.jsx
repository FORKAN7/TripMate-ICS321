import { useState } from "react";
import CategoryFilter from "../components/PlanTripComponents/CategoryFilter";
import PlaceCard from "../components/PlanTripComponents/PlaceCard";
import places from "../components/PlanTripComponents/data/places";
import CityTabs from '../components/PlanTripComponents/CityTabs';
import PlaceDetailModal from "../components/PlanTripComponents/PlaceDetailModal";
import Navbar from "../components/Navbar";
import "../styles/ExplorePlaces.css";

function ExplorePlaces({ onNavigate, user, currentPage, setUser, isGuest }) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState("All"); 
    const [selectedPlace, setSelectedPlace] = useState(null);

    const filteredPlaces = places.filter((place) => {
        const matchesCity = selectedCity === "All" || place.city === selectedCity;
        const matchesCategory = activeCategory === "all" || place.category === activeCategory;
        const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCity && matchesCategory && matchesSearch;
    });

    return (
        <div>
            <Navbar onNavigate={onNavigate} user={user} currentPage={currentPage} setUser={setUser} isGuest={isGuest} />
            <div className="explore-page">
            <h1 className="explore-title">
                <span className="explore-title--highlight">Explore</span> New Places
            </h1>

            <CityTabs selected={selectedCity} onSelect={setSelectedCity} />

            <div className="explore-controls">
                <div className="explore-search">
                    <span className="explore-search__icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search places..."
                        className="explore-search__input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <CategoryFilter selected={activeCategory} onSelect={setActiveCategory} />
            </div>

            <div className="places-grid">
                {filteredPlaces.length > 0 ? (
                    filteredPlaces.map((place) => (
                        <PlaceCard 
                            key={place.id} 
                            place={place} 
                            onClick={() => setSelectedPlace(place)} 
                        />
                    ))
                ) : (
                    <div className="explore-empty">
                        <p>No results found.</p>
                    </div>
                )}
            </div>

            {/* Modal Logic */}
            {selectedPlace && (
                <PlaceDetailModal 
                    place={selectedPlace} 
                    onClose={() => setSelectedPlace(null)} 
                    onAddToTrip={(place) => {
                        console.log("Added:", place.name);
                        setSelectedPlace(null);
                    }}
                />
            )}
            </div>
        </div>
    );
}

export default ExplorePlaces;