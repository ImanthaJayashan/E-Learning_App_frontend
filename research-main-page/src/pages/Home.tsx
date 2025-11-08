import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  const handleClick = (name: string) => {
    // Temporary action: replace with navigation or modal later
    // eslint-disable-next-line no-alert
    alert(`${name} clicked`);
  };

  const buttonBase: React.CSSProperties = {
    padding: "1rem 1.25rem",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    textAlign: "left",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  };

  return (
    <div>
      <Navbar />
      <HeroSection />

      <section style={{ padding: "2rem", textAlign: "center" }}>
        <h2>About the Project</h2>
        <p>
          This project focuses on detecting eye issues like lazy eye and crossed eyes in preschool children
          using IT-based methods integrated into an e-learning platform.
        </p>
      </section>

      <section style={{ padding: "2rem", maxWidth: 980, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Select a tool</h2>

        <div
          role="group"
          aria-label="Diagnostic tools"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          <button
            type="button"
            aria-label="Eye Problem Detector"
            onClick={() => handleClick("Eye Problem Detector")}
            style={buttonBase}
          >
            <strong>Eye Problem Detector</strong>
            <div style={{ marginTop: 6, fontSize: 13, color: "#555" }}>Detect lazy eye and crossed eyes.</div>
          </button>

          <button
            type="button"
            aria-label="Hearing Problems"
            onClick={() => handleClick("Hearing Problems")}
            style={buttonBase}
          >
            <strong>Hearing Problems</strong>
            <div style={{ marginTop: 6, fontSize: 13, color: "#555" }}>Screen for hearing-related issues.</div>
          </button>

          <button
            type="button"
            aria-label="Dyslexia Reading and Speech Analysis"
            onClick={() => handleClick("Dyslexia: Reading & Speech Analysis")}
            style={buttonBase}
          >
            <strong>Dyslexia — Reading & Speech</strong>
            <div style={{ marginTop: 6, fontSize: 13, color: "#555" }}>Reading and speech analysis for dyslexia.</div>
          </button>

          <button
            type="button"
            aria-label="Dyslexia Writing Difficulties"
            onClick={() => handleClick("Dyslexia: Writing Difficulties")}
            style={buttonBase}
          >
            <strong>Dyslexia — Writing Difficulties</strong>
            <div style={{ marginTop: 6, fontSize: 13, color: "#555" }}>Assess writing-related challenges.</div>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
