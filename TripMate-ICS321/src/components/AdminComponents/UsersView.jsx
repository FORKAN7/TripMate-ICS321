import { useState } from "react";

function UsersView({ users = [], onDeleteUser, onEditUser }) {
    const emptyForm = {
        id: null,
        name: "",
        email: "",
        role: "Member",
        status: "Active",
    };

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [message, setMessage] = useState("");

    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(""), 2000);
    };

    const handleOpenEditForm = (user) => {
        setFormData({
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            role: user.role || "Member",
            status: user.status || "Active",
        });
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormData(emptyForm);
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

        if (!formData.name.trim() || !formData.email.trim()) {
            alert("Please fill in name and email.");
            return;
        }

        onEditUser({
            id: formData.id,
            name: formData.name.trim(),
            email: formData.email.trim(),
            role: formData.role,
            status: formData.status,
        });

        showMessage("User updated successfully.");
        handleCloseForm();
    };

    const handleDelete = (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) return;

        onDeleteUser(userId);
        showMessage("User deleted successfully.");
    };

    return (
        <div className="admin-section">
            <div className="admin-section__header">
                <h1 className="admin-section-title">Users</h1>
                <p className="admin-section-subtitle">Manage users</p>
            </div>

            {message && <div className="admin-success-message">{message}</div>}

            {isFormOpen && (
                <div className="admin-form-card">
                    <h2 className="admin-form-title">Edit User</h2>

                    <form className="admin-form" onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter user name"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="Admin">Admin</option>
                                <option value="Organizer">Organizer</option>
                                <option value="Member">Member</option>
                            </select>
                        </div>

                        <div className="admin-form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Active">Active</option>
                                <option value="Disabled">Disabled</option>
                            </select>
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
                                Save Changes
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
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <span
                                            className={`admin-status-badge ${
                                                user.status === "Disabled"
                                                    ? "admin-status-badge--danger"
                                                    : ""
                                            }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <button
                                                type="button"
                                                className="admin-action-btn"
                                                onClick={() => handleOpenEditForm(user)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-action-btn admin-action-btn--danger"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UsersView;