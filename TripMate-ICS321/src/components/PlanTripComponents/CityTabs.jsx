import React, { useEffect, useState } from "react";
import "../../styles/CityTabs.css";

const API = "http://localhost:3001/api";

const preferredOrder = ["Riyadh", "Jeddah", "Abha", "AlUla", "AlHassa"];

function CityTabs({ selected, onSelect }) {
  const [cities, setCities] = useState([{ id: "All", label: "All" }]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(`${API}/admin/cities-list`);
        const data = await res.json();

        if (Array.isArray(data)) {
          const namesFromDB = data.map((c) => c.name);

          const orderedNames = preferredOrder.filter((name) =>
            namesFromDB.some(
              (dbName) => dbName.toLowerCase() === name.toLowerCase()
            )
          );

          setCities([
            { id: "All", label: "All" },
            ...orderedNames.map((name) => ({
              id: name,
              label: name,
            })),
          ]);
        }
      } catch {
        setCities([{ id: "All", label: "All" }]);
      }
    };

    fetchCities();
  }, []);

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