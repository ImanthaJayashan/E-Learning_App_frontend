import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TriangleShape: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="eye-page">
      <Navbar />
      <main style={{ padding: "2rem 1rem", minHeight: "100vh" }}>
        <style>{`
          @keyframes wiggleBackBtn {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-3px) rotate(-2deg); }
            50% { transform: translateY(1px) rotate(2deg); }
            75% { transform: translateY(-2px) rotate(-1deg); }
          }
        `}</style>
        <section
          style={{
            width: "100%",
            maxWidth: "100%",
            margin: "0",
            background: "#ffffff",
            borderRadius: "18px",
            padding: "2.5rem 2rem",
            boxShadow: "0 14px 32px rgba(0,0,0,0.12)",
            border: "1px solid #eef2f7",
          }}
        >
          <button
            onClick={() => navigate("/eye-problem-detector")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.7rem",
              background: "linear-gradient(135deg, #ffd166, #ff9f1c)",
              color: "#2d3142",
              border: "none",
              borderRadius: "999px",
              padding: "0.85rem 1.8rem",
              fontWeight: 800,
              fontSize: "1.05rem",
              letterSpacing: "0.03em",
              boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
              cursor: "pointer",
              animation: "wiggleBackBtn 2.2s ease-in-out infinite",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              marginBottom: "1rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.04)";
              e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.22)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 12px 26px rgba(0,0,0,0.18)";
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>⬅️</span>
            <span>BACK</span>
          </button>
          <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Triangle</h1>
          <p style={{ marginTop: 0, color: "#4b5563", lineHeight: 1.6 }}>
            Welcome to the Triangle page. Add your triangle learning content or game
            here.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TriangleShape;
