import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AmbloCar: React.FC = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);

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
      padding-bottom: 4rem;
    }

    .amblocar-container {
      flex: 1;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      padding: 3rem 2rem;
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
      max-width: 900px;
      background: white;
      border-radius: 30px;
      padding: 3rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      animation: fadeIn 0.6s ease-out;
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
    }

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
            <div className="car-display">🏎️</div>

            <div className="score-board">
              <div className="score-label">Your Score</div>
              <div className="score-value">{score}</div>
            </div>

            <div className="game-instructions">
              <div className="instructions-title">📋 How to Play</div>
              <div className="instructions-text">
                Guide the car through the track to complete the level. 
                Avoid obstacles and collect power-ups to boost your score!
              </div>
            </div>

            <div className="button-group">
              <button 
                className="btn btn-play"
                onClick={() => setScore(score + 10)}
              >
                ▶️ Start Game
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
