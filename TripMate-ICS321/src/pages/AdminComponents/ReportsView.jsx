import { useState } from "react";

function ReportsView({ reports = [], onRemoveReport, onReviewReport }) {
    const [message, setMessage] = useState("");

    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(""), 2000);
    };

    const handleReview = (reportId) => {
        onReviewReport(reportId);
        showMessage("Report reviewed successfully.");
    };

    const handleRemove = (reportId) => {
        const confirmed = window.confirm("Are you sure you want to remove this report?");
        if (!confirmed) return;

        onRemoveReport(reportId);
        showMessage("Report removed successfully.");
    };

    return (
        <div className="admin-section">
            <div className="admin-section__header">
                <h1 className="admin-section-title">Reports</h1>
                <p className="admin-section-subtitle">Manage reports</p>
            </div>

            {message && <div className="admin-success-message">{message}</div>}

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Content</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reports.length > 0 ? (
                            reports.map((report) => (
                                <tr key={report.id}>
                                    <td>{report.content || "No content"}</td>
                                    <td>
                                        <span
                                            className={`admin-status-badge ${
                                                report.status === "Reviewed"
                                                    ? ""
                                                    : "admin-status-badge--warning"
                                            }`}
                                        >
                                            {report.status || "Pending"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <button
                                                type="button"
                                                className="admin-action-btn"
                                                onClick={() => handleReview(report.id)}
                                            >
                                                Review
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-action-btn admin-action-btn--danger"
                                                onClick={() => handleRemove(report.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No reports found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ReportsView;