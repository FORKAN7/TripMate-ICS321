import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import AdminSidebar from "../components/AdminComponents/AdminSidebar";
import DashboardView from "../components/AdminComponents/DashboardView";
import UsersView from "../components/AdminComponents/UsersView";
import CitiesView from "../components/AdminComponents/CitiesView";
import PlacesView from "../components/AdminComponents/PlacesView";
import ReportsView from "../components/AdminComponents/ReportsView";
import initialPlaces from "../components/PlanTripComponents/data/places";
import "../styles/admin.css";

function AdminPage({ onNavigate, user, currentPage, setUser, isGuest }) {
    const [activeSection, setActiveSection] = useState("dashboard");

    const [users, setUsers] = useState([
        {
            id: 1,
            name: "Admin User",
            email: "admin@gmail.com",
            role: "Admin",
            status: "Active",
        },
        {
            id: 2,
            name: "Sara Ali",
            email: "sara@gmail.com",
            role: "Organizer",
            status: "Active",
        },
        {
            id: 3,
            name: "Ahmed Noor",
            email: "ahmed@gmail.com",
            role: "Member",
            status: "Active",
        },
    ]);

    const [places, setPlaces] = useState(initialPlaces);

    const [reports, setReports] = useState([
        { id: 1, content: "Spam review on a place", status: "Pending" },
        { id: 2, content: "Inappropriate comment", status: "Active" },
    ]);

    // -----------------------------
    // Places handlers
    // -----------------------------
    const handleAddPlace = (newPlace) => {
        setPlaces((prevPlaces) => [
            ...prevPlaces,
            {
                id: Date.now(),
                name: newPlace.name.trim(),
                city: newPlace.city,
                category: newPlace.category,
                description: newPlace.description.trim(),
                image: newPlace.image || "",
                rating: 0,
            },
        ]);
    };

    const handleEditPlace = (updatedPlace) => {
        setPlaces((prevPlaces) =>
            prevPlaces.map((place) =>
                place.id === updatedPlace.id
                    ? {
                          ...place,
                          name: updatedPlace.name.trim(),
                          city: updatedPlace.city,
                          category: updatedPlace.category,
                          description: updatedPlace.description.trim(),
                          image: updatedPlace.image || "",
                      }
                    : place
            )
        );
    };

    const handleDeletePlace = (placeId) => {
        setPlaces((prevPlaces) =>
            prevPlaces.filter((place) => place.id !== placeId)
        );
    };

    // -----------------------------
    // Users handlers
    // -----------------------------
   const handleEditUser = (updatedUser) => {
    setUsers((prevUsers) =>
        prevUsers.map((userItem) =>
            userItem.id === updatedUser.id
                ? {
                      ...userItem,
                      name: updatedUser.name,
                      email: updatedUser.email,
                      role: updatedUser.role,
                      status: updatedUser.status,
                  }
                : userItem
        )
    );
};

const handleDeleteUser = (userId) => {
    setUsers((prevUsers) =>
        prevUsers.filter((userItem) => userItem.id !== userId)
    );
};


    // -----------------------------
    // Reports handlers
    // -----------------------------
   const handleRemoveReport = (reportId) => {
    setReports((prevReports) =>
        prevReports.filter((report) => report.id !== reportId)
    );
};

const handleReviewReport = (reportId) => {
    setReports((prevReports) =>
        prevReports.map((report) =>
            report.id === reportId
                ? { ...report, status: "Reviewed" }
                : report
        )
    );
};

    // -----------------------------
    // Cities handlers
    // cities are derived from places
    // -----------------------------
   const handleAddCity = (cityName) => {
    const trimmedName = cityName.trim();

    if (!trimmedName) return;

    const cityExists = places.some(
        (place) => place.city.toLowerCase() === trimmedName.toLowerCase()
    );

    if (cityExists) {
        alert("City already exists.");
        return;
    }

    setPlaces((prevPlaces) => [
        ...prevPlaces,
        {
            id: Date.now(),
            name: `${trimmedName} Placeholder`,
            city: trimmedName,
            category: "landmark",
            description: "Placeholder place for new city.",
            image: "",
            rating: 0,
        },
    ]);
};

const handleEditCity = (oldCityName, newCityName) => {
    const trimmedNewName = newCityName.trim();

    if (!trimmedNewName) {
        alert("City name is required.");
        return;
    }

    const duplicateExists = places.some(
        (place) =>
            place.city.toLowerCase() === trimmedNewName.toLowerCase() &&
            place.city !== oldCityName
    );

    if (duplicateExists) {
        alert("Another city with this name already exists.");
        return;
    }

    setPlaces((prevPlaces) =>
        prevPlaces.map((place) =>
            place.city === oldCityName
                ? { ...place, city: trimmedNewName }
                : place
        )
    );
};

const handleDeleteCity = (cityName) => {
    setPlaces((prevPlaces) =>
        prevPlaces.filter((place) => place.city !== cityName)
    );
};
    // -----------------------------
    // Derived cities from places
    // -----------------------------
    const cities = useMemo(() => {
        const uniqueCityNames = [...new Set(places.map((place) => place.city))];

        return uniqueCityNames.map((cityName, index) => ({
            id: index + 1,
            name: cityName,
        }));
    }, [places]);

    // -----------------------------
    // Section rendering
    // -----------------------------
    const renderSection = () => {
        if (activeSection === "dashboard") {
            return (
                <DashboardView
                    users={users}
                    cities={cities}
                    places={places}
                    reports={reports}
                />
            );
        }

        if (activeSection === "users") {
            return (
                <UsersView
                    users={users}
                    onDeleteUser={handleDeleteUser}
                    onEditUser={handleEditUser}
                />
            );
        }

        if (activeSection === "cities") {
            return (
                 <CitiesView
            cities={cities}
            places={places}
            onAddCity={handleAddCity}
            onEditCity={handleEditCity}
            onDeleteCity={handleDeleteCity}
        />
            );
        }

        if (activeSection === "places") {
            return (
                <PlacesView
                    places={places}
                    cities={cities}
                    onAddPlace={handleAddPlace}
                    onEditPlace={handleEditPlace}
                    onDeletePlace={handleDeletePlace}
                />
            );
        }

        return (
            <ReportsView
                reports={reports}
                onRemoveReport={handleRemoveReport}
                onReviewReport={handleReviewReport}
            />
        );
    };

    return (
        <div className="admin-page">
            <Navbar
                onNavigate={onNavigate}
                user={user}
                currentPage={currentPage}
                setUser={setUser}
                isGuest={isGuest}
            />

            <div className="admin-layout">
                <AdminSidebar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                />

                <main className="admin-content">{renderSection()}</main>
            </div>
        </div>
    );
}

export default AdminPage;