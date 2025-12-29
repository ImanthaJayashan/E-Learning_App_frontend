import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const CircleShape: React.FC = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [show3DCircle, setShow3DCircle] = useState(false);

  return (
    <div className="eye-page">
      <Navbar />
      <main style={{ 
        padding: "2rem 1rem", 
        minHeight: "100vh",
        backgroundImage: "url('/27189026_xp86_56i7_220412.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        willChange: "transform",
        position: "relative",
        overflow: "hidden"
      }}>
        <style>{`
          @keyframes driftBackground {
            0%, 100% { transform: scale(1) translateY(0px); }
            50% { transform: scale(1.05) translateY(-20px); }
          }
          @keyframes floatBackground {
            0%, 100% { background-position: center center; }
            50% { background-position: center calc(50% - 15px); }
          }
          main::before {
            content: "";
            position: absolute;
            inset: 0;
            background-image: inherit;
            background-size: inherit;
            background-position: inherit;
            background-repeat: inherit;
            animation: driftBackground 15s ease-in-out infinite;
            z-index: 0;
            opacity: 0.95;
          }
          main > * {
            position: relative;
            z-index: 1;
          }
          @keyframes wiggleBackBtn {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-3px) rotate(-2deg); }
            50% { transform: translateY(1px) rotate(2deg); }
            75% { transform: translateY(-2px) rotate(-1deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.5); }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
        `}</style>

        <section
          style={{
            width: "100%",
            maxWidth: "100%",
            margin: "0",
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(5px)",
            borderRadius: "18px",
            padding: "2.5rem 2rem",
            boxShadow: "0 14px 32px rgba(0,0,0,0.12)",
            border: "1px solid rgba(238, 242, 247, 0.6)",
            position: "relative"
          }}
        >
          {/* Back Button - Top Left Corner */}
          <motion.button
            onClick={() => navigate("/eye-problem-detector")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ scale: 1 }}
            whileHover={{ 
              scale: 1.08,
              y: -5,
              boxShadow: "0 20px 40px rgba(255, 159, 28, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 10 
            }}
            style={{
              position: "absolute",
              top: "1.5rem",
              left: "1.5rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.7rem",
              background: isHovered 
                ? "linear-gradient(135deg, #ff9f1c, #ffd166, #ff9f1c)" 
                : "linear-gradient(135deg, #ffd166, #ff9f1c)",
              backgroundSize: "200% auto",
              color: "#2d3142",
              border: "none",
              borderRadius: "999px",
              padding: "0.85rem 1.8rem",
              fontWeight: 800,
              fontSize: "1.05rem",
              letterSpacing: "0.03em",
              boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
              cursor: "pointer",
              overflow: "hidden",
              zIndex: 10
            }}
          >
            {/* Animated pulse rings on hover */}
            {isHovered && (
              <>
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "999px",
                    border: "3px solid #ff9f1c",
                    pointerEvents: "none",
                  }}
                />
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1, delay: 0.3, repeat: Infinity }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "999px",
                    border: "3px solid #ffd166",
                    pointerEvents: "none",
                  }}
                />
              </>
            )}
            
            {/* Shimmer effect */}
            <motion.div
              animate={isHovered ? { x: ["0%", "200%"] } : {}}
              transition={{ duration: 0.8, repeat: isHovered ? Infinity : 0 }}
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "50%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                pointerEvents: "none",
              }}
            />

            <motion.span 
              animate={isHovered ? { x: [-3, 0, -3] } : {}}
              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
              style={{ fontSize: "1.1rem", position: "relative", zIndex: 1 }}
            >
              ⬅️
            </motion.span>
            <span style={{ position: "relative", zIndex: 1 }}>BACK</span>
          </motion.button>

          {/* Top center GIF */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              textAlign: "center",
              marginBottom: "2rem"
            }}
          >
            <img 
              src="/Circle-12-29-2025.gif" 
              alt="Circle Animation" 
              style={{
                maxWidth: "500px",
                width: "100%",
                height: "auto",
                margin: "0 auto",
                display: "block",
                borderRadius: "16px",
                boxShadow: "0 0px 0px rgba(0,0,0,0.15)"
              }}
            />
          </motion.div>

          {/* YouTube Video */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{
              marginBottom: "2rem"
            }}
          >
            <div
              style={{
                position: "relative",
                paddingTop: "25%",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                width: "100%"
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/jlzX8jt0Now?start=16&end=62"
                title="Circle Learning Video"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "0"
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>

          <h1 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Circle</h1>
          <p style={{ marginTop: 0, color: "#4b5563", lineHeight: 1.6, marginBottom: "2rem" }}>
            Welcome to the Circle page. Learn about circles in a fun and interactive way!
          </p>

          {/* 3D Circle Test Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", marginBottom: "2rem" }}
          >
            <motion.button
              onClick={() => setShow3DCircle(!show3DCircle)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "1rem 2.5rem",
                fontSize: "1.3rem",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(255, 107, 107, 0.3)",
              }}
            >
              {show3DCircle ? "Hide 3D Circle" : "🎯 Test 3D Circle"}
            </motion.button>
          </motion.div>

          {/* 3D Interactive Circle */}
          {show3DCircle && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6 }}
              style={{
                marginBottom: "2rem",
                background: "linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)",
                backgroundImage: "url('/20495671_v7yw_i7mn_210818.svg'), linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
                borderRadius: "16px",
                padding: "2rem",
                boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <h3 style={{ color: "white", textAlign: "center", marginTop: 0, marginBottom: "2rem", fontSize: "1.8rem", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
                🌐 Interactive 3D Objects - Drag to Rotate!
              </h3>
              
              {/* Sketchfab 3D Model on Left */}
              <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 auto", width: "100%", maxWidth: "500px" }}>
                  <div className="sketchfab-embed-wrapper" style={{ height: "450px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 0px 20px rgba(0,0,0,0.3)", border: "none" }}>
                    <iframe
                      title="Dribbble Basketball"
                      frameBorder="0"
                      allowFullScreen
                      style={{ width: "100%", height: "100%", border: "none" }}
                      src="https://sketchfab.com/models/c9117358e14a4b30914a8a8b54ebc11a/embed?autostart=1&preload=1&transparent=1"
                    />
                  </div>
                </div>
                
                {/* Right side content */}
                <div style={{ flex: "1", minWidth: "300px" }}>
                </div>
              </div>
            </motion.div>
          )}

          {/* Learning Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
            style={{ marginBottom: "2rem" }}
          >
            <h2 style={{ color: "#FF6B6B", fontSize: "1.8rem", marginBottom: "1rem" }}>🔵 What is a Circle?</h2>
            <p style={{ color: "#4b5563", lineHeight: 1.8, fontSize: "1.1rem" }}>
              A circle is a round shape with no corners or edges. Every point on a circle is the same distance from the center!
            </p>
          </motion.div>

          {/* Fun Facts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: false, amount: 0.3 }}
            style={{ 
              background: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "2rem"
            }}
          >
            <h3 style={{ color: "#2d3436", marginTop: 0, fontSize: "1.5rem" }}>✨ Fun Facts About Circles!</h3>
            <ul style={{ color: "#2d3436", lineHeight: 2, fontSize: "1.05rem" }}>
              <li>🌕 The moon looks like a circle!</li>
              <li>🍕 Pizza is usually circular</li>
              <li>⚽ Balls are circles in every direction</li>
              <li>🎯 Target boards have many circles</li>
              <li>🌞 The sun appears as a circle in the sky</li>
            </ul>
          </motion.div>

          {/* Interactive Activities */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: false, amount: 0.3 }}
            style={{ marginBottom: "2rem" }}
          >
            <h3 style={{ color: "#FF6B6B", fontSize: "1.6rem", marginBottom: "1rem" }}>🎨 Activities to Try</h3>
            <div style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem"
            }}>
              {[
                { emoji: "✏️", title: "Draw Circles", desc: "Practice drawing perfect circles" },
                { emoji: "🔍", title: "Find Circles", desc: "Look for circles around you" },
                { emoji: "🎭", title: "Circle Art", desc: "Create art using circles" },
                { emoji: "🧩", title: "Circle Puzzles", desc: "Solve circle-based puzzles" }
              ].map((activity, index) => (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  style={{
                    background: "#fff",
                    border: "2px solid #FF6B6B",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{activity.emoji}</div>
                  <h4 style={{ color: "#2d3142", margin: "0.5rem 0", fontSize: "1.1rem" }}>{activity.title}</h4>
                  <p style={{ color: "#6c757d", margin: 0, fontSize: "0.9rem" }}>{activity.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Circle Properties */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
            style={{
              background: "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "2rem",
              color: "white"
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: "1.5rem" }}>📐 Circle Parts</h3>
            <div style={{ lineHeight: 2, fontSize: "1.05rem" }}>
              <p><strong>Center:</strong> The middle point of the circle</p>
              <p><strong>Radius:</strong> Distance from center to edge</p>
              <p><strong>Diameter:</strong> Distance across through center</p>
              <p><strong>Circumference:</strong> Distance around the circle</p>
            </div>
          </motion.div>

          {/* Encouragement Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            style={{
              textAlign: "center",
              padding: "2rem",
              background: "linear-gradient(135deg, #fdcb6e 0%, #ffeaa7 100%)",
              borderRadius: "12px",
              marginTop: "2rem"
            }}
          >
            <h3 style={{ fontSize: "2rem", margin: 0, color: "#2d3142" }}>🌟 Great Job Learning About Circles! 🌟</h3>
            <p style={{ fontSize: "1.2rem", color: "#2d3142", marginTop: "1rem" }}>
              Keep exploring and have fun with circles!
            </p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CircleShape;
