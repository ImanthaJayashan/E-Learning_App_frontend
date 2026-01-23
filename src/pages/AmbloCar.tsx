import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Car = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
};

const AmbloCar: React.FC = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scaleRef = useRef(1);
  const BASE_WIDTH = 1080;
  const BASE_HEIGHT = 540;
  const START_Y = BASE_HEIGHT - 60;
  const TOP_GOAL = 40;

  const man = useRef({
    x: BASE_WIDTH / 2 - 10,
    y: START_Y,
    width: 20,
    height: 20,
  });

  const cars = useRef<Car[]>([
    { x: 0, y: 80, width: 50, height: 20, speed: 1.2, color: "#FF6F6F" },
    { x: 300, y: 130, width: 50, height: 20, speed: -1, color: "#6FA8FF" },
    { x: 0, y: 180, width: 50, height: 20, speed: 1.5, color: "#FF6F6F" },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;

    const resizeCanvas = () => {
      const availableWidth = Math.min(window.innerWidth * 0.95, 1400);
      const availableHeight = Math.min(window.innerHeight * 0.85, 900);
      const scale = Math.min(availableWidth / BASE_WIDTH, availableHeight / BASE_HEIGHT);
      scaleRef.current = scale;
      canvas.width = BASE_WIDTH * scale;
      canvas.height = BASE_HEIGHT * scale;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawRoad = () => {
      ctx.fillStyle = "#E5E7EB";
      ctx.fillRect(0, 80, BASE_WIDTH, 220);
    };

    const drawMan = () => {
      ctx.fillStyle = "#7ED957";
      ctx.fillRect(man.current.x, man.current.y, man.current.width, man.current.height);
    };

    const drawCars = () => {
      cars.current.forEach((car) => {
        ctx.fillStyle = car.color;
        ctx.fillRect(car.x, car.y, car.width, car.height);

        car.x += car.speed;

        if (car.speed > 0 && car.x > BASE_WIDTH) car.x = -car.width;
        if (car.speed < 0 && car.x < -car.width) car.x = BASE_WIDTH;
      });
    };

    const isCollide = (a: { x: number; y: number; width: number; height: number }, b: Car) => {
      return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    };

    const update = () => {
      ctx.setTransform(scaleRef.current, 0, 0, scaleRef.current, 0, 0);
      ctx.fillStyle = "#F9FAF7";
      ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

      drawRoad();
      drawCars();
      drawMan();

      cars.current.forEach((car) => {
        if (isCollide(man.current, car)) {
          window.alert("❌ Hit by car!");
          man.current.y = START_Y;
        }
      });

      if (man.current.y <= TOP_GOAL) {
        setScore((s) => s + 1);
        man.current.y = START_Y;
      }

      animationId = requestAnimationFrame(update);
    };

    update();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") man.current.y = Math.max(10, man.current.y - 24);
      if (e.key === "ArrowDown") man.current.y = Math.min(START_Y, man.current.y + 24);
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const resetGame = () => {
    setScore(0);
    man.current.x = 140;
    man.current.y = 260;
  };

  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .amblocar-page {
      min-height: 100vh;
      background: linear-gradient(180deg, #FFE5B4 0%, #FFD700 50%, #FFA500 100%);
      display: flex;
      flex-direction: column;
      position: relative;
      padding-top: 0;
      padding-bottom: 2rem;
    }

    .amblocar-container {
      flex: 1;
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
      padding: clamp(1.5rem, 3vw, 3rem) clamp(1rem, 3vw, 3rem);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .amblocar-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .amblocar-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 900;
      background: linear-gradient(135deg, #FF4444, #4444FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
      font-family: 'Fredoka One', 'Comic Sans MS', sans-serif;
      letter-spacing: 3px;
    }

    .amblocar-subtitle {
      font-size: 1.5rem;
      color: #333;
      font-weight: 600;
      font-family: 'Nunito', sans-serif;
    }

    .game-area {
      width: 100%;
      max-width: 1200px;
      background: rgba(255, 255, 255, 0.96);
      border-radius: 32px;
      padding: clamp(1.5rem, 3vw, 3rem);
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.18);
      animation: fadeIn 0.6s ease-out;
      backdrop-filter: blur(4px);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
        man.current.y = START_Y;

    .car-display {
      width: 100%;
      height: 300px;
      background: linear-gradient(135deg, #FF4444, #4444FF);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8rem;
      margin-bottom: 2rem;
      box-shadow: inset 0 8px 20px rgba(0, 0, 0, 0.1);
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    .score-board {
      text-align: center;
      margin-bottom: 2rem;
    }

    .score-label {
      font-size: 1.3rem;
      font-weight: 700;
      color: #666;
      margin-bottom: 0.5rem;
      font-family: 'Nunito', sans-serif;
    }

    .score-value {
      font-size: 3rem;
      font-weight: 900;
      background: linear-gradient(135deg, #FF4444, #4444FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-family: 'Fredoka One', sans-serif;
    }

    .game-instructions {
      background: linear-gradient(135deg, #FFE5B4, #FFF9E6);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border-left: 5px solid #FFA500;
    }

    .instructions-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: #FF6B00;
      margin-bottom: 0.8rem;
      font-family: 'Fredoka One', sans-serif;
    }

    .instructions-text {
      font-size: 1.1rem;
      color: #333;
      line-height: 1.8;
      font-family: 'Nunito', sans-serif;
    }

    .button-group {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      border: none;
      border-radius: 25px;
      padding: 1.2rem 2.5rem;
      font-size: 1.3rem;
      font-weight: 900;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Fredoka One', 'Comic Sans MS', sans-serif;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    .btn-play {
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: #2d3142;
      box-shadow: 0 10px 30px rgba(255, 165, 0, 0.4);
    }

    .btn-play:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 15px 40px rgba(255, 165, 0, 0.5);
    }

    .btn-play:active {
      transform: scale(0.95);
    }

    .btn-back {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .btn-back:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
    }

    .btn-back:active {
      transform: scale(0.95);
    }

    .game-canvas {
      width: min(1100px, 95vw);
      height: min(80vh, 720px);
      min-height: 360px;
      border-radius: 22px;
      border: 4px solid #FFD700;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
      background: #f9fafb;
      margin: 0 auto 1.5rem;
      display: block;
    }

    .controls-hint {
      text-align: center;
      font-size: 1rem;
      font-weight: 700;
      color: #444;
      margin: 0.5rem 0 1.5rem;
      font-family: 'Nunito', sans-serif;
    }

    @media (max-width: 768px) {
      .amblocar-container {
        padding: 2rem 1rem;
      }

      .game-area {
        padding: 2rem;
      }

      .car-display {
        height: 200px;
        font-size: 5rem;
      }

      .score-value {
        font-size: 2rem;
      }

      .btn {
        padding: 1rem 2rem;
        font-size: 1.1rem;
      }

      .button-group {
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .amblocar-title {
        font-size: 2rem;
      }

      .game-area {
        padding: 1.5rem;
      }

      .car-display {
        height: 150px;
        font-size: 4rem;
        margin-bottom: 1.5rem;
      }

      .btn {
        padding: 0.9rem 1.8rem;
        font-size: 1rem;
      }

      .button-group {
        flex-direction: column;
        width: 100%;
      }

      .btn {
        width: 100%;
      }
    }
  `;

  return (
    <div>
      <style>{styles}</style>
      <Navbar />

      <div className="amblocar-page">
        <div className="amblocar-container">
          <div className="amblocar-header">
            <h1 className="amblocar-title">🚗 AmbloCar Game</h1>
            <p className="amblocar-subtitle">Help the car find its way!</p>
          </div>

          <div className="game-area">
            <div className="score-board">
              <div className="score-label">Your Score</div>
              <div className="score-value">{score}</div>
            </div>

            <canvas
              ref={canvasRef}
              width={BASE_WIDTH}
              height={BASE_HEIGHT}
              className="game-canvas"
              aria-label="Cross the road game canvas"
            />

            <p className="controls-hint">Use ⬆️⬇️ arrow keys to cross safely.</p>

            <div className="game-instructions">
              <div className="instructions-title">📋 How to Play</div>
              <div className="instructions-text">
                Move up and down with the arrow keys. Reach the top to score. Avoid cars or you will be sent back to start!
              </div>
            </div>

            <div className="button-group">
              <button 
                className="btn btn-play"
                onClick={resetGame}
              >
                ▶️ Reset
              </button>
              <button 
                className="btn btn-back"
                onClick={() => navigate("/games")}
              >
                ← Back to Games
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AmbloCar;
