import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Vehicle = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  type: "car" | "truck";
};

const AmbloCar: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [level, setLevel] = useState(1);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  const size = useRef({ w: window.innerWidth, h: window.innerHeight });

  const man = useRef({
    x: 0,
    y: 0,
    width: 20,
    height: 25,
  });

  // Level configurations
  const getLevelConfig = (lvl: number): Vehicle[] => {
    switch (lvl) {
      case 1:
        return [
          { x: 0, y: 140, width: 70, height: 24, speed: 2, color: "#FF6F6F", type: "car" },
          { x: 400, y: 220, width: 110, height: 30, speed: -2.2, color: "#6FA8FF", type: "truck" },
          { x: 0, y: 300, width: 75, height: 24, speed: 2.4, color: "#7ED957", type: "car" },
          { x: 450, y: 380, width: 120, height: 32, speed: -2, color: "#FFB347", type: "truck" },
        ];
      case 2:
        return [
          { x: 0, y: 140, width: 70, height: 24, speed: 2.8, color: "#FF6F6F", type: "car" },
          { x: 200, y: 140, width: 70, height: 24, speed: 2.8, color: "#FF3F3F", type: "car" },
          { x: 400, y: 200, width: 110, height: 30, speed: -3, color: "#6FA8FF", type: "truck" },
          { x: 0, y: 260, width: 75, height: 24, speed: 3.2, color: "#7ED957", type: "car" },
          { x: 450, y: 340, width: 120, height: 32, speed: -2.8, color: "#FFB347", type: "truck" },
          { x: 100, y: 400, width: 75, height: 24, speed: 3, color: "#9F7ED9", type: "car" },
        ];
      case 3:
        return [
          { x: 0, y: 140, width: 70, height: 24, speed: 3.5, color: "#FF6F6F", type: "car" },
          { x: 150, y: 140, width: 70, height: 24, speed: 3.5, color: "#FF3F3F", type: "car" },
          { x: 300, y: 140, width: 70, height: 24, speed: 3.5, color: "#FF0F0F", type: "car" },
          { x: 400, y: 200, width: 110, height: 30, speed: -3.5, color: "#6FA8FF", type: "truck" },
          { x: 0, y: 260, width: 75, height: 24, speed: 4, color: "#7ED957", type: "car" },
          { x: 200, y: 260, width: 75, height: 24, speed: 4, color: "#5EB937", type: "car" },
          { x: 450, y: 320, width: 120, height: 32, speed: -3.2, color: "#FFB347", type: "truck" },
          { x: 0, y: 380, width: 75, height: 24, speed: 3.8, color: "#9F7ED9", type: "car" },
        ];
      default:
        // Endless mode - super hard
        return [
          { x: 0, y: 140, width: 70, height: 24, speed: 4, color: "#FF6F6F", type: "car" },
          { x: 120, y: 140, width: 70, height: 24, speed: 4, color: "#FF3F3F", type: "car" },
          { x: 240, y: 140, width: 70, height: 24, speed: 4, color: "#FF0F0F", type: "car" },
          { x: 400, y: 200, width: 110, height: 30, speed: -4.5, color: "#6FA8FF", type: "truck" },
          { x: 200, y: 200, width: 110, height: 30, speed: -4.5, color: "#4F88DF", type: "truck" },
          { x: 0, y: 260, width: 75, height: 24, speed: 5, color: "#7ED957", type: "car" },
          { x: 150, y: 260, width: 75, height: 24, speed: 5, color: "#5EB937", type: "car" },
          { x: 450, y: 320, width: 120, height: 32, speed: -4, color: "#FFB347", type: "truck" },
          { x: 0, y: 380, width: 75, height: 24, speed: 4.5, color: "#9F7ED9", type: "car" },
          { x: 180, y: 380, width: 75, height: 24, speed: 4.5, color: "#7F5EB9", type: "car" },
        ];
    }
  };

  const vehicles = useRef<Vehicle[]>(getLevelConfig(1));

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (paused || gameOver || gameWon) return;

    const timer = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [paused, gameOver, gameWon]);

  /* ---------------- BACKGROUND MUSIC ---------------- */
  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Free background music
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // Start playing when game starts
    if (musicPlaying && !gameOver && !gameWon) {
      audio.play().catch((e) => console.log("Audio play failed:", e));
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Control music based on game state
  useEffect(() => {
    if (!audioRef.current) return;

    if (musicPlaying && !paused && !gameOver && !gameWon) {
      audioRef.current.play().catch((e) => console.log("Audio play failed:", e));
    } else {
      audioRef.current.pause();
    }
  }, [musicPlaying, paused, gameOver, gameWon]);

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
  };

  /* ---------------- GAME ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      size.current = { w: window.innerWidth, h: window.innerHeight };
      canvas.width = size.current.w;
      canvas.height = size.current.h;

      man.current.x = size.current.w / 2 - 10;
      man.current.y = size.current.h - 80;
    };

    resize();
    window.addEventListener("resize", resize);

    let animationId: number;

    const drawBackground = () => {
      const { w, h } = size.current;

      ctx.fillStyle = "#CDEFFD";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#A7D676";
      ctx.fillRect(0, 80, w, h - 160);

      ctx.fillStyle = "#EDEDED";
      ctx.fillRect(0, 160, w, h - 320);

      ctx.fillStyle = "#D0D0D0";
      ctx.fillRect(0, 80, w, 80);
      ctx.fillRect(0, h - 160, w, 80);
    };

    const drawMan = () => {
      ctx.fillStyle = "#444";
      ctx.beginPath();
      ctx.arc(man.current.x + 10, man.current.y + 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(man.current.x + 7, man.current.y + 12, 6, 13);
    };

    const drawVehicle = (v: Vehicle) => {
      ctx.fillStyle = v.color;
      ctx.beginPath();
      ctx.roundRect(v.x, v.y, v.width, v.height, 10);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillRect(v.x + 10, v.y + 5, v.width / 3, v.height / 2);

      ctx.fillStyle = v.color;
      ctx.beginPath();
      ctx.arc(v.x + 14, v.y + v.height, 6, 0, Math.PI * 2);
      ctx.arc(v.x + v.width - 14, v.y + v.height, 6, 0, Math.PI * 2);
      ctx.fill();
    };

    const isCollide = (a: any, b: Vehicle) =>
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y;

    const update = () => {
      if (paused || gameOver || gameWon) return;

      const { w, h } = size.current;
      ctx.clearRect(0, 0, w, h);

      drawBackground();
      drawMan();

      vehicles.current.forEach((v) => {
        drawVehicle(v);
        v.x += v.speed;

        if (v.speed > 0 && v.x > w) v.x = -v.width;
        if (v.speed < 0 && v.x < -v.width) v.x = w;

        if (isCollide(man.current, v)) {
          setGameOver(true);
        }
      });

      if (man.current.y < 100) {
        setGameWon(true);
        setShowLevelComplete(true);
        setScore((s) => s + 100 * level); // Bonus points based on level
      }

      animationId = requestAnimationFrame(update);
    };

    update();

    const handleKey = (e: KeyboardEvent) => {
      if (paused || gameOver || gameWon) return;

      if (e.key === "ArrowUp") man.current.y -= 25;
      if (e.key === "ArrowDown") man.current.y += 25;

      man.current.y = Math.max(50, Math.min(man.current.y, size.current.h - 80));
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", resize);
    };
  }, [paused, gameOver, gameWon]);

  /* ---------------- RESET ---------------- */
  const resetGame = () => {
    setScore(0);
    setTime(0);
    setGameOver(false);
    setGameWon(false);
    setShowLevelComplete(false);
    setPaused(false);
    setLevel(1);
    vehicles.current = getLevelConfig(1);
    man.current.y = size.current.h - 80;
  };

  const nextLevel = () => {
    const newLevel = level + 1;
    setLevel(newLevel);
    setGameWon(false);
    setShowLevelComplete(false);
    setPaused(false);
    vehicles.current = getLevelConfig(newLevel);
    man.current.y = size.current.h - 80;
  };

  return (
    <div style={{ margin: 0, overflow: "hidden" }}>
      <canvas ref={canvasRef} />

      {/* TOP LEFT - SCORE */}
      <div style={uiBox("left")}>
        🏆 Score: {score}
        <br />
        🎯 Level: {level}
      </div>

      {/* TOP RIGHT - TIME + PAUSE */}
      <div style={uiBox("right")}>
        ⏱ Time: {time}s
        <br />
        <button onClick={() => setPaused((p) => !p)} style={btnStyle}>
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>
        <br />
        <button onClick={toggleMusic} style={btnStyle}>
          {musicPlaying ? "🔊 Music On" : "🔇 Music Off"}
        </button>
      </div>

      {/* HOME BUTTON */}
      <div style={homeButtonStyle}>
        <button onClick={() => navigate("/games")} style={homeBtnStyle}>
          🏠 Back to Games
        </button>
      </div>

      {/* GAME OVER */}
      {gameOver && (
        <div style={gameOverStyle}>
          <h1>❌ GAME OVER</h1>
          <p>Score: {score}</p>
          <p>Time: {time}s</p>
          <button onClick={resetGame} style={btnStyle}>🔁 Restart</button>
        </div>
      )}

      {/* GAME WON */}
      {gameWon && (
        <div style={gameWonStyle}>
          <h1>🎉 LEVEL {level} COMPLETE!</h1>
          <p>Congratulations! You made it across safely!</p>
          <p>⏱ Time: {time}s</p>
          <p>🏆 Score: {score}</p>
          <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
            {level < 3 ? (
              <button onClick={nextLevel} style={btnStyle}>➡️ Next Level</button>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: "bold", color: "#22c55e" }}>
                  🏆 All Levels Complete! You're a champion!
                </p>
                <button onClick={nextLevel} style={btnStyle}>🔥 Try Endless Mode</button>
              </div>
            )}
            <button onClick={resetGame} style={btnStyle}>🔁 Restart Game</button>
            <button onClick={() => navigate("/games")} style={btnStyle}>🏠 Back to Games</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const uiBox = (side: "left" | "right") => ({
  position: "fixed" as const,
  top: 12,
  [side]: 20,
  background: "rgba(255,255,255,0.75)",
  padding: "10px 14px",
  borderRadius: 10,
  fontWeight: "bold",
  fontSize: 16,
});

const btnStyle = {
  marginTop: 6,
  padding: "6px 12px",
  borderRadius: 8,
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
};

const homeButtonStyle = {
  position: "fixed" as const,
  bottom: 20,
  left: 20,
  zIndex: 1000,
};

const homeBtnStyle = {
  padding: "10px 20px",
  borderRadius: 10,
  border: "none",
  fontWeight: "bold",
  fontSize: 16,
  cursor: "pointer",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  color: "white",
  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  transition: "all 0.3s ease",
};

const gameOverStyle = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
};

const gameWonStyle = {
  position: "fixed" as const,
  inset: 0,
  background: "linear-gradient(135deg, rgba(102, 194, 165, 0.95), rgba(35, 155, 86, 0.95))",
  color: "#fff",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
  fontSize: 18,
};

export default AmbloCar;
