<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const nav = useNavigate();
  return (
    <nav className="w-full bg-transparent p-4  bg-gradient-to-r from-orange-400 via-pink-400 to-yellow-400 shadow-lg mb-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div
          onClick={() => nav("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="bg-white/60 p-2 rounded-full">🐱</div>
          <h1 className="text-white text-2xl font-bold">WriteSense</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => nav("/tutorials")}
            className="text font-semibold text-shite px-4 py-2 rounded-full hover:bg-white/20 transition"
          >
            Tutorials
          </button>
          <button
            onClick={() => alert("Quiz page coming soon!")}
            className="bg-kidpink text-white px-4 py-2 rounded-full font-bold shadow"
          >
            Start Quiz
=======
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("latestEyeDetection");
    navigate("/role-selection");
  };

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

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "10px" }}>
            <span style={{ color: "#333", fontWeight: "600", fontSize: "0.9rem" }}>
              {userRole === "child" ? "👧 Child Mode" : "👨‍👩‍👧‍👦 Parent Mode"}
            </span>
          </div>

          <button type="button" className="nav-cta">Sign Up</button>
          <button 
            type="button" 
            className="nav-cta" 
            style={{ marginLeft: "10px", backgroundColor: "#667eea" }}
            onClick={() => navigate("/parents-dashboard")}
          >
            Parents Dashboard
          </button>
          <button 
            type="button" 
            className="nav-cta" 
            style={{ marginLeft: "10px", backgroundColor: "#ef4444" }}
            onClick={handleLogout}
          >
            Change Role
>>>>>>> 97e7c7983b83ca8a54621649c1c756d6b5309fe1
          </button>
        </div>
      </div>
    </nav>
  );
}
