import React, { useEffect, useRef, useState } from "react";

type ShapeType = "circle" | "square" | "triangle" | "star";

type Shape = {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  gravity: number;
  type: ShapeType;
  color: string;
  alive: boolean;
};

type SliceTrail = {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  radius: number;
};

const COLORS = ["#ff7675", "#74b9ff", "#55efc4", "#ffeaa7"];

const SHAPE_ICONS: { [key in ShapeType]: string } = {
  circle: "⭕",
  square: "🟦",
  triangle: "🔺",
  star: "⭐",
};

const SHAPE_NAMES: { [key in ShapeType]: string } = {
  circle: "CIRCLE",
  square: "SQUARE",
  triangle: "TRIANGLE",
  star: "STAR",
};

const ShapeNinja: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapes = useRef<Shape[]>([]);
  const sliceTrails = useRef<SliceTrail[]>([]);
  const mouse = useRef({ x: 0, y: 0, slicing: false });
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);

  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [targetShape, setTargetShape] = useState<ShapeType>("circle");

  /* ---------- FULL SCREEN ---------- */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Load background image
    const img = new Image();
    img.src = "/ninja.svg";
    img.onload = () => {
      backgroundImageRef.current = img;
    };

    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ---------- SPAWN SHAPES (SLOW) ---------- */
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      // Count alive shapes
      const aliveCount = shapes.current.filter(s => s.alive).length;
      
      // Only spawn if less than 3 shapes on screen
      if (aliveCount < 3) {
        // Randomly spawn 1, 2, or 3 shapes at once (but not exceeding max of 3 total)
        const maxToSpawn = 3 - aliveCount; // remaining slots
        const shapeCount = Math.min(
          Math.random() < 0.5 ? 1 : Math.random() < 0.7 ? 2 : 3,
          maxToSpawn
        );
        
        for (let i = 0; i < shapeCount; i++) {
          spawnShape();
        }
      }
    }, 1400); // slower spawn

    return () => clearInterval(spawnInterval);
  }, []);

  /* ---------- GAME LOOP ---------- */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background image
      if (backgroundImageRef.current) {
        ctx.globalAlpha = 0.15; // semi-transparent
        ctx.drawImage(backgroundImageRef.current, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0; // reset
      }

      shapes.current.forEach((s) => {
        if (!s.alive) return;

        // Slow physics
        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.gravity;

        // Keep shapes within screen bounds
        const padding = s.size + 20;
        
        // Bounce off left/right edges
        if (s.x - padding < 0) {
          s.x = padding;
          s.vx = Math.abs(s.vx); // bounce right
        }
        if (s.x + padding > canvas.width) {
          s.x = canvas.width - padding;
          s.vx = -Math.abs(s.vx); // bounce left
        }

        // Bounce off top edge
        if (s.y - padding < 0) {
          s.y = padding;
          s.vy = Math.abs(s.vy); // bounce down
        }

        // Bottom edge - remove shape when it exits
        if (s.y > canvas.height + 120) {
          s.alive = false;
        }

        drawShape(ctx, s);

        // Slice detection
        if (
          mouse.current.slicing &&
          Math.hypot(mouse.current.x - s.x, mouse.current.y - s.y) < s.size
        ) {
          // Only count if it's the target shape
          if (s.type === targetShape) {
            s.alive = false;
            setScore((prev) => prev + 1);
          }
        }
      });

      // Update and draw slice trails
      sliceTrails.current.forEach((trail) => {
        trail.age += 1;
      });

      sliceTrails.current = sliceTrails.current.filter(
        (trail) => trail.age < trail.maxAge
      );

      sliceTrails.current.forEach((trail) => {
        const alpha = 1 - trail.age / trail.maxAge; // fade out
        ctx.fillStyle = `rgba(255, 200, 0, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, trail.radius * (1 - trail.age / trail.maxAge), 0, Math.PI * 2);
        ctx.fill();

        // Draw glow
        ctx.strokeStyle = `rgba(255, 150, 0, ${alpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, trail.radius * (1.5 - trail.age / trail.maxAge), 0, Math.PI * 2);
        ctx.stroke();
      });

      // Remove shapes when gone
      shapes.current = shapes.current.filter(
        (s) => s.y < canvas.height + 120 && s.alive
      );

      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }, []);

  /* ---------- SPAWN FUNCTION ---------- */
  const spawnShape = () => {
    const canvas = canvasRef.current!;
    const types: ShapeType[] = ["circle", "square", "triangle", "star"];

    // Random angle and speed for free movement
    const angle = Math.random() * Math.PI * 2; // 0 to 360 degrees
    const speed = 1.5 + Math.random() * 1.5; // slower speed (1.5 to 3)

    shapes.current.push({
      x: Math.random() * canvas.width,
      y: canvas.height + 40,
      size: 100,
      vx: Math.cos(angle) * speed, // free horizontal movement
      vy: Math.sin(angle) * speed, // free vertical movement
      gravity: 0.001,               // very very low gravity to reach much higher
      type: types[Math.floor(Math.random() * types.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alive: true,
    });
  };

  /* ---------- DRAW SHAPES ---------- */
  const drawShape = (ctx: CanvasRenderingContext2D, s: Shape) => {
    ctx.fillStyle = s.color;
    ctx.beginPath();

    switch (s.type) {
      case "circle":
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        break;

      case "square":
        ctx.rect(s.x - s.size, s.y - s.size, s.size * 2, s.size * 2);
        break;

      case "triangle":
        ctx.moveTo(s.x, s.y - s.size);
        ctx.lineTo(s.x - s.size, s.y + s.size);
        ctx.lineTo(s.x + s.size, s.y + s.size);
        ctx.closePath();
        break;

      case "star":
        drawStar(ctx, s.x, s.y, 5, s.size, s.size / 2);
        break;
    }

    ctx.fill();
  };

  const drawStar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    points: number,
    outer: number,
    inner: number
  ) => {
    let angle = Math.PI / points;
    ctx.moveTo(x, y - outer);

    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      ctx.lineTo(x + Math.sin(i * angle) * r, y - Math.cos(i * angle) * r);
    }
    ctx.closePath();
  };

  /* ---------- INPUT ---------- */
  const movePointer = (x: number, y: number) => {
    mouse.current.x = x;
    mouse.current.y = y;

    // Create slice trail when slicing
    if (mouse.current.slicing) {
      sliceTrails.current.push({
        x: x,
        y: y,
        age: 0,
        maxAge: 100,
        radius: 20,
      });
    }
  };

  return (
    <>
      {/* START SCREEN / RULES */}
      {!gameStarted && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "3.5rem",
              marginBottom: "2rem",
              textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
              fontFamily: "'Fredoka One', 'Comic Sans MS', sans-serif",
            }}
          >
            🥷 Ninja Slicer Rules
          </h1>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "30px",
              padding: "3rem 2rem",
              maxWidth: "600px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "2rem",
                fontFamily: "'Fredoka One', 'Comic Sans MS', sans-serif",
              }}
            >
              👇 Click and Slice ONLY the {SHAPE_ICONS[targetShape]} {SHAPE_NAMES[targetShape]} shapes!
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              {["circle", "square", "triangle", "star"].map((shape) => (
                <div
                  key={shape}
                  style={{
                    padding: "1rem",
                    borderRadius: "15px",
                    background: targetShape === shape ? "#FFD700" : "#f0f0f0",
                    border: targetShape === shape ? "4px solid #FFA500" : "2px solid #ccc",
                    fontSize: "3rem",
                    opacity: targetShape === shape ? 1 : 0.5,
                    transform: targetShape === shape ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {SHAPE_ICONS[shape as ShapeType]}
                </div>
              ))}
            </div>

            <div
              style={{
                background: "#f5f5f5",
                borderRadius: "15px",
                padding: "2rem",
                marginBottom: "2rem",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#555",
                  marginBottom: "1rem",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                📋 <strong>How to Play:</strong>
              </p>
              <ul
                style={{
                  fontSize: "1rem",
                  color: "#666",
                  marginLeft: "2rem",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                <li>✨ Shapes will float across the screen</li>
                <li>🎯 Click and drag to slice shapes</li>
                <li>⭐ Only slice the {SHAPE_NAMES[targetShape]} - other shapes don't count!</li>
                <li>🧠 Stay focused and be quick!</li>
                <li>🎉 Get more points for correct shapes</li>
              </ul>
            </div>

            <button
              onClick={() => setGameStarted(true)}
              style={{
                padding: "1.2rem 3rem",
                fontSize: "1.5rem",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                color: "#333",
                border: "none",
                borderRadius: "30px",
                cursor: "pointer",
                fontFamily: "'Fredoka One', 'Comic Sans MS', sans-serif",
                boxShadow: "0 8px 20px rgba(255, 165, 0, 0.4)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              🚀 START GAME
            </button>
          </div>
        </div>
      )}

      {/* SCORE */}
      {gameStarted && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            color: "#000",
            fontSize: 22,
            fontWeight: "bold",
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.9)",
            padding: "1rem 1.5rem",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          Score: {score}
        </div>
      )}

      {/* TARGET INDICATOR */}
      {gameStarted && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: "rgba(255, 255, 255, 0.95)",
            padding: "1rem 2rem",
            borderRadius: "20px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            textAlign: "center",
            zIndex: 10,
            border: "3px solid #FFD700",
          }}
        >
          <p
            style={{
              fontSize: "0.9rem",
              color: "#666",
              margin: "0 0 0.5rem 0",
              fontWeight: "bold",
            }}
          >
            SLICE THIS:
          </p>
          <p
            style={{
              fontSize: "3rem",
              margin: "0",
            }}
          >
            {SHAPE_ICONS[targetShape]}
          </p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{ background: "#ffffff", display: gameStarted ? "block" : "none" }}
        onMouseDown={() => (mouse.current.slicing = true)}
        onMouseUp={() => (mouse.current.slicing = false)}
        onMouseMove={(e) => movePointer(e.clientX, e.clientY)}
        onTouchStart={() => (mouse.current.slicing = true)}
        onTouchEnd={() => (mouse.current.slicing = false)}
        onTouchMove={(e) =>
          movePointer(e.touches[0].clientX, e.touches[0].clientY)
        }
      />
    </>
  );
};

export default ShapeNinja;
