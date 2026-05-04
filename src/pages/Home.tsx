import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const games = [
    { title: "VOICE LEARN", image: "foximgnb.png", color: "#009688", route: "/voice-learn", needsLoader: false },
    { title: "ANIMAL SOUNDS", image: "numbers.jpg", color: "#8B4513", route: "/learn", needsLoader: false },
    { title: "MINI GAMES", image: "colors.png", color: "#228B22", route: "/games", needsLoader: false },
    { title: "LETTERS", image: "letters.png", color: "#1E3A8A", route: "/write-sense/landing-page", needsLoader: false },
    { title: "SHAPES", image: "shapes.png", color: "#7C3AED", route: "/eye-problem-detector", needsLoader: true },
  ];

  const features = [
    { icon: "🔒", title: "Safe & Secure", description: "End-to-end encryption and COPPA-compliant data handling." },
    { icon: "🎮", title: "Interactive Fun", description: "Engaging games and activities that make learning exciting." },
    { icon: "👁️", title: "Health Tracking", description: "Monitor eye health and detect early warning signs." },
    { icon: "🏆", title: "Reward System", description: "Earn stars and badges to motivate continued learning." },
  ];

  return (
    <div>
      {/* Inline Styles for Layout Fixes */}
      <style>{`
        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          padding: 2rem;
        }

        .game-card {
          display: flex;
          flex-direction: column;
          height: 100%; /* Ensures cards in a row have equal height */
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .game-card:hover {
          transform: translateY(-5px);
        }

        .game-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .game-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .game-title {
          padding: 1.5rem 1rem;
          margin: 0;
          text-align: center;
          font-family: 'Fredoka One', cursive;
          flex-grow: 1; /* Pushes the button to the bottom */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .game-play-btn {
          width: 100%;
          padding: 1rem;
          border: none;
          color: white;
          font-weight: bold;
          cursor: pointer;
          font-size: 1.2rem;
          margin-top: auto; /* Secondary safety for bottom alignment */
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {isLoading && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999, animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ fontSize: "4rem", marginBottom: "2rem", animation: "spin 1s linear infinite" }}>🔍</div>
          <h2 style={{ color: "white", fontSize: "2rem", fontWeight: "bold", margin: "0 0 1rem 0", fontFamily: "'Fredoka One', 'Comic Sans MS', sans-serif" }}>
            Detecting Eye Health...
          </h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#7C3AED", animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
        </div>
      )}

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
                onClick={() => {
                  if (game.needsLoader) {
                    setIsLoading(true);
                    setTimeout(() => navigate(game.route), 1500);
                  } else {
                    navigate(game.route);
                  }
                }}
              >
                PLAY
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="section-badge" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span className="badge-icon">⭐</span>
          <span>Why Choose Us</span>
        </div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Made For <span className="highlight">Little Learners</span>
        </h2>
        <p className="section-subtitle" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
          Our platform is designed with your child's safety, health, and happiness in mind.
        </p>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', padding: '0 2rem' }}>
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ textAlign: 'center', padding: '1.5rem', background: '#f9f9f9', borderRadius: '15px' }}>
              <div className="feature-icon" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
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