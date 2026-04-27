import React from "react";
import '../../styles/CategoryFilter.css';

const categories = [
  { id: "all",       label: "All",        icon: "🌍" },
  { id: "landmark",  label: "Landmarks",  icon: "🏛️" },
  { id: "food",      label: "Local Food", icon: "🍽️" },
  { id: "nature",    label: "Nature",     icon: "🌿" },
  { id: "shopping",  label: "Shopping",   icon: "🛍️" },
  { id: "entertainment", label: "Entertainment", icon: "🎭" },
];

function CategoryFilter({ selected, onSelect }) {
  return (
      <div className="category-filter">
        {categories.map((category) => (
            <button
                key={category.id}
                onClick={() => onSelect(category.id)}
                className={`category-filter__btn ${selected === category.id ? "category-filter__btn--active" : ""}`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
        ))}
      </div>
  );
}

export default CategoryFilter;