function AdminSidebar({ activeSection, setActiveSection }) {
    const items = [
        { key: "dashboard", label: "Dashboard" },
        { key: "users", label: "Users" },
        { key: "cities", label: "Cities" },
        { key: "places", label: "Popular Places" },
        { key: "reports", label: "Reports" },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__header">
                <h3 className="admin-sidebar__title">Admin Panel</h3>
                <p className="admin-sidebar__subtitle">Manage TripMate content</p>
            </div>

            <div className="admin-sidebar__menu">
                {items.map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        className={`admin-sidebar__item ${activeSection === item.key ? "active" : ""}`}
                        onClick={() => setActiveSection(item.key)}
                    >
                        <span className="admin-sidebar__item-text">{item.label}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
}

export default AdminSidebar;