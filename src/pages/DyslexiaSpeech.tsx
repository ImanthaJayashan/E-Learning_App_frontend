import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Recorder from "../components/Recorder";

const DyslexiaSpeech: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#3366cc", fontSize: 14 }}>
            ← Back to tools
          </Link>
        </div>

        <h1 style={{ marginBottom: "0.5rem" }}>Dyslexia — Reading & Speech</h1>
        <p style={{ marginBottom: "1.5rem", color: "#444" }}>
          Record the child reading a word or sentence. The gateway forwards the audio to the analysis service and returns results.
        </p>

        <Recorder />
      </main>
      <Footer />
    </div>
  );
};

export default DyslexiaSpeech;
