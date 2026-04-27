import React from "react";
import '../../styles/CityTabs.css';

const cities = [
  { id: "All", label: "All" },
  { id: "Riyadh", label: "Riyadh" },
  { id: "Jeddah", label: "Jeddah" },
  { id: "Abha", label: "Abha" },
  { id: "AlUla", label: "AlUla" },
  { id: "AlHassa", label: "AlHassa" },
];

function CityTabs({ selected, onSelect }) {
  return (
    <div className="city-tabs">
      {cities.map((city) => (
        <button
          key={city.id}
          onClick={() => onSelect(city.id)}
          className={`city-tabs__btn ${
            selected === city.id ? "city-tabs__btn--active" : ""
          }`}
        >
          {city.label}
        </button>
      ))}
    </div>
  );
}

export default CityTabs;