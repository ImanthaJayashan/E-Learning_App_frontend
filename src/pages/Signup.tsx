import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase.ts";
import "./Login.css";

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
    message: string;
    type: NotificationType;
    id: number;
}

const Signup: React.FC = () => {
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

    // parent info
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

    const handleAddressChange = (value: string, setter: (val: string) => void) => {
        // Limit address to 100 characters
        if (value.length <= 100) {
            setter(value);
        }
    };

    const handleNameChange = (value: string, setter: (val: string) => void) => {
        // Only allow letters and spaces, limit to 50 characters
        const filtered = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
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

            // Create user with Firebase Authentication
            await createUserWithEmailAndPassword(auth, email.trim(), password);

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName: displayName.trim() });
            }

            showNotification("✅ Account created successfully! Redirecting...", "success");

            // Store user info in localStorage including parent contacts
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
            console.log("[Signup] saving user object", userObj);
            localStorage.setItem("user", JSON.stringify(userObj));
            localStorage.setItem("userRole", "student");
            // Mark that we should auto-apply saved role on the role-selection page
            localStorage.setItem("autoRoleSelection", "true");

            // Redirect to role selection
            navigate("/role-selection");
        } catch (error: any) {
            console.error("Firebase Error Code:", error.code);
            console.error("Firebase Error Message:", error.message);

            // Display detailed error messages
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
                    <div className="login-header">
                        <h1>Create account</h1>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }} className="login-form">
                        {/* Student Information Section */}
                        <div style={{ 
                            background: '#f8f9ff', 
                            border: '2px solid #667eea', 
                            borderRadius: '12px', 
                            padding: '20px', 
                            marginBottom: '24px' 
                        }}>
                            <h3 style={{ 
                                fontSize: '1.1rem', 
                                fontWeight: 'bold', 
                                color: '#667eea', 
                                marginTop: 0, 
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>👤</span> Student Information <span style={{ color: '#e74c3c', fontSize: '1.2rem' }}>*</span>
                            </h3>
                            <div className="form-group">
                                <label htmlFor="displayName">Full Name <span style={{ color: '#e74c3c' }}>*</span></label>
                                <input
                                    id="displayName"
                                    value={displayName}
                                    onChange={(e) => handleNameChange(e.target.value, setDisplayName)}
                                    placeholder="Enter student's full name"
                                    disabled={loading}
                                    autoComplete="name"
                                    maxLength={50}
                                    required
                                />
                                <small style={{ color: '#666', fontSize: '0.8rem' }}>Letters only, 2-50 characters</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Student Email Address <span style={{ color: '#e74c3c' }}>*</span></label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="student@example.com"
                                    disabled={loading}
                                    autoComplete="email"
                                    required
                                />
                                <small style={{ color: '#666', fontSize: '0.8rem' }}>Must contain @ symbol (e.g., student@example.com)</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password <span style={{ color: '#e74c3c' }}>*</span></label>
                                <div className="password-input-wrapper">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            calculatePasswordStrength(e.target.value);
                                        }}
                                        placeholder="Minimum 6 characters"
                                        disabled={loading}
                                        autoComplete="new-password"
                                        minLength={6}
                                        required
                                    />
                                    <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "👁️" : "👁️‍🗨️"}</button>
                                </div>
                                {passwordStrength.text && (
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
                                <small style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '4px' }}>At least 6 characters (use uppercase, lowercase, numbers & symbols for strong password)</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password <span style={{ color: '#e74c3c' }}>*</span></label>
                                <div className="password-input-wrapper">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter your password"
                                        disabled={loading}
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</button>
                                </div>
                            </div>
                        </div>

                        {/* Primary Parent Information Section */}
                        <div style={{ 
                            background: '#fff5f5', 
                            border: '2px solid #667eea', 
                            borderRadius: '12px', 
                            padding: '20px', 
                            marginBottom: '24px' 
                        }}>
                            <h3 style={{ 
                                fontSize: '1.1rem', 
                                fontWeight: 'bold', 
                                color: '#667eea', 
                                marginTop: 0, 
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>👨‍👩‍👦</span> Primary Parent/Guardian Information <span style={{ color: '#e74c3c', fontSize: '1.2rem' }}>*</span>
                            </h3>
                            <div className="form-group">
                                <label htmlFor="primaryName">Full Name <span style={{ color: '#e74c3c' }}>*</span></label>
                                <input
                                    id="primaryName"
                                    type="text"
                                    value={primaryName}
                                    onChange={(e) => handleNameChange(e.target.value, setPrimaryName)}
                                    placeholder="Parent/Guardian full name"
                                    disabled={loading}
                                    autoComplete="name"
                                    maxLength={50}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="primaryEmail">Email Address <span style={{ color: '#e74c3c' }}>*</span></label>
                                <input
                                    id="primaryEmail"
                                    type="email"
                                    value={primaryEmail}
                                    onChange={(e) => setPrimaryEmail(e.target.value)}
                                    placeholder="parent@example.com"
                                    disabled={loading}
                                    autoComplete="email"
                                    required
                                />
                                <small style={{ color: '#666', fontSize: '0.8rem' }}>Must contain @ symbol (e.g., parent@example.com)</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="primaryPhone">Phone Number (Optional)</label>
                                <input
                                    id="primaryPhone"
                                    type="tel"
                                    value={primaryPhone}
                                    onChange={(e) => handlePhoneChange(e.target.value, setPrimaryPhone)}
                                    placeholder="0712345678"
                                    disabled={loading}
                                    autoComplete="tel"
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                />
                                {phoneError && <div style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '4px' }}>{phoneError}</div>}
                                <small style={{ color: '#666', fontSize: '0.8rem' }}>Must be exactly 10 digits</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="primaryAddress">Address (Optional)</label>
                                <textarea
                                    id="primaryAddress"
                                    value={primaryAddress}
                                    onChange={(e) => handleAddressChange(e.target.value, setPrimaryAddress)}
                                    placeholder="Street address, City, Postal Code"
                                    disabled={loading}
                                    autoComplete="street-address"
                                    rows={2}
                                    maxLength={100}
                                    style={{
                                        width: '100%',
                                        padding: '13px 16px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        minHeight: '60px'
                                    }}
                                />
                                <small style={{ color: '#666', fontSize: '0.8rem' }}>{primaryAddress.length}/100 characters</small>
                            </div>
                        </div>

                        {/* Secondary Parent Information Section */}
                        <div style={{ 
                            background: '#f9f9f9', 
                            border: '2px dashed #95a5a6', 
                            borderRadius: '12px', 
                            padding: '20px', 
                            marginBottom: '24px' 
                        }}>
                            <h3 style={{ 
                                fontSize: '1.1rem', 
                                fontWeight: 'bold', 
                                color: '#95a5a6', 
                                marginTop: 0, 
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>👤</span> Secondary Parent/Guardian
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: '#7f8c8d', marginTop: 0, marginBottom: '16px', fontStyle: 'italic' }}>
                                All fields in this section are optional
                            </p>
                            <div className="form-group">
                                <label htmlFor="secondaryName">Full Name</label>
                                <input
                                    id="secondaryName"
                                    type="text"
                                    value={secondaryName}
                                    onChange={(e) => handleNameChange(e.target.value, setSecondaryName)}
                                    placeholder="Second parent/guardian name (optional)"
                                    disabled={loading}
                                    autoComplete="name"
                                    maxLength={50}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="secondaryEmail">Email Address</label>
                                <input
                                    id="secondaryEmail"
                                    type="email"
                                    value={secondaryEmail}
                                    onChange={(e) => setSecondaryEmail(e.target.value)}
                                    placeholder="parent2@example.com (optional)"
                                    disabled={loading}
                                    autoComplete="email"
                                />
                                <small style={{ color: '#666', fontSize: '0.8rem' }}>Must contain @ symbol if provided</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="secondaryPhone">Phone Number</label>
                                <input
                                    id="secondaryPhone"
                                    type="tel"
                                    value={secondaryPhone}
                                    onChange={(e) => handlePhoneChange(e.target.value, setSecondaryPhone)}
                                    placeholder="0772345678 (optional)"
                                    disabled={loading}
                                    autoComplete="tel"
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                />
                                {phoneError && <div style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '4px' }}>{phoneError}</div>}
                                <small style={{ color: '#666', fontSize: '0.8rem' }}>Must be exactly 10 digits if provided</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="secondaryAddress">Address</label>
                                <textarea
                                    id="secondaryAddress"
                                    value={secondaryAddress}
                                    onChange={(e) => handleAddressChange(e.target.value, setSecondaryAddress)}
                                    placeholder="Street address, City, Postal Code (optional)"
                                    disabled={loading}
                                    autoComplete="street-address"
                                    rows={2}
                                    maxLength={100}
                                    style={{
                                        width: '100%',
                                        padding: '13px 16px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        minHeight: '60px'
                                    }}
                                />
                                <small style={{ color: '#666', fontSize: '0.8rem' }}>{secondaryAddress.length}/100 characters</small>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
                    </form>
                </div>

                <div className="login-info">
                    <h3>Welcome aboard</h3>
                    <p>After signing up you'll get access to therapy games, progress tracking, and personalized exercises.</p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
