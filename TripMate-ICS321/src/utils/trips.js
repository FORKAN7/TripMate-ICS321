const TRIPS_KEY = "tripmate_trips";

const getAllTrips = () => JSON.parse(localStorage.getItem(TRIPS_KEY) || "{}");
const saveAllTrips = (data) => localStorage.setItem(TRIPS_KEY, JSON.stringify(data));

export const getUserTrips = (email) => {
    const all = getAllTrips();
    return all[email] || [];
};

export const saveUserTrip = (email, trip) => {
    const all = getAllTrips();
    const userTrips = all[email] || [];
    const exists = userTrips.find(t => t.id === trip.id);
    if (exists) {
        all[email] = userTrips.map(t => t.id === trip.id ? { ...trip, role: "Organizer" } : t);
    } else {
        all[email] = [...userTrips, { ...trip, role: "Organizer", createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }];
    }
    saveAllTrips(all);
};

export const deleteUserTrip = (email, tripId) => {
    const all = getAllTrips();
    all[email] = (all[email] || []).filter(t => t.id !== tripId);
    saveAllTrips(all);
};
