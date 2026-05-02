import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const modules = [
    {
      title: "Eye Problem Detector",
      description: "Detect lazy eye and crossed eyes with AI-powered vision analysis.",
      emoji: "👁️",
      color: "#7C3AED",
      route: "/eye-problem-detector",
      needsLoader: true,
    },
    {
      title: "Hearing Problems",
      description: "Learn animal sounds and play the interactive audio recognition game.",
      emoji: "🎵",
      color: "#009688",
      route: "/learn",
      needsLoader: false,
    },
    {
      title: "Voice Learn (ABC)",
      description: "Learn the alphabet using speech recognition technology.",
      emoji: "🦊",
      color: "#E53935",
      route: "/voice-learn",
      needsLoader: false,
    },
    {
      title: "Write Sense",
      description: "Reading and speech analysis for dyslexia detection.",
      emoji: "✍️",
      color: "#1E3A8A",
      route: "/write-sense/landing-page",
      needsLoader: false,
    },
    {
      title: "Vision Therapy",
      description: "Fun shape-tracing games to improve eye coordination.",
      emoji: "🔵",
      color: "#228B22",
      route: "/vision-therapy",
      needsLoader: false,
    },
    {
      title: "Mini Games",
      description: "Shape Ninja, Snake Game, AmbloCar and more fun activities.",
      emoji: "🎮",
      color: "#8B4513",
      route: "/games",
      needsLoader: false,
    },
  ];

  const features = [
    { icon: "🔒", title: "Safe & Secure", description: "End-to-end encryption and COPPA-compliant data handling." },
    { icon: "🎮", title: "Interactive Fun", description: "Engaging games and activities that make learning exciting." },
    { icon: "👁️", title: "Health Tracking", description: "Monitor eye health and detect early warning signs." },
    { icon: "🏆", title: "Reward System", description: "Earn stars and badges to motivate continued learning." },
  ];

  const handleModuleClick = (route: string, needsLoader: boolean) => {
    if (needsLoader) {
      setIsLoading(true);
      setTimeout(() => navigate(route), 1500);
    } else {
      navigate(route);
    }
  };

  return (
    <div>
      {isLoading && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.8)", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", zIndex: 9999,
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "2rem", animation: "spin 1s linear infinite" }}>🔍</div>
          <h2 style={{ color: "white", fontSize: "2rem", fontWeight: "bold", margin: "0 0 1rem 0" }}>
            Detecting Eye Health...
          </h2>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <Navbar />
      <HeroSection />

      {/* Modules Section */}
      <section className="games-section">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="section-badge">
            <span className="badge-icon">🎓</span>
            <span>Learning Modules</span>
          </div>
          <h2 className="section-title">Choose Your <span className="highlight">Activity</span></h2>
          <p className="section-subtitle">Explore our range of interactive tools designed for young learners.</p>
        </div>
        <div className="games-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {modules.map((mod, i) => (
            <div key={i} className="game-card" style={{ cursor: "pointer" }} onClick={() => handleModuleClick(mod.route, mod.needsLoader)}>
              <div className="game-image" style={{ fontSize: "3.5rem", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 100, background: `${mod.color}22`, borderRadius: 12 }}>
                {mod.emoji}
              </div>
              <h3 className="game-title">{mod.title}</h3>
              <p style={{ fontSize: "0.82rem", color: "#666", margin: "0 0 0.75rem", lineHeight: 1.4 }}>{mod.description}</p>
              <button
                className="game-play-btn"
                style={{ backgroundColor: mod.color }}
                onClick={(e) => { e.stopPropagation(); handleModuleClick(mod.route, mod.needsLoader); }}
              >
                OPEN
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="section-badge">
          <span className="badge-icon">⭐</span>
          <span>Why Choose Us</span>
        </div>
        <h2 className="section-title">Made For <span className="highlight">Little Learners</span></h2>
        <p className="section-subtitle">Our platform is designed with your child's safety, health, and happiness in mind.</p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-description">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
