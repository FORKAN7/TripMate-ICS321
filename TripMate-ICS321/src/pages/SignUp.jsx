import { useState } from "react";
import { registerUser, checkEmailExists } from "../utils/auth";
import "../styles/auth.css";

const GOOGLE_LOGO = "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg";

const EyeIcon = ({ visible }) => visible ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

function SignUp({ onNavigate, setUser }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [banner, setBanner] = useState(null);

    const validate = () => {
        const newErrors = {};
        if (!fullName.trim()) newErrors.fullName = "Full name is required.";
        if (!email.trim()) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email address.";
        if (!password) newErrors.password = "Password is required.";
        else if (password.length < 8) newErrors.password = "Password must be at least 8 characters.";
        if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
        else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
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
        if (checkEmailExists(email)) {
            setBanner({ type: "error", message: "An account with this email already exists." });
            return;
        }
        const joinedAt = new Date();
        const result = registerUser({ fullName, email, password, role: "member", joinedAt });
        setUser(result.user);
        setBanner({ type: "success", message: "Account created! Redirecting..." });
        setTimeout(() => onNavigate("profile"), 1500);
    };

    return (
        <div className="auth-page">
            <div className="auth-content">
                <div className="auth-card">
                    <button className="auth-back" onClick={() => onNavigate("home")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
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
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                )}
                            </span>
                            {banner.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="auth-field">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className={errors.fullName ? "input-error" : ""}
                            />
                            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                        </div>

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
                            {errors.email && <span className="field-error">{errors.email}</span>}
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
                                <button type="button" className="auth-eye" onClick={() => setShowPassword(v => !v)}>
                                    <EyeIcon visible={showPassword} />
                                </button>
                            </div>
                            {errors.password && <span className="field-error">{errors.password}</span>}
                        </div>

                        <div className="auth-field">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="auth-input-wrap">
                                <input
                                    id="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={errors.confirmPassword ? "input-error" : ""}
                                />
                                <button type="button" className="auth-eye" onClick={() => setShowConfirm(v => !v)}>
                                    <EyeIcon visible={showConfirm} />
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                        </div>

                        <button type="submit" className="auth-btn-primary">Create Account</button>
                    </form>

                    <div className="auth-divider">or continue with</div>

                    <button className="auth-btn-google" type="button">
                        <img src={GOOGLE_LOGO} alt="Google" />
                        Sign up with Google
                    </button>

                    <p className="auth-footer">
                        Already have an account?{" "}
                        <button onClick={() => onNavigate("login")}>Log in</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
