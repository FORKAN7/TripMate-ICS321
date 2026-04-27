import { useState, useRef, useEffect } from "react";
import "../styles/home.css";

function Navbar({ onNavigate, user, currentPage, setUser, isGuest }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const firstName = user?.name?.split(" ")[0] || "";

    const linkClass = (page) =>
        `home-nav__link-btn ${currentPage === page ? "home-nav__link-btn--active" : ""}`;

    const handleUserButton = () => {
        if (user?.role === "Admin") {
            onNavigate("admin");
        } else {
            onNavigate("profile");
        }
    };

    const handleSignOut = () => {
        setMenuOpen(false);
        if (setUser) setUser(null);
        localStorage.removeItem("tripmate_user");
        localStorage.removeItem("tripmate_guest");
        localStorage.setItem("tripmate_page", "home");
        onNavigate("home");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="home-nav">
            <button className="home-nav__logo" onClick={() => onNavigate("home")}>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                </svg>
                Trip Mate
            </button>

            <ul className="home-nav__links">
                {user && (
                    <li>
                        <button
                            className={linkClass("profile")}
                            onClick={() => onNavigate("profile")}
                        >
                            Profile
                        </button>
                    </li>
                )}

                {!isGuest && (
                    <li>
                        <button
                            className={linkClass("explore")}
                            onClick={() => onNavigate("explore")}
                        >
                            Explore
                        </button>
                    </li>
                )}

                {!isGuest && (
                    <li>
                        <button
                            className={linkClass("trip")}
                            onClick={() => onNavigate("trip")}
                        >
                            Plan Trip
                        </button>
                    </li>
                )}

                {user?.role === "Admin" && (
                    <li>
                        <button
                            className={linkClass("admin")}
                            onClick={() => onNavigate("admin")}
                        >
                            Admin
                        </button>
                    </li>
                )}
            </ul>

            <div className="home-nav__right">
                {user ? (
                    <button className="home-nav__hello" onClick={handleUserButton}>
                        Hello, {firstName}
                    </button>
                ) : (
                    <button className="home-nav__cta" onClick={() => onNavigate("signup")}>
                        Get started
                    </button>
                )}

                {currentPage !== "home" && !isGuest && (
                    <div className="nav-menu" ref={menuRef}>
                        <button
                            className="nav-menu__trigger"
                            onClick={() => setMenuOpen((v) => !v)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>

                        {menuOpen && (
                            <div className="nav-menu__dropdown">
                                {user ? (
                                    <button onClick={handleSignOut}>Sign out</button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onNavigate("login");
                                            }}
                                        >
                                            Log in
                                        </button>
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onNavigate("signup");
                                            }}
                                        >
                                            Sign up
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
