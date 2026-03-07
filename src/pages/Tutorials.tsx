import { useState, useEffect } from "react";
import lettersData from "../data/letters.json";
import Navbar from "../components/Navbar";

interface LetterItem {
  letter: string;
  title: string;
  youtubeId: string;
}

export default function Tutorials() {
  const [selected, setSelected] = useState<LetterItem | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <div className="page">
        {/* Animated Background */}
        <div className="bg-gradient"></div>
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>

        {/* Hero */}
        <div className="hero">
          <h1>Alphabet Adventure 🚀</h1>
          <p>Click a letter and watch the magic video!</p>
        </div>

        {/* Letters */}
        <div className="grid">
          {lettersData.letters.map((item) => (
            <div
              key={item.letter}
              className="card"
              onClick={() => setSelected(item)}
            >
              <div className="letter">{item.letter}</div>
              <div className="label">Letter {item.letter}</div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selected && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{selected.title}</h2>
                <button onClick={() => setSelected(null)}>✕</button>
              </div>
              <div className="video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${selected.youtubeId}?autoplay=1`}
                  title={selected.title}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        <style>{`
      .page {
        min-height: 100vh;
        overflow: hidden;
        position: relative;
        font-family: 'Comic Sans MS', cursive;
      }

      .bg-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(270deg,#ff9a9e,#fad0c4,#fbc2eb,#a6c1ee);
        background-size: 800% 800%;
        animation: gradientMove 15s ease infinite;
        z-index:-2;
      }

      @keyframes gradientMove {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
      }

      .cloud {
        position:absolute;
        background:white;
        border-radius:50%;
        opacity:0.6;
        animation: float 20s linear infinite;
      }

      .cloud1 { width:200px;height:100px;top:100px;left:-200px; }
      .cloud2 { width:150px;height:80px;top:200px;left:-150px;animation-duration:25s;}

      @keyframes float {
        from{ transform: translateX(0); }
        to{ transform: translateX(150vw); }
      }

      .navbar {
        display:flex;
        justify-content:space-between;
        padding:20px 40px;
        color:white;
        font-weight:bold;
      }

      .menu span {
        margin-left:20px;
        cursor:pointer;
        transition:0.3s;
      }

      .menu span:hover {
        transform:scale(1.2);
      }

      .active {
        text-decoration:underline;
      }

      .hero {
        text-align:center;
        color:white;
        margin-top:30px;
      }

      .hero h1 {
        font-size:50px;
      }

      .grid {
        margin-top:50px;
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(120px,1fr));
        gap:25px;
        padding:0 40px 60px;
      }

      .card {
        background:rgba(255,255,255,0.9);
        border-radius:25px;
        padding:25px;
        text-align:center;
        cursor:pointer;
        transition:0.3s;
        box-shadow:0 10px 30px rgba(0,0,0,0.2);
      }

      .card:hover {
        transform:translateY(-15px) rotate(-3deg) scale(1.05);
      }

      .letter {
        font-size:40px;
        font-weight:bold;
        background:linear-gradient(135deg,#ff6a00,#ee0979);
        -webkit-background-clip:text;
        color:transparent;
      }

      .label {
        margin-top:10px;
        font-weight:bold;
        color:#333;
      }

      .modal-overlay {
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.7);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:1000;
      }

      .modal {
        background:white;
        border-radius:25px;
        width:90%;
        max-width:800px;
        padding:20px;
        animation: pop 0.3s ease;
      }

      @keyframes pop {
        from{ transform:scale(0.7); opacity:0; }
        to{ transform:scale(1); opacity:1; }
      }

      .modal-header {
        display:flex;
        justify-content:space-between;
        align-items:center;
      }

      .modal-header button {
        background:red;
        border:none;
        color:white;
        border-radius:50%;
        width:35px;
        height:35px;
        cursor:pointer;
      }

      .video-wrapper {
        position:relative;
        padding-top:56.25%;
        margin-top:15px;
      }

      .video-wrapper iframe {
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        border-radius:15px;
        border:none;
      }
      `}</style>
      </div>
    </>
  );
}
