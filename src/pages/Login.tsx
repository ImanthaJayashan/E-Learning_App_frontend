import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase.ts";
import "./Login.css";

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
    message: string;
    type: NotificationType;
    id: number;
}

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
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [phoneError, setPhoneError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState<{ level: string; color: string; text: string }>({ level: '', color: '', text: '' });

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

    const showNotification = (message: string, type: NotificationType) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { message, type, id }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 4000);
    };

    const validateEmail = (email: string): boolean => {
        // Email must contain @ symbol
        if (!email.includes('@')) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        if (!phone.trim()) return true; // Optional field
        // Must be exactly 10 digits, numbers only
        return /^[0-9]{10}$/.test(phone.trim());
    };

    const validateName = (name: string): boolean => {
        return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
    };

    const handlePhoneChange = (value: string, setter: (val: string) => void) => {
        // Check if there are any non-digit characters
        if (value && /[^0-9]/.test(value)) {
            setPhoneError("⚠️ Please enter numbers only");
            setTimeout(() => setPhoneError(""), 2000);
        }
        // Only allow digits and limit to 10 characters
        const filtered = value.replace(/\D/g, '').slice(0, 10);
        setter(filtered);
    };

    const calculatePasswordStrength = (pwd: string) => {
        if (!pwd) {
            setPasswordStrength({ level: '', color: '', text: '' });
            return;
        }

        let strength = 0;
        
        // Length check
        if (pwd.length >= 6) strength++;
        if (pwd.length >= 8) strength++;
        if (pwd.length >= 12) strength++;
        
        // Character variety checks
        if (/[a-z]/.test(pwd)) strength++; // lowercase
        if (/[A-Z]/.test(pwd)) strength++; // uppercase
        if (/[0-9]/.test(pwd)) strength++; // numbers
        if (/[^a-zA-Z0-9]/.test(pwd)) strength++; // special characters

        // Determine strength level
        if (strength <= 2) {
            setPasswordStrength({ level: 'weak', color: '#e74c3c', text: '🔒 Weak' });
        } else if (strength <= 4) {
            setPasswordStrength({ level: 'medium', color: '#f39c12', text: '🔐 Medium' });
        } else {
            setPasswordStrength({ level: 'strong', color: '#27ae60', text: '🔐 Strong' });
        }
    };

    const handleLogin = async () => {
        try {
            // Validation
            if (!email.trim()) {
                setError("Email is required");
                return;
            }

            if (!password.trim()) {
                setError("Password is required");
                return;
            }

            if (!validateEmail(email)) {
                showNotification("Email must contain @ symbol and be valid (e.g., user@example.com)", "error");
                return;
            }

            // Sign in with Firebase
            await signInWithEmailAndPassword(auth, email.trim(), password);

            showNotification("🎉 Login successful! Redirecting...", "success");

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
            // Basic field validations
            if (!displayName.trim()) {
                setError("Full name is required");
                return;
            }

            if (!validateName(displayName)) {
                setError("Please enter a valid name (letters only, at least 2 characters)");
                return;
            }

            if (!email.trim()) {
                setError("Email is required");
                return;
            }

            if (!validateEmail(email)) {
                showNotification("Email must contain @ symbol and be valid (e.g., user@example.com)", "error");
                return;
            }

            if (!password.trim()) {
                setError("Password is required");
                return;
            }

            if (password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }

            if (!confirmPassword.trim()) {
                setError("Please confirm your password");
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            // Primary parent validations
            if (!primaryName.trim()) {
                setError("Primary parent name is required");
                return;
            }

            if (!validateName(primaryName)) {
                setError("Please enter a valid primary parent name");
                return;
            }

            if (!primaryEmail.trim()) {
                setError("Primary parent email is required");
                return;
            }

            if (!validateEmail(primaryEmail)) {
                showNotification("Primary parent email must contain @ symbol and be valid", "error");
                return;
            }

            if (primaryPhone.trim() && !validatePhone(primaryPhone)) {
                setError("Phone number must be exactly 10 digits (numbers only)");
                return;
            }

            // Secondary parent validations (if any field is filled)
            const hasSecondaryInfo = secondaryName.trim() || secondaryEmail.trim() || secondaryPhone.trim() || secondaryAddress.trim();
            
            if (hasSecondaryInfo) {
                if (secondaryEmail.trim() && !validateEmail(secondaryEmail)) {
                    showNotification("Secondary parent email must contain @ symbol and be valid", "error");
                    return;
                }

                if (secondaryPhone.trim() && !validatePhone(secondaryPhone)) {
                    setError("Phone number must be exactly 10 digits (numbers only)");
                    return;
                }

                if (secondaryName.trim() && !validateName(secondaryName)) {
                    setError("Please enter a valid secondary parent name");
                    return;
                }
            }

            setLoading(true);
            setError("");

            // Create user with Firebase
            await createUserWithEmailAndPassword(auth, email.trim(), password);

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: displayName.trim() });
            }

            showNotification("✅ Account created successfully! Redirecting...", "success");

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
        setPasswordStrength({ level: '', color: '', text: '' });
    };

    return (
        <div className="login-container">
            {/* Notification Container */}
            <div className="notification-container">
                {notifications.map(notification => (
                    <div key={notification.id} className={`notification notification-${notification.type}`}>
                        <span>{notification.message}</span>
                    </div>
                ))}
            </div>

            <div className="login-background">
                <div className="login-card">
                    {/* Logo/Header */}
                    <div className="login-header">
                        <h1>E-Learning Hub</h1>
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
                                <h3 style={{ marginTop: 20, fontSize: '1rem', fontWeight: 'bold', color: '#667eea' }}>Primary Parent Information <span style={{ color: '#e74c3c' }}>*</span></h3>
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
                                    <small style={{ color: '#666', fontSize: '0.8rem' }}>Must contain @ symbol (e.g., parent@example.com)</small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="primaryPhone">Phone (10 digits)</label>
                                    <input
                                        type="tel"
                                        id="primaryPhone"
                                        value={primaryPhone}
                                        onChange={(e) => handlePhoneChange(e.target.value, setPrimaryPhone)}
                                        placeholder="e.g. 0711234567"
                                        disabled={loading}
                                        autoComplete="tel"
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                    />
                                    {phoneError && <div style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '4px' }}>{phoneError}</div>}
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

                                <h3 style={{ marginTop: 20, fontSize: '1rem', fontWeight: 'bold', color: '#95a5a6' }}>Secondary Parent <span style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>(Optional)</span></h3>
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
                                    <small style={{ color: '#666', fontSize: '0.8rem' }}>Must contain @ symbol if provided</small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="secondaryPhone">Phone (10 digits)</label>
                                    <input
                                        type="tel"
                                        id="secondaryPhone"
                                        value={secondaryPhone}
                                        onChange={(e) => handlePhoneChange(e.target.value, setSecondaryPhone)}
                                        placeholder="e.g. 0771234567"
                                        disabled={loading}
                                        autoComplete="tel"
                                        maxLength={10}
                                        pattern="[0-9]{10}"
                                    />
                                    {phoneError && <div style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '4px' }}>{phoneError}</div>}
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
                            <small style={{ color: '#666', fontSize: '0.8rem' }}>Must contain @ symbol (e.g., user@example.com)</small>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (!isLogin) {
                                            calculatePasswordStrength(e.target.value);
                                        }
                                    }}
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
                            {!isLogin && passwordStrength.text && (
                                <div style={{
                                    marginTop: '8px',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    backgroundColor: `${passwordStrength.color}15`,
                                    border: `1px solid ${passwordStrength.color}`,
                                    display: 'inline-block'
                                }}>
                                    <span style={{ 
                                        color: passwordStrength.color, 
                                        fontSize: '0.85rem',
                                        fontWeight: '600'
                                    }}>
                                        {passwordStrength.text}
                                    </span>
                                </div>
                            )}
                            {!isLogin && (
                                <small style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '4px' }}>At least 6 characters (use uppercase, lowercase, numbers & symbols for strong password)</small>
                            )}
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
