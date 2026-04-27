function DashboardView({ users, cities, places, reports }) {
    const stats = [
        { id: 1, label: "Total Users", value: users.length },
        { id: 2, label: "Total Cities", value: cities.length },
        { id: 3, label: "Total Places", value: places.length },
        { id: 4, label: "Total Reports", value: reports.length },
    ];

    return (
        <div className="admin-section">
            <div className="admin-section__header">
                <h1 className="admin-section-title">Dashboard</h1>
                <p className="admin-section-subtitle">Overview of the travel platform</p>
            </div>

            <div className="admin-stats-grid">
                {stats.map((stat) => (
                    <div key={stat.id} className="admin-stat-card">
                        <span className="admin-stat-card__label">{stat.label}</span>
                        <h2 className="admin-stat-card__value">{stat.value}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardView;