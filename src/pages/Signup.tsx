import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.ts";
import "./Login.css";

const Signup: React.FC = () => {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

            // Create user with Firebase Authentication
            await createUserWithEmailAndPassword(auth, email.trim(), password);

            alert("Account created successfully!");

            // Store user info in localStorage including parent contacts
            const userObj: any = {
                displayName: displayName.trim(),
                email: email.trim(),
                userType: "student",
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
            <div className="login-background">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Create account</h1>
                        <p>Join E-Learning Hub — vision training for kids</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }} className="login-form">
                        <div className="form-group">
                            <label htmlFor="displayName">Full Name</label>
                            <input
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your full name"
                                disabled={loading}
                                autoComplete="name"
                            />
                        </div>

                        {/* parent info section */}
                        <h3 style={{ marginTop: 20, fontSize: '1rem', fontWeight: 'bold' }}>Primary Parent Information</h3>
                        <div className="form-group">
                            <label htmlFor="primaryName">Name</label>
                            <input
                                id="primaryName"
                                type="text"
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
                                id="primaryEmail"
                                type="email"
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
                                id="primaryPhone"
                                type="tel"
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
                                id="primaryAddress"
                                type="text"
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
                                id="secondaryName"
                                type="text"
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
                                id="secondaryEmail"
                                type="email"
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
                                id="secondaryPhone"
                                type="tel"
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
                                id="secondaryAddress"
                                type="text"
                                value={secondaryAddress}
                                onChange={(e) => setSecondaryAddress(e.target.value)}
                                placeholder="123 Main street, City"
                                disabled={loading}
                                autoComplete="street-address"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                disabled={loading}
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password (min 3 chars)"
                                    disabled={loading}
                                    autoComplete="new-password"
                                />
                                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "👁️" : "👁️‍🗨️"}</button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    disabled={loading}
                                    autoComplete="new-password"
                                />
                                <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</button>
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
