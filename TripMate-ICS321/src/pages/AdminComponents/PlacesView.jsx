import { useState } from "react";

function PlacesView({
    places = [],
    cities = [],
    onAddPlace,
    onEditPlace,
    onDeletePlace,
}) {
    const emptyForm = {
        id: null,
        name: "",
        city: "",
        category: "",
        description: "",
        image: "",
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

    const handleOpenEditForm = (place) => {
        setFormData({
            id: place.id,
            name: place.name || "",
            city: place.city || "",
            category: place.category || "",
            description: place.description || "",
            image: place.image || "",
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
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.city.trim() ||
            !formData.category.trim() ||
            !formData.description.trim()
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        if (isEditing) {
            onEditPlace(formData);
            showMessage("Place updated successfully.");
        } else {
            onAddPlace(formData);
            showMessage("Place added successfully.");
        }

        handleCloseForm();
    };

    const handleDelete = (placeId) => {
        const confirmed = window.confirm("Are you sure you want to delete this place?");
        if (!confirmed) return;

        onDeletePlace(placeId);
        showMessage("Place deleted successfully.");
    };

    return (
        <div className="admin-section">
            <div className="admin-section__header admin-section__header--row">
                <div>
                    <h1 className="admin-section-title">Popular Places</h1>
                    <p className="admin-section-subtitle">Manage places in your platform</p>
                </div>

                <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={handleOpenAddForm}
                >
                    Add Place
                </button>
            </div>

            {message && <div className="admin-success-message">{message}</div>}

            {isFormOpen && (
                <div className="admin-form-card">
                    <h2 className="admin-form-title">
                        {isEditing ? "Edit Place" : "Add New Place"}
                    </h2>

                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Place Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter place name"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>City</label>
                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            >
                                <option value="">Select city</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-form-group">
                            <label>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Select category</option>
                                <option value="nature">Nature</option>
                                <option value="food">Food</option>
                                <option value="landmark">Landmark</option>
                                <option value="shopping">Shopping</option>
                                <option value="entertainment">Entertainment</option>
                            </select>
                        </div>

                        <div className="admin-form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter place description"
                                rows="4"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Image URL or Name</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="Enter image path or URL"
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
                                {isEditing ? "Save Changes" : "Add Place"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Place</th>
                            <th>City</th>
                            <th>Category</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {places.length > 0 ? (
                            places.map((place) => (
                                <tr key={place.id}>
                                    <td>
                                        <div className="admin-place-cell">
                                            <span className="admin-place-cell__name">
                                                {place.name}
                                            </span>
                                            <span className="admin-place-cell__desc">
                                                {place.description?.slice(0, 55)}
                                                {place.description?.length > 55 ? "..." : ""}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{place.city}</td>
                                    <td className="admin-capitalize">{place.category}</td>
                                    <td>{place.rating}</td>
                                    <td>
                                        <div className="admin-actions">
                                            <button
                                                type="button"
                                                className="admin-action-btn"
                                                onClick={() => handleOpenEditForm(place)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="admin-action-btn admin-action-btn--danger"
                                                onClick={() => handleDelete(place.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No places found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PlacesView;