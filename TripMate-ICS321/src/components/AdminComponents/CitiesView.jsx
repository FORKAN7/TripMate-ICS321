import { useState } from "react";

const API = "http://localhost:3001/api";
const getToken = () => localStorage.getItem("tripmate_token");

function CitiesView({ cities = [], places = [], onAddCity, onEditCity, onDeleteCity }) {
    const emptyForm = { city_id: null, oldName: "", name: "" };

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [message, setMessage] = useState("");

    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(""), 2000);
    };

    const handleOpenAddForm = () => {
        setFormData(emptyForm);
        setIsEditing(false);
        setIsFormOpen(true);
    };

    const handleOpenEditForm = (city) => {
        setFormData({
            city_id: city.city_id || city.id,
            oldName: city.name,
            name: city.name,
        });

        setIsEditing(true);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormData(emptyForm);
        setIsEditing(false);
        setIsFormOpen(false);
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            name: e.target.value,
        }));
    };

    const handleSubmit = async () => {
        const trimmedName = formData.name.trim();

        if (!trimmedName) {
            alert("City name is required.");
            return;
        }

        try {
            if (isEditing) {
                const res = await fetch(`${API}/admin/cities/${formData.city_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify({ cityName: trimmedName }),
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message || "Failed to update city.");
                    return;
                }

                onEditCity(formData.oldName, trimmedName, formData.city_id);
                showMessage("City updated successfully.");
            } else {
                await onAddCity(trimmedName);
                showMessage("City added successfully.");
            }

            handleCloseForm();
        } catch {
            alert("Server error.");
        }
    };

    const handleDelete = async (city) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${city.name}"?`
        );

        if (!confirmed) return;

        try {
            const cityId = city.city_id || city.id;

            const res = await fetch(`${API}/admin/cities/${cityId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!res.ok) {
                const text = await res.text();
                console.log("Server error:", text);
                alert("Failed to delete.");
                return;
            }

            onDeleteCity(city.name, cityId);
            showMessage("City deleted successfully.");
        } catch (err) {
            console.error(err);
            alert("Server error.");
        }
    };

    return (
        <div className="admin-section">
            <div className="admin-section__header admin-section__header--row">
                <div>
                    <h1 className="admin-section-title">Cities</h1>
                    <p className="admin-section-subtitle">Manage cities</p>
                </div>

                <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={handleOpenAddForm}
                >
                    Add City
                </button>
            </div>

            {message && <div className="admin-success-message">{message}</div>}

            {isFormOpen && (
                <div className="admin-form-card">
                    <h2 className="admin-form-title">
                        {isEditing ? "Edit City" : "Add New City"}
                    </h2>

                    <div className="admin-form">
                        <div className="admin-form-group">
                            <label>City Name</label>

                            <input
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter city name"
                            />
                        </div>

                        <div className="admin-form-actions">
                            <button
                                type="button"
                                className="admin-action-btn"
                                onClick={handleCloseForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-primary-btn"
                                onClick={handleSubmit}
                            >
                                {isEditing ? "Save Changes" : "Add City"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Places</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cities.length > 0 ? (
                            cities.map((city) => {
                                const placeCount = places.filter(
                                    (p) => (p.city || p.city_name) === city.name
                                ).length;

                                return (
                                    <tr key={city.city_id || city.id}>
                                        <td>{city.name}</td>
                                        <td>{placeCount}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <button
                                                    type="button"
                                                    className="admin-action-btn"
                                                    onClick={() => handleOpenEditForm(city)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-action-btn admin-action-btn--danger"
                                                    onClick={() => handleDelete(city)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="3">No cities found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CitiesView;