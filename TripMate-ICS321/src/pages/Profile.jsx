import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getUserTrips } from "../utils/trips";
import "../styles/profile.css";

const API = "http://localhost:3001/api";
const getToken = () => localStorage.getItem("tripmate_token");

const getTripId = (trip) => trip.trip_id || trip.id;

function Profile({ onNavigate, user, currentPage, setUser }) {
    const [activeTab, setActiveTab] = useState("trips");
    const [photos, setPhotos] = useState([]);
    const [location, setLocation] = useState("Detecting location...");
    const [trips, setTrips] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [newEmail, setNewEmail] = useState(user?.email || "");
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [photoToDelete, setPhotoToDelete] = useState(null);

    // FETCH TRIPS
    useEffect(() => {
        const fetchTrips = async () => {
            const data = await getUserTrips();

            const formatted = Array.isArray(data)
                ? data.map((trip) => ({
                      ...trip,
                      id: trip.trip_id || trip.id,
                      trip_id: trip.trip_id || trip.id,
                      name: trip.title || trip.name,
                      destination: trip.destination || trip.city || "",
                      duration: trip.duration || trip.days || 1,
                      createdAt:
                          trip.created_at ||
                          trip.createdAt ||
                          new Date().toISOString(),
                  }))
                : [];

            setTrips(formatted);
        };

        if (user) fetchTrips();
    }, [user]);

    // FETCH PHOTOS
    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const res = await fetch(`${API}/auth/photos`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });

                if (!res.ok) return;

                const data = await res.json();

                if (Array.isArray(data)) {
                    setPhotos(data);
                }
            } catch {
                setPhotos([]);
            }
        };

        if (user) fetchPhotos();
    }, [user]);

    // LOCATION
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation("Location unavailable");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
                    );

                    const data = await res.json();

                    const city =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        "";

                    const country = data.address.country || "";

                    setLocation([city, country].filter(Boolean).join(", "));
                } catch {
                    setLocation("Location unavailable");
                }
            },
            () => setLocation("Location unavailable")
        );
    }, []);

    // UPDATE EMAIL
    const handleUpdateEmail = async () => {
        try {
            const res = await fetch(`${API}/auth/update-email`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ email: newEmail }),
            });

            const data = await res.json();

            if (res.ok) {
                setUser({ ...user, email: newEmail });
                setEditMode(false);
            } else {
                alert(data.message);
            }
        } catch {
            alert("Server error.");
        }
    };

    // DELETE PHOTO
    const handleDeletePhoto = async (index) => {
        try {
            await fetch(`${API}/auth/photos/${index}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            setPhotos((prev) => prev.filter((_, i) => i !== index));
        } catch {
            console.error("Failed to delete photo");
        }
    };

    // ADD PHOTO
    const handlePhotoChange = async (e) => {
        const files = Array.from(e.target.files);

        for (const file of files) {
            const reader = new FileReader();

            reader.onload = async () => {
                const base64 = reader.result;

                setPhotos((prev) => [...prev, base64]);

                try {
                    const res = await fetch(`${API}/auth/photos`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${getToken()}`,
                        },
                        body: JSON.stringify({ photo: base64 }),
                    });

                    if (!res.ok) {
                        setPhotos((prev) =>
                            prev.filter((p) => p !== base64)
                        );
                    }
                } catch {
                    setPhotos((prev) =>
                        prev.filter((p) => p !== base64)
                    );
                }
            };

            reader.readAsDataURL(file);
        }

        e.target.value = "";
    };

    const name = user?.name || "Traveler";

    const joinedLabel = user?.joinedAt
        ? new Date(user.joinedAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
          })
        : "Recently";

    return (
        <div className="profile-page">
            <Navbar
                onNavigate={onNavigate}
                user={user}
                currentPage={currentPage}
                setUser={setUser}
            />

            <div className="profile-header">
                <div className="profile-header__content">
                    <h1 className="profile-header__name">{name}</h1>

                    <div className="profile-header__meta">
                        <span>📍 {location}</span>
                        <span>📅 Joined {joinedLabel}</span>
                        <span>✉️ {user?.email}</span>
                    </div>

                    <p className="profile-header__bio">
                        Travel enthusiast and adventure seeker.
                    </p>

                    {editMode ? (
                        <div
                            style={{
                                marginTop: "10px",
                                display: "flex",
                                gap: "8px",
                            }}
                        >
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) =>
                                    setNewEmail(e.target.value)
                                }
                            />

                            <button onClick={handleUpdateEmail}>
                                Save
                            </button>

                            <button
                                onClick={() => setEditMode(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setEditMode(true)}>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div className="profile-body">
                <div className="profile-stats">
                    <div className="stat-card">
                        <div>
                            <span className="stat-card__number">
                                {trips.length}
                            </span>
                            <span className="stat-card__label">
                                Trips
                            </span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div>
                            <span className="stat-card__number">
                                {photos.length}
                            </span>
                            <span className="stat-card__label">
                                Photos
                            </span>
                        </div>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button
                        className={`profile-tab ${
                            activeTab === "trips"
                                ? "profile-tab--active"
                                : ""
                        }`}
                        onClick={() => setActiveTab("trips")}
                    >
                        Trips
                    </button>

                    <button
                        className={`profile-tab ${
                            activeTab === "photos"
                                ? "profile-tab--active"
                                : ""
                        }`}
                        onClick={() => setActiveTab("photos")}
                    >
                        Photos
                    </button>
                </div>

                <div className="profile-tabs__divider" />

                {activeTab === "trips" && (
                    <div className="profile-trips">
                        <h2 className="profile-section-title">
                            Recent Trips
                        </h2>

                        <div className="trip-list">
                            {trips.length === 0 ? (
                                <p className="profile-empty">
                                    No trips yet.
                                </p>
                            ) : (
                                trips.map((trip) => (
                                    <div
                                        key={getTripId(trip)}
                                        className="trip-item"
                                    >
                                        <div className="trip-item__left">
                                            <span className="trip-item__name">
                                                {trip.name} —{" "}
                                                {trip.destination}
                                            </span>
                                        </div>

                                        <div className="trip-item__right">
                                            <span
                                                className={`trip-item__badge ${
                                                    trip.userRole === "Member"
                                                        ? "trip-item__badge--member"
                                                        : ""
                                                }`}
                                            >
                                                {trip.userRole ||
                                                    "Organizer"}
                                            </span>

                                            <span className="trip-item__date">
                                                {new Date(
                                                    trip.createdAt
                                                ).toLocaleDateString()}
                                            </span>

                                            <div className="trip-item__menu-wrap">
                                                <button
                                                    className="trip-item__menu-btn"
                                                    onClick={() =>
                                                        setOpenMenuId(
                                                            openMenuId ===
                                                                getTripId(
                                                                    trip
                                                                )
                                                                ? null
                                                                : getTripId(
                                                                      trip
                                                                  )
                                                        )
                                                    }
                                                >
                                                    ⋮
                                                </button>

                                                {openMenuId ===
                                                    getTripId(trip) && (
                                                    <div className="trip-item__dropdown">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTrip(
                                                                    trip
                                                                );
                                                                setOpenMenuId(
                                                                    null
                                                                );
                                                            }}
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "photos" && (
                    <div className="profile-photos">
                        {photos.length === 0 ? (
                            <div className="photo-add">
                                <p>No photos yet</p>

                                <label className="photo-add__btn">
                                    + Add Photo

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={handlePhotoChange}
                                    />
                                </label>
                            </div>
                        ) : (
                            <>
                                <div className="photo-grid">
                                    {photos.map((url, i) => (
                                        <div
                                            key={i}
                                            className="photo-item-wrap"
                                        >
                                            <img
                                                src={url}
                                                alt={`photo-${i}`}
                                                className="photo-item"
                                            />

                                            <button
                                                className="photo-delete-btn"
                                                onClick={() =>
                                                    setPhotoToDelete(i)
                                                }
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <label className="photo-add__btn photo-add__btn--inline">
                                    + Add More

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={handlePhotoChange}
                                    />
                                </label>
                            </>
                        )}
                    </div>
                )}
            </div>

            {photoToDelete !== null && (
                <div
                    className="confirm-overlay"
                    onClick={() => setPhotoToDelete(null)}
                >
                    <div
                        className="confirm-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Delete Photo</h3>

                        <p>
                            Are you sure you want to delete this
                            photo?
                        </p>

                        <div className="confirm-modal__actions">
                            <button
                                onClick={() =>
                                    setPhotoToDelete(null)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    handleDeletePhoto(
                                        photoToDelete
                                    );

                                    setPhotoToDelete(null);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedTrip && (
                <div
                    className="trip-modal-overlay"
                    onClick={() => setSelectedTrip(null)}
                >
                    <div
                        className="trip-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="trip-modal__header">
                            <h2 className="trip-modal__title">
                                {selectedTrip.name}
                            </h2>

                            <button
                                className="trip-modal__close"
                                onClick={() =>
                                    setSelectedTrip(null)
                                }
                            >
                                ✕
                            </button>
                        </div>

                        <div className="trip-modal__meta">
                            <span>
                                📍 {selectedTrip.destination}
                            </span>

                            <span>
                                🗓 {selectedTrip.duration} days
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;