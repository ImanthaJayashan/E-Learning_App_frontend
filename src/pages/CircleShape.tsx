import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const CircleShape: React.FC = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [show3DCircle, setShow3DCircle] = useState(false);
  
  // Preschool Game State
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameDrawing, setIsGameDrawing] = useState(false);
  const [gameDrawnPoints, setGameDrawnPoints] = useState<{x: number, y: number}[]>([]);
  const [gameFeedback, setGameFeedback] = useState<'none' | 'success' | 'encourage'>('none');
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (larger for preschool kids)
    canvas.width = 750;
    canvas.height = 900;

    drawGameGuide(ctx);
  }, []);

  // Redraw game canvas when feedback changes
  useEffect(() => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGameGuide(ctx);
    redrawGamePath(ctx);
  }, [gameDrawnPoints, gameFeedback]);

  const drawGameGuide = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, 750, 900);
    
    // Draw soft blue circle guide (thick and smooth)
    ctx.beginPath();
    ctx.arc(375, 350, 320, 0, Math.PI * 2);
    ctx.strokeStyle = '#87CEEB'; // Soft sky blue
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw center point (very gentle)
    ctx.beginPath();
    ctx.arc(375, 350, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#B0E0E6';
    ctx.fill();
  };

  const redrawGamePath = (ctx: CanvasRenderingContext2D) => {
    if (gameDrawnPoints.length < 2) return;

    // Draw child's path with bright friendly color
    ctx.beginPath();
    ctx.moveTo(gameDrawnPoints[0].x, gameDrawnPoints[0].y);
    
    for (let i = 1; i < gameDrawnPoints.length; i++) {
      ctx.lineTo(gameDrawnPoints[i].x, gameDrawnPoints[i].y);
    }
    
    ctx.strokeStyle = '#FFA500'; // Bright orange
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  // Game drawing handlers
  const startGameDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsGameDrawing(true);
    setGameFeedback('none');
    setShowSparkles(false);
    
    const canvas = gameCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    setGameDrawnPoints([{x, y}]);
  };

  const continueGameDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isGameDrawing) return;
    e.preventDefault();

    const canvas = gameCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    let x = (clientX - rect.left) * scaleX;
    let y = (clientY - rect.top) * scaleY;

    // Magnetic snap to circle guide (always enabled)
    const centerX = 375;
    const centerY = 350;
    const targetRadius = 320;
    const magnetStrength = 60; // Distance within which magnet activates

    // Calculate distance from center
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If within magnetic range, snap to circle
    if (Math.abs(distance - targetRadius) <= magnetStrength) {
      const angle = Math.atan2(dy, dx);
      x = centerX + Math.cos(angle) * targetRadius;
      y = centerY + Math.sin(angle) * targetRadius;
    }

    setGameDrawnPoints(prev => [...prev, {x, y}]);
  };

  const stopGameDrawing = () => {
    if (!isGameDrawing) return;
    setIsGameDrawing(false);
    
    // Evaluate drawing after a short delay
    setTimeout(() => {
      evaluateDrawing();
    }, 300);
  };

  const evaluateDrawing = () => {
    if (gameDrawnPoints.length < 10) {
      setGameFeedback('encourage');
      return;
    }

    const centerX = 375;
    const centerY = 350;
    const targetRadius = 320;
    const tolerance = 60; // Generous tolerance for preschoolers

    let pointsNearCircle = 0;
    
    gameDrawnPoints.forEach(point => {
      const distance = Math.sqrt(
        Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
      );
      
      if (Math.abs(distance - targetRadius) <= tolerance) {
        pointsNearCircle++;
      }
    });

    const accuracy = pointsNearCircle / gameDrawnPoints.length;

    if (accuracy >= 0.6) { // 60% accuracy is great for preschoolers
      setGameFeedback('success');
      setShowSparkles(true);
      
      // Hide sparkles after animation
      setTimeout(() => {
        setShowSparkles(false);
      }, 2500);
    } else {
      setGameFeedback('encourage');
    }
  };

  const resetGame = () => {
    setGameDrawnPoints([]);
    setGameFeedback('none');
    setShowSparkles(false);
    
    const canvas = gameCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawGameGuide(ctx);
  };

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
              
              {/* 3D Models in a row */}
              <div style={{ display: "flex", gap: "2rem", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                {/* Basketball */}
                <div style={{ flex: "0 0 auto", width: "100%", maxWidth: "450px" }}>
                  <div className="sketchfab-embed-wrapper" style={{ height: "400px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 0px 20px rgba(0,0,0,0.3)", border: "none" }}>
                    <iframe
                      title="Dribbble Basketball"
                      frameBorder="0"
                      allowFullScreen
                      style={{ width: "100%", height: "100%", border: "none" }}
                      src="https://sketchfab.com/models/c9117358e14a4b30914a8a8b54ebc11a/embed?autostart=1&preload=1&transparent=1"
                    />
                  </div>
                </div>

                {/* Clock */}
                <div style={{ flex: "0 0 auto", width: "100%", maxWidth: "450px" }}>
                  <div className="sketchfab-embed-wrapper" style={{ height: "400px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 0px 20px rgba(0,0,0,0.3)", border: "none" }}>
                    <iframe
                      title="Clock"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      style={{ width: "100%", height: "100%", border: "none" }}
                      src="https://sketchfab.com/models/cd0e6a816e6942b587846dd1e866d59e/embed?autostart=1&transparent=1&ui_hint=0"
                    />
                  </div>
                </div>

                {/* Tire */}
                <div style={{ flex: "0 0 auto", width: "100%", maxWidth: "450px" }}>
                  <div className="sketchfab-embed-wrapper" style={{ height: "400px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 0px 20px rgba(0,0,0,0.3)", border: "none" }}>
                    <iframe
                      title="[REMAKE] - Used studded tyre"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      style={{ width: "100%", height: "100%", border: "none" }}
                      src="https://sketchfab.com/models/2e06879d56954f3b894e62b55d2ca7ef/embed?autostart=1&transparent=1"
                    />
                  </div>
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

            {/* Preschool Circle Drawing Game */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: false, amount: 0.2 }}
              style={{
                marginTop: "3rem",
                background: "linear-gradient(135deg, #FFF9E6 0%, #FFE6F0 50%, #E6F3FF 100%)",
                backgroundImage: "url('/9203895_45762.svg')",
                backgroundSize: "auto",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                backgroundBlendMode: "overlay",
                borderRadius: "20px",
                padding: "2.5rem 2rem",
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Decorative elements */}
              <motion.div 
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  fontSize: "3rem",
                  opacity: 0.4,
                  pointerEvents: "none"
                }}
              >⭕</motion.div>
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  fontSize: "2.5rem",
                  opacity: 0.4,
                  pointerEvents: "none"
                }}
              >🎨</motion.div>
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "20px",
                  fontSize: "2rem",
                  opacity: 0.3,
                  pointerEvents: "none"
                }}
              >✨</motion.div>
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [360, 180, 0]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "20px",
                  fontSize: "2rem",
                  opacity: 0.3,
                  pointerEvents: "none"
                }}
              >⭐</motion.div>

              <motion.h3
                animate={{ 
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "2px 2px 4px rgba(255,107,157,0.2)",
                    "2px 2px 8px rgba(255,107,157,0.4)",
                    "2px 2px 4px rgba(255,107,157,0.2)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  color: "#FF6B9D",
                  textAlign: "center",
                  marginTop: 0,
                  marginBottom: "1rem",
                  fontSize: "2rem",
                  fontWeight: "bold"
                }}
              >
                🌟 Circle Drawing Game! 🌟
              </motion.h3>

              <motion.p 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  textAlign: "center",
                  color: "#5A5A5A",
                  fontSize: "1.2rem",
                  marginBottom: "2rem",
                  fontWeight: "500"
                }}
              >
                Draw around the blue circle! 🎯
              </motion.p>

              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem"
              }}>
                {/* Game Canvas Container */}
                <div style={{
                  position: "relative",
                  display: "inline-block",
                  marginTop: "10rem"
                }}>
                  <motion.div
                    animate={isGameDrawing ? {
                      scale: [1, 1.02, 1],
                      boxShadow: [
                        "0 8px 25px rgba(255,182,217,0.4)",
                        "0 12px 35px rgba(255,182,217,0.6)",
                        "0 8px 25px rgba(255,182,217,0.4)"
                      ]
                    } : {
                      scale: 1,
                      boxShadow: "0 8px 25px rgba(255,182,217,0.4)"
                    }}
                    whileHover={{ 
                      scale: 1.01,
                      boxShadow: "0 12px 30px rgba(255,182,217,0.5)"
                    }}
                    transition={{ duration: 0.8, repeat: isGameDrawing ? Infinity : 0 }}
                    style={{
                      border: "6px solid #FFB6D9",
                      borderRadius: "16px",
                      overflow: "hidden",
                      cursor: "crosshair",
                      touchAction: "none",
                      background: "#FAFFF5",
                      position: "relative"
                    }}
                  >
                    <canvas
                      ref={gameCanvasRef}
                      onMouseDown={startGameDrawing}
                      onMouseMove={continueGameDrawing}
                      onMouseUp={stopGameDrawing}
                      onMouseLeave={stopGameDrawing}
                      onTouchStart={startGameDrawing}
                      onTouchMove={continueGameDrawing}
                      onTouchEnd={stopGameDrawing}
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        height: "500px",
                        width: "500px"
                      }}
                    />
                  </motion.div>

                  {/* Sparkle Animation Overlay */}
                  {showSparkles && (
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      pointerEvents: "none",
                      overflow: "hidden",
                      borderRadius: "16px"
                    }}>
                      {/* Outer ring sparkles */}
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={`outer-${i}`}
                          initial={{ 
                            x: 250,
                            y: 250,
                            scale: 0,
                            opacity: 1
                          }}
                          animate={{
                            x: 250 + Math.cos(i * 30 * Math.PI / 180) * 200,
                            y: 250 + Math.sin(i * 30 * Math.PI / 180) * 200,
                            scale: [0, 1.5, 0],
                            opacity: [1, 1, 0]
                          }}
                          transition={{
                            duration: 1.5,
                            ease: "easeOut",
                            delay: i * 0.05
                          }}
                          style={{
                            position: "absolute",
                            fontSize: "2rem"
                          }}
                        >
                          ✨
                        </motion.div>
                      ))}
                      {/* Inner ring sparkles */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={`inner-${i}`}
                          initial={{ 
                            x: 250,
                            y: 250,
                            scale: 0,
                            opacity: 1
                          }}
                          animate={{
                            x: 250 + Math.cos(i * 45 * Math.PI / 180) * 120,
                            y: 250 + Math.sin(i * 45 * Math.PI / 180) * 120,
                            scale: [0, 1.2, 0],
                            opacity: [1, 1, 0],
                            rotate: [0, 360]
                          }}
                          transition={{
                            duration: 1.2,
                            ease: "easeOut",
                            delay: i * 0.08
                          }}
                          style={{
                            position: "absolute",
                            fontSize: "1.5rem"
                          }}
                        >
                          ⭐
                        </motion.div>
                      ))}
                      {/* Center burst */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={`center-${i}`}
                          initial={{ 
                            x: 250,
                            y: 250,
                            scale: 0,
                            opacity: 1
                          }}
                          animate={{
                            x: 250 + Math.cos(i * 60 * Math.PI / 180) * 80,
                            y: 250 + Math.sin(i * 60 * Math.PI / 180) * 80,
                            scale: [0, 1.8, 0],
                            opacity: [1, 1, 0]
                          }}
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                            delay: i * 0.06
                          }}
                          style={{
                            position: "absolute",
                            fontSize: "2.5rem"
                          }}
                        >
                          🎉
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Feedback Messages */}
                {gameFeedback === 'success' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    style={{
                      background: "linear-gradient(135deg, #FFE66D, #FFF9A8)",
                      borderRadius: "16px",
                      padding: "1.5rem 2rem",
                      boxShadow: "0 6px 20px rgba(255,230,109,0.5)",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      border: "3px solid #FFD93D"
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ fontSize: "3rem" }}
                    >
                      ⭐
                    </motion.div>
                    <div>
                      <h4 style={{ margin: 0, color: "#D35400", fontSize: "1.5rem" }}>Amazing Job!</h4>
                      <p style={{ margin: "0.3rem 0 0 0", color: "#7D5A00", fontSize: "1.1rem" }}>You drew a beautiful circle! 🎉</p>
                    </div>
                  </motion.div>
                )}

                {gameFeedback === 'encourage' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    style={{
                      background: "linear-gradient(135deg, #A8E6CF, #C1FFD7)",
                      borderRadius: "16px",
                      padding: "1.5rem 2rem",
                      boxShadow: "0 6px 20px rgba(168,230,207,0.5)",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      border: "3px solid #7FE5A8"
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{ fontSize: "3rem" }}
                    >
                      😊
                    </motion.div>
                    <div>
                      <h4 style={{ margin: 0, color: "#27AE60", fontSize: "1.5rem" }}>Keep Going!</h4>
                      <p style={{ margin: "0.3rem 0 0 0", color: "#229954", fontSize: "1.1rem" }}>Try drawing around the blue circle again! 🌈</p>
                    </div>
                  </motion.div>
                )}

                {/* Control Buttons */}
                <div style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginTop: "1rem"
                }}>
                  <motion.button
                    whileHover={{ 
                      scale: 1.1, 
                      y: -5,
                      boxShadow: "0 8px 25px rgba(255,107,157,0.5)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        "0 6px 20px rgba(255,107,157,0.4)",
                        "0 8px 25px rgba(255,107,157,0.5)",
                        "0 6px 20px rgba(255,107,157,0.4)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    onClick={resetGame}
                    style={{
                      padding: "1rem 2.5rem",
                      background: "linear-gradient(135deg, #FF6B9D, #FF8FB8)",
                      color: "white",
                      border: "none",
                      borderRadius: "50px",
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <motion.span 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ fontSize: "1.5rem" }}
                    >🔄</motion.span>
                    Try Again!
                  </motion.button>
                </div>

                {/* Instructions for parents/teachers */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "12px",
                    padding: "1rem 1.5rem",
                    marginTop: "1rem",
                    maxWidth: "600px",
                    border: "2px dashed #B8A9C9"
                  }}
                >
                  <p style={{
                    margin: 0,
                    color: "#5A5A5A",
                    fontSize: "0.95rem",
                    textAlign: "center",
                    lineHeight: 1.6
                  }}>
                    <strong>👶 For Ages 5-6:</strong> Touch or click and drag your finger/mouse around the blue circle. 
                    Go slow and steady! This helps practice drawing and builds hand strength for writing. 📝
                  </p>
                </motion.div>
              </div>
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
