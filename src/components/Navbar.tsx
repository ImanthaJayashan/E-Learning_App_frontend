import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const username = localStorage.getItem("username");
  const modeLabel = userRole === "student" ? "Child Mode" : userRole === "parent" ? "Parent Mode" : "";
  const modeIcon = userRole === "student" ? "👧" : userRole === "parent" ? "👨‍👩‍👧" : "";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("latestEyeDetection");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link className="nav-brand" to="/">
          <img className="nav-logo" src="/Gemini_Generated_Image_5rph3y5rph3y5rph.png" alt="Little Learners Hub logo" />
          <div className="brand-text">
            <span className="brand-main">Little Learners</span>
            <span className="brand-accent">Hub</span>
          </div>
        </Link>

        <ul className="nav-links">
          <li><Link className="nav-link" to="/">Home</Link></li>
          <li><Link className="nav-link" to="#">Lessons</Link></li>
          <li><Link className="nav-link" to="#">Resource</Link></li>
          <li><Link className="nav-link" to="#">AboutUs</Link></li>
        </ul>

        <div className="nav-right">
          {userRole && (
            <div className="nav-mode" title={`Current role: ${modeLabel}`}>
              <span className="nav-mode-icon">{modeIcon}</span>
              <span className="nav-mode-label">{modeLabel}</span>
            </div>
          )}
          {userRole && username && (
            <div className="user-info">
              <span className="user-badge">
                {userRole === "student" ? "👨‍🎓" : "👨‍👩‍👧"}
                <span className="user-name">{username}</span>
              </span>
            </div>
          )}

          {!userRole ? (
            <>
              <button type="button" className="nav-cta nav-signup" onClick={() => navigate("/signup")}>Sign Up</button>
              <button
                type="button"
                className="nav-cta nav-login"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="nav-cta nav-change-role"
                onClick={() => navigate("/role-selection")}
                title="Change Role"
              >
                Change Role
              </button>
              <button
                type="button"
                className="nav-cta nav-dashboard"
                onClick={() => navigate("/parents-dashboard")}
              >
                Dashboard
              </button>
              <button
                type="button"
                className="nav-cta nav-logout"
                onClick={handleLogout}
                title="Logout"
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
