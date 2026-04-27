import { useState, useEffect } from "react";
import Home from "./pages/Home";
import CreateTrip from "./pages/CreateTrip";
import ExplorePlaces from "./pages/ExplorePlaces";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import AdminPage from "./pages/AdminPage";

function App() {
    const [page, setPage] = useState(() => localStorage.getItem("tripmate_page") || "home");

    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("tripmate_user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            localStorage.removeItem("tripmate_user");
            return null;
        }
    });

    const [isGuest, setIsGuest] = useState(
        () => localStorage.getItem("tripmate_guest") === "true"
    );

    const handleGuestContinue = () => {
        setIsGuest(true);
        localStorage.setItem("tripmate_guest", "true");
        setPage("explore");
    };

    useEffect(() => {
        localStorage.setItem("tripmate_page", page);
    }, [page]);

    useEffect(() => {
        if (user) {
            localStorage.setItem("tripmate_user", JSON.stringify(user));
            setIsGuest(false);
            localStorage.removeItem("tripmate_guest");
        } else {
            localStorage.removeItem("tripmate_user");
        }
    }, [user]);

    if (page === "home") {
        return (
            <Home
                onNavigate={setPage}
                user={user}
                currentPage={page}
                setUser={setUser}
                isGuest={isGuest}
                onGuestContinue={handleGuestContinue}
            />
        );
    }

    if (page === "login") {
        return <Login onNavigate={setPage} setUser={setUser} />;
    }

    if (page === "signup") {
        return <SignUp onNavigate={setPage} setUser={setUser} />;
    }

    if (page === "explore") {
        return (
            <ExplorePlaces
                onNavigate={setPage}
                user={user}
                currentPage={page}
                setUser={setUser}
                isGuest={isGuest}
            />
        );
    }

    if (page === "profile") {
        return (
            <Profile
                onNavigate={setPage}
                user={user}
                currentPage={page}
                setUser={setUser}
                isGuest={isGuest}
            />
        );
    }

    if (page === "trip") {
        return (
            <CreateTrip
                onNavigate={setPage}
                user={user}
                currentPage={page}
                setUser={setUser}
                isGuest={isGuest}
            />
        );
    }

    if (page === "admin") {
        return (
            <AdminPage
                onNavigate={setPage}
                user={user}
                currentPage={page}
                setUser={setUser}
                isGuest={isGuest}
            />
        );
    }

    return (
        <Home
            onNavigate={setPage}
            user={user}
            currentPage="home"
            setUser={setUser}
            isGuest={isGuest}
            onGuestContinue={handleGuestContinue}
        />
    );
}

export default App;