import { useState } from "react";
import "../styles/auth.css";

function Login({ onNavigate, setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [banner, setBanner] = useState(null);

    const validate = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!password) {
            newErrors.password = "Password is required.";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setBanner(null);
            return;
        }

        setErrors({});

        const normalizedEmail = email.trim().toLowerCase();
        const adminEmail = "admin@gmail.com";
        const adminPassword = "admin123";

        if (normalizedEmail === adminEmail) {
            if (password !== adminPassword) {
                setBanner({
                    type: "error",
                    message: "Invalid admin password. Please try again.",
                });
                return;
            }

            setUser({
                name: "Admin",
                email: normalizedEmail,
                role: "Admin",
            });

            setBanner({
                type: "success",
                message: "Admin login successful! Redirecting...",
            });

            setTimeout(() => onNavigate("admin"), 1200);
            return;
        }

        setUser({
            name: normalizedEmail.split("@")[0],
            email: normalizedEmail,
            role: "Member",
        });

        setBanner({
            type: "success",
            message: "Login successful! Redirecting...",
        });

        setTimeout(() => onNavigate("profile"), 1200);
    };

    return (
        <div className="auth-page">
            <div className="auth-content">
                <div className="auth-card">
                    <button
                        type="button"
                        className="auth-back"
                        onClick={() => onNavigate("home")}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Home
                    </button>

                    <h1 className="auth-title">
                        Start your journey with us <span>today</span>
                    </h1>

                    {banner && (
                        <div className={`auth-banner auth-banner--${banner.type}`}>
                            <span className="auth-banner__icon">
                                {banner.type === "success" ? (
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                ) : (
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="15" y1="9" x2="9" y2="15" />
                                        <line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                )}
                            </span>
                            {banner.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="auth-field">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={errors.email ? "input-error" : ""}
                            />
                            {errors.email && (
                                <span className="field-error">{errors.email}</span>
                            )}
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">Password</label>
                            <div className="auth-input-wrap">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={errors.password ? "input-error" : ""}
                                />

                                <button
                                    type="button"
                                    className="auth-eye"
                                    onClick={() => setShowPassword((v) => !v)}
                                >
                                    {showPassword ? (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {errors.password && (
                                <span className="field-error">{errors.password}</span>
                            )}
                        </div>

                        <button type="submit" className="auth-btn-primary">
                            Login
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account?{" "}
                        <button type="button" onClick={() => onNavigate("signup")}>
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;