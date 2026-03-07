import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase.ts";
import "./Login.css";

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // parent contact info (signup only)
    const [primaryName, setPrimaryName] = useState("");
    const [primaryEmail, setPrimaryEmail] = useState("");
    const [primaryPhone, setPrimaryPhone] = useState("");
    const [primaryAddress, setPrimaryAddress] = useState("");
    const [secondaryName, setSecondaryName] = useState("");
    const [secondaryEmail, setSecondaryEmail] = useState("");
    const [secondaryPhone, setSecondaryPhone] = useState("");
    const [secondaryAddress, setSecondaryAddress] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            if (!email.trim() || !password.trim()) {
                setError("Email and password are required");
                return;
            }

            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                setError("Please enter a valid email");
                return;
            }

            setLoading(true);
            setError("");

            // Sign in with Firebase
            await signInWithEmailAndPassword(auth, email.trim(), password);

            alert("Login successful!");

            // Store user info and avoid leaking a previous account profile into this login.
            try {
                const saved = localStorage.getItem("user");
                console.log("[Login] merging with saved user", saved);
                const normalizedEmail = email.trim().toLowerCase();
                const fallbackDisplayName = auth.currentUser?.displayName?.trim() || normalizedEmail.split("@")[0];
                if (saved) {
                    const obj: any = JSON.parse(saved);
                    const savedEmail = typeof obj.email === "string" ? obj.email.trim().toLowerCase() : "";
                    if (savedEmail === normalizedEmail) {
                        obj.email = email.trim();
                        if (!obj.displayName && fallbackDisplayName) obj.displayName = fallbackDisplayName;
                        localStorage.setItem("user", JSON.stringify(obj));
                    } else {
                        localStorage.setItem("user", JSON.stringify({
                            email: email.trim(),
                            displayName: fallbackDisplayName,
                            age: "5 years old",
                            grade: "Pre-School",
                            level: "Advanced",
                        }));
                    }
                } else {
                    localStorage.setItem("user", JSON.stringify({
                        email: email.trim(),
                        displayName: fallbackDisplayName,
                        age: "5 years old",
                        grade: "Pre-School",
                        level: "Advanced",
                    }));
                }
            } catch (e) {
                console.error("[Login] error merging user info", e);
                // fallback to minimal info
                localStorage.setItem("user", JSON.stringify({
                    email: email.trim(),
                    displayName: auth.currentUser?.displayName?.trim() || email.trim().split("@")[0],
                    age: "5 years old",
                    grade: "Pre-School",
                    level: "Advanced",
                }));
            }

            // Mark that we should auto-apply saved role on the role-selection page
            localStorage.setItem("autoRoleSelection", "true");
            // Redirect to role selection
            navigate("/role-selection");
        } catch (error: any) {
            console.error("Firebase Error Code:", error.code);
            console.error("Firebase Error Message:", error.message);

            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                setError("Incorrect email or password");
            } else if (error.code === "auth/invalid-email") {
                setError("Invalid email address");
            } else if (error.code === "auth/user-disabled") {
                setError("This account has been disabled");
            } else {
                setError(error.message);
            }
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        try {
            if (!displayName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
                setError("All fields are required");
                return;
            }
            if (!primaryName.trim() || !primaryEmail.trim()) {
                setError("Primary parent name and email are required");
                return;
            }

            if (password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                setError("Please enter a valid email");
                return;
            }

            setLoading(true);
            setError("");

            // Create user with Firebase
            await createUserWithEmailAndPassword(auth, email.trim(), password);

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: displayName.trim() });
            }

            alert("Account created successfully!");

            // Store user info along with parent contact details
            const userObj: any = {
                displayName: displayName.trim(),
                email: email.trim(),
                userType: "student",
                age: "5 years old",
                grade: "Pre-School",
                level: "Advanced",
                primaryParent: {
                    name: primaryName.trim(),
                    email: primaryEmail.trim(),
                    phone: primaryPhone.trim(),
                    address: primaryAddress.trim(),
                },
            };
            if (secondaryName.trim() || secondaryEmail.trim() || secondaryPhone.trim() || secondaryAddress.trim()) {
                userObj.secondaryParent = {
                    name: secondaryName.trim(),
                    email: secondaryEmail.trim(),
                    phone: secondaryPhone.trim(),
                    address: secondaryAddress.trim(),
                };
            }
            console.log("[Login sign-up] saving user object", userObj);
            localStorage.setItem("user", JSON.stringify(userObj));
            localStorage.setItem("userRole", "student");

            // Redirect to role selection
            navigate("/role-selection");
        } catch (error: any) {
            console.error("Firebase Error Code:", error.code);
            console.error("Firebase Error Message:", error.message);

            if (error.code === "auth/operation-not-allowed") {
                setError("❌ Email/Password authentication is NOT enabled in Firebase. Please contact admin.");
            } else if (error.code === "auth/email-already-in-use") {
                setError("This email is already registered. Please login instead.");
            } else if (error.code === "auth/weak-password") {
                setError("Password should be at least 6 characters");
            } else if (error.code === "auth/invalid-email") {
                setError("Invalid email address format");
            } else if (error.code === "auth/user-disabled") {
                setError("This account has been disabled");
            } else {
                setError(`Error: ${error.message}`);
            }
            setLoading(false);
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError("");
        setDisplayName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPrimaryName("");
        setPrimaryEmail("");
        setPrimaryPhone("");
        setPrimaryAddress("");
        setSecondaryName("");
        setSecondaryEmail("");
        setSecondaryPhone("");
        setSecondaryAddress("");
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="login-card">
                    {/* Logo/Header */}
                    <div className="login-header">
                        <h1>E-Learning Hub</h1>
                        <p>Vision Training & Eye Care</p>
                    </div>

                    {/* Form Title */}
                    <h2 className="form-title">
                        {isLogin ? "Login" : "Create Account"}
                    </h2>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            {error}
                            {error.includes("Sign Up") && (
                                <div style={{ marginTop: 8 }}>
                                    <button type="button" className="toggle-btn" onClick={() => navigate('/signup')}>Go to Sign Up</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Login/Signup Form */}
                    <form onSubmit={(e) => { e.preventDefault(); isLogin ? handleLogin() : handleSignUp(); }} className="login-form">
                        {/* Full Name (Signup only) */}
                        {!isLogin && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="displayName">Full Name</label>
                                    <input
                                        type="text"
                                        id="displayName"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Enter your full name"
                                        disabled={loading}
                                        autoComplete="name"
                                    />
                                </div>

                                {/* Parent contact sections */}
                                <h3 style={{ marginTop: 20, fontSize: '1rem', fontWeight: 'bold' }}>Primary Parent Information</h3>
                                <div className="form-group">
                                    <label htmlFor="primaryName">Name</label>
                                    <input
                                        type="text"
                                        id="primaryName"
                                        value={primaryName}
                                        onChange={(e) => setPrimaryName(e.target.value)}
                                        placeholder="Primary parent full name"
                                        disabled={loading}
                                        autoComplete="name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="primaryEmail">Email</label>
                                    <input
                                        type="email"
                                        id="primaryEmail"
                                        value={primaryEmail}
                                        onChange={(e) => setPrimaryEmail(e.target.value)}
                                        placeholder="parent@example.com"
                                        disabled={loading}
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="primaryPhone">Phone</label>
                                    <input
                                        type="tel"
                                        id="primaryPhone"
                                        value={primaryPhone}
                                        onChange={(e) => setPrimaryPhone(e.target.value)}
                                        placeholder="e.g. +94 71 123 4567"
                                        disabled={loading}
                                        autoComplete="tel"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="primaryAddress">Address</label>
                                    <input
                                        type="text"
                                        id="primaryAddress"
                                        value={primaryAddress}
                                        onChange={(e) => setPrimaryAddress(e.target.value)}
                                        placeholder="123 Main street, City"
                                        disabled={loading}
                                        autoComplete="street-address"
                                    />
                                </div>

                                <h3 style={{ marginTop: 20, fontSize: '1rem', fontWeight: 'bold' }}>Secondary Parent (optional)</h3>
                                <div className="form-group">
                                    <label htmlFor="secondaryName">Name</label>
                                    <input
                                        type="text"
                                        id="secondaryName"
                                        value={secondaryName}
                                        onChange={(e) => setSecondaryName(e.target.value)}
                                        placeholder="Secondary parent full name"
                                        disabled={loading}
                                        autoComplete="name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="secondaryEmail">Email</label>
                                    <input
                                        type="email"
                                        id="secondaryEmail"
                                        value={secondaryEmail}
                                        onChange={(e) => setSecondaryEmail(e.target.value)}
                                        placeholder="parent2@example.com"
                                        disabled={loading}
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="secondaryPhone">Phone</label>
                                    <input
                                        type="tel"
                                        id="secondaryPhone"
                                        value={secondaryPhone}
                                        onChange={(e) => setSecondaryPhone(e.target.value)}
                                        placeholder="e.g. +94 77 123 4567"
                                        disabled={loading}
                                        autoComplete="tel"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="secondaryAddress">Address</label>
                                    <input
                                        type="text"
                                        id="secondaryAddress"
                                        value={secondaryAddress}
                                        onChange={(e) => setSecondaryAddress(e.target.value)}
                                        placeholder="123 Main street, City"
                                        disabled={loading}
                                        autoComplete="street-address"
                                    />
                                </div>
                            </>
                        )}

                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email">
                                {isLogin ? "Email Address" : "Email Address"}
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={isLogin ? "Enter your email" : "your@email.com"}
                                disabled={loading}
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={isLogin ? "Enter your password" : "Create a password (min 3 chars)"}
                                    disabled={loading}
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password (Signup only) */}
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Remember Me (Login only) */}
                        {isLogin && (
                            <div className="form-group checkbox">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    disabled={loading}
                                />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading
                                ? isLogin
                                    ? "Logging in..."
                                    : "Creating Account..."
                                : isLogin
                                    ? "Login"
                                    : "Sign Up"}
                        </button>
                    </form>

                    {/* Toggle Between Login and Signup */}
                    <div className="auth-toggle">
                        <p>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                type="button"
                                onClick={toggleAuthMode}
                                className="toggle-btn"
                            >
                                {isLogin ? "Sign Up" : "Login"}
                            </button>
                        </p>
                    </div>

                    {/* Forgot Password (Login only) */}
                    {isLogin && (
                        <div className="forgot-password">
                            <button type="button" className="toggle-btn" onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
                        </div>
                    )}
                </div>

                {/* Right Side Info */}
                <div className="login-info">
                    <h3>Welcome to E-Learning Hub</h3>
                    <p>
                        Our comprehensive platform helps students improve their vision and
                        eye health through interactive games and therapy exercises.
                    </p>
                    <div className="features">
                        <div className="feature">
                            <span className="feature-icon">🎮</span>
                            <p>Interactive Games</p>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">👁️</span>
                            <p>Vision Training</p>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">📊</span>
                            <p>Progress Tracking</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
