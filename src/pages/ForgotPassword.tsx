import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase.ts";
import "./Login.css";

const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState<"request" | "done">("request");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Please enter your email address");
            return;
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            // Send password reset email
            await sendPasswordResetEmail(auth, email.trim());
            setStep("done");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to send reset email";
            if (errorMessage.includes("user-not-found")) {
                // Privacy: don't reveal if user exists
                setStep("done");
            } else if (errorMessage.includes("invalid-email")) {
                setError("Invalid email address");
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Reset Password</h1>
                        <p>Enter your email to receive reset instructions.</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {step === "request" && (
                        <form onSubmit={handleRequest} className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    disabled={loading}
                                />
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</button>
                        </form>
                    )}

                    {step === "done" && (
                        <div style={{ textAlign: "center" }}>
                            <h3>✓ Check your email</h3>
                            <p>If an account exists with that email, you'll receive a password reset link. Please check your email and follow the instructions.</p>
                            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
                                <button className="nav-cta nav-login" onClick={() => navigate('/login')}>Back to Login</button>
                                <button className="nav-cta nav-signup" onClick={() => navigate('/signup')}>Create Account</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="login-info">
                    <h3>Password Reset</h3>
                    <p>A reset link will be sent to your registered email address. Check your inbox and spam folder.</p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
