import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const games = [
    {
      title: "NUMBERS",
      image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=300&h=200&fit=crop",
      color: "#8B4513",
      route: "/games/numbers"
    },
    {
      title: "COLORS",
      image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=300&h=200&fit=crop",
      color: "#228B22",
      route: "/games/colors"
    },
    {
      title: "LETTERS",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop",
      color: "#1E3A8A",
      route: "/games/letters"
    },
    {
      title: "SHAPES",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=200&fit=crop",
      color: "#7C3AED",
      route: "/vision-therapy"
    }
  ];

  const features = [
    {
      icon: "🔒",
      title: "Safe & Secure",
      description: "End-to-end encryption and COPPA-compliant data handling."
    },
    {
      icon: "🎮",
      title: "Interactive Fun",
      description: "Engaging games and activities that make learning exciting."
    },
    {
      icon: "👁️",
      title: "Health Tracking",
      description: "Monitor eye health and detect early warning signs."
    },
    {
      icon: "🏆",
      title: "Reward System",
      description: "Earn stars and badges to motivate continued learning."
    }
  ];

  return (
    <div>
      <Navbar />
      <HeroSection />

      {/* Games Section */}
      <section className="games-section">
        <div className="games-grid">
          {games.map((game, index) => (
            <div key={index} className="game-card">
              <div className="game-image">
                <img src={game.image} alt={game.title} />
              </div>
              <h3 className="game-title">{game.title}</h3>
              <button 
                className="game-play-btn"
                style={{ backgroundColor: game.color }}
                onClick={() => navigate(game.route)}
              >
                PLAY
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
        <h2 className="section-title">
          Made For <span className="highlight">Little Learners</span>
        </h2>
        <p className="section-subtitle">
          Our platform is designed with your child's safety, health, and happiness in mind.
        </p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
