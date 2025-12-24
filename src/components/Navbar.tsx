import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-inner" style={{ backgroundColor: "#E4E5E5", color: "white" }}>
        <Link className="nav-brand" to="/">
          <img className="nav-logo" src="/Gemini_Generated_Image_5rph3y5rph3y5rph.png" alt="Little Learners Hub logo" />
          <div className="brand-text">
            <span className="brand-main">Little Learners</span>
            <span className="brand-accent">Hub</span>
          </div>
        </Link>

        <div className="nav-right">
          <ul className="nav-links">
            <li><Link className="nav-link" to="/">Home</Link></li>
            <li><Link className="nav-link" to="#">Lessons</Link></li>
            <li><Link className="nav-link" to="#">Resource</Link></li>
            <li><Link className="nav-link" to="#">AboutUs</Link></li>
          </ul>

          <button type="button" className="nav-cta">Sign Up</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
