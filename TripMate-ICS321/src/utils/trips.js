const API = "http://localhost:3001/api";

const getToken = () => localStorage.getItem("tripmate_token");

// ── GET all trips for logged-in user ────────────────────────────────────────
export const getUserTrips = async () => {
    try {
        const res = await fetch(`${API}/trips`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        if (!res.ok) return [];

        // Normalize MySQL fields → consistent shape everywhere
        return Array.isArray(data)
            ? data.map((t) => ({
                  ...t,
                  trip_id:     t.trip_id,
                  name:        t.title || t.name,          // DB stores "title"
                  city:        t.destination || t.city,
                  days:        t.duration   || t.days || 1,
                  destination: t.destination || t.city,
                  duration:    t.duration   || t.days || 1,
                  createdAt:   t.created_at || t.createdAt || new Date().toISOString(),
                  userRole:    t.userRole   || "Organizer",
              }))
            : [];
    } catch {
        return [];
    }
};

// ── CREATE a new trip ────────────────────────────────────────────────────────
export const saveUserTrip = async (trip) => {
    try {
        // If trip already has a trip_id → UPDATE
        if (trip.trip_id) {
            const res = await fetch(`${API}/trips/${trip.trip_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    name:        trip.name,
                    destination: trip.city || trip.destination,
                    duration:    trip.days || trip.duration,
                    itinerary:   trip.itinerary,
                    members:     trip.members,
                }),
            });
            const data = await res.json();
            // Return normalized shape so CreateTrip can read trip_id
            return { ...data, trip_id: data.trip_id };
        }

        // Otherwise → INSERT
        const res = await fetch(`${API}/trips`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
                name:        trip.name,
                destination: trip.city || trip.destination,
                duration:    trip.days || trip.duration,
                itinerary:   trip.itinerary,
                members:     trip.members,
            }),
        });
        const data = await res.json();
        return { ...data, trip_id: data.trip_id };
    } catch {
        return null;
    }
};

// ── DELETE a trip ────────────────────────────────────────────────────────────
export const deleteUserTrip = async (tripId) => {
    try {
        await fetch(`${API}/trips/${tripId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        });
    } catch (error) {
        console.error("deleteUserTrip error:", error);
    }
};