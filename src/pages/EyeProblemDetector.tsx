import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const EyeProblemDetector: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#3366cc", fontSize: 14 }}>
            ← Back to tools
          </Link>
        </div>

        <h1 style={{ marginBottom: "0.5rem" }}>Eye Problem Detector</h1>
        <p style={{ marginBottom: "1.5rem", color: "#444" }}>
          Detect lazy eye and crossed eyes. This page is ready for your flow—add uploads, instructions, and results
          whenever you are ready.
        </p>

        <section
          style={{
            padding: "1.5rem",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#fafafa",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Next steps</h2>
          <ul style={{ lineHeight: 1.6, color: "#333" }}>
            <li>Explain how to capture or upload an eye image.</li>
            <li>Add a form or uploader for the child&apos;s photo or live feed.</li>
            <li>Run your detection logic or API call and show the result.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EyeProblemDetector;
