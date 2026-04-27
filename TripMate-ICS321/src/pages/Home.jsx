import Navbar from "../components/Navbar";
import homeBg from "../assets/imgs/HomePage.jpeg";
import "../styles/home.css";

function Home({ onNavigate, user, currentPage, setUser, onGuestContinue }) {
    return (
        <div className="home-page" style={{ backgroundImage: `url(${homeBg})` }}>
            <Navbar onNavigate={onNavigate} user={user} currentPage={currentPage} setUser={setUser} />

            <div className="home-page__overlay" />
            <section className="home-hero">
                <div className="home-hero__text">
                    <h1 className="home-hero__heading">
                        Your Next Travel<br />
                        <span>Starts Here</span>
                    </h1>
                    <button className="home-hero__btn" onClick={onGuestContinue}>
                        Continue As Guest
                    </button>
                </div>
            </section>

            <section className="home-features">
                <h2 className="home-features__title">Features</h2>
                <div className="home-features__grid">
                    <div className="feature-card">
                        <div className="feature-card__icon-wrap">
                            <svg className="feature-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h6v13H3zM9 3h6v16H9zM15 8h6v11h-6z"/>
                                <path d="M3 6c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2"/>
                            </svg>
                        </div>
                        <h3 className="feature-card__title">Smart Itineraries</h3>
                        <p className="feature-card__desc">Plan your perfect trip with AI-powered route suggestions and local insights.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-card__icon-wrap">
                            <svg className="feature-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                        </div>
                        <h3 className="feature-card__title">Easy Scheduling</h3>
                        <p className="feature-card__desc">Organize your travel dates, bookings, and activities all in one place.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-card__icon-wrap">
                            <svg className="feature-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="7" r="3"/>
                                <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                <path d="M21 21v-2a4 4 0 0 0-3-3.87"/>
                            </svg>
                        </div>
                        <h3 className="feature-card__title">Group Travel</h3>
                        <p className="feature-card__desc">Collaborate with friends and family to plan trips together seamlessly.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
