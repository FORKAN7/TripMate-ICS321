import { useState } from "react";

function CitiesView({
    cities = [],
    places = [],
    onAddCity,
    onEditCity,
    onDeleteCity,
}) {
    const emptyForm = {
        oldName: "",
        name: "",
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedName = formData.name.trim();

        if (!trimmedName) {
            alert("City name is required.");
            return;
        }

        if (isEditing) {
            onEditCity(formData.oldName, trimmedName);
            showMessage("City updated successfully.");
        } else {
            onAddCity(trimmedName);
            showMessage("City added successfully.");
        }

        handleCloseForm();
    };

    const handleDelete = (cityName) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${cityName}"?`);
        if (!confirmed) return;

        onDeleteCity(cityName);
        showMessage("City deleted successfully.");
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

                    <form className="admin-form" onSubmit={handleSubmit}>
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

                            <button type="submit" className="admin-primary-btn">
                                {isEditing ? "Save Changes" : "Add City"}
                            </button>
                        </div>
                    </form>
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
                                    (place) => place.city === city.name
                                ).length;

                                return (
                                    <tr key={city.id}>
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
                                                    onClick={() => handleDelete(city.name)}
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