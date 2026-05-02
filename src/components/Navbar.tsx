import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("latestEyeDetection");
    navigate("/role-selection");
  };

  return (
    <nav className="bg-gray-100 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              className="h-8 w-8"
              src="/Gemini_Generated_Image_5rph3y5rph3y5rph.png"
              alt="Little Learners Hub logo"
            />
            <span className="ml-2 font-bold text-xl text-gray-800">
              Little Learners <span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link to="/learn" className="text-gray-700 hover:text-gray-900">Animal Sounds</Link>
            <Link to="/voice-learn" className="text-gray-700 hover:text-gray-900">Voice Learn</Link>
            <Link to="/write-sense/landing-page" className="text-gray-700 hover:text-gray-900">Write Sense</Link>
            <Link to="/games" className="text-gray-700 hover:text-gray-900">Games</Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-semibold text-sm hidden sm:block">
              {userRole === "child" ? "👧 Child Mode" : "👨‍👩‍👧‍👦 Parent Mode"}
            </span>
            <button
              onClick={() => navigate("/parents-dashboard")}
              className="px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm hidden sm:block"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Change Role
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
