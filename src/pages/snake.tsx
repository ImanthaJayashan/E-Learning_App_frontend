import React, { useEffect, useRef, useState } from "react";

const CELL_SIZE = 20;

type Point = { x: number; y: number };
type ShapeType = "circle" | "square" | "triangle" | "star";

const randomShape = (): ShapeType => {
  const shapes: ShapeType[] = ["circle", "square", "triangle", "star"];
  return shapes[Math.floor(Math.random() * shapes.length)];
};

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);

  const [snake, setSnake] = useState<Point[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
  ]);
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [food, setFood] = useState<Point>({ x: 10, y: 10 });
  const [foodShape, setFoodShape] = useState<ShapeType>("circle");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const pulse = useRef(0);

  /* ---------------- Full Screen Resize ---------------- */
  useEffect(() => {
    const resize = () => {
      const w = Math.floor(window.innerWidth / CELL_SIZE);
      const h = Math.floor((window.innerHeight - 140) / CELL_SIZE);
      setCols(w);
      setRows(h);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ---------------- Food ---------------- */
  const generateFood = (snakeBody: Point[]) => {
    let f;
    do {
      f = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
      };
    } while (snakeBody.some(s => s.x === f.x && s.y === f.y));

    setFood(f);
    setFoodShape(randomShape());
  };

  /* ---------------- Controls ---------------- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowUp" && direction.y !== 1) setDirection({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && direction.y !== -1) setDirection({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && direction.x !== 1) setDirection({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && direction.x !== -1) setDirection({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction]);

  /* ---------------- Game Loop ---------------- */
  useEffect(() => {
    if (gameOver || cols === 0 || rows === 0) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        if (
          newHead.x < 0 || newHead.y < 0 ||
          newHead.x >= cols || newHead.y >= rows
        ) {
          setGameOver(true);
          return prev;
        }

        if (prev.some(p => p.x === newHead.x && p.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        let next = [newHead, ...prev];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1);
          generateFood(next);
        } else {
          next.pop();
        }

        return next;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [direction, food, gameOver, cols, rows]);

  /* ---------------- Drawing ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = cols * CELL_SIZE;
    canvas.height = rows * CELL_SIZE;

    pulse.current += 0.08;
    const glow = 1 + Math.sin(pulse.current) * 0.2;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Snake
    ctx.fillStyle = "#22c55e";
    snake.forEach(s => {
      ctx.fillRect(
        s.x * CELL_SIZE,
        s.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    });

    // Food Shapes
    ctx.save();
    ctx.translate(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2
    );
    ctx.scale(glow, glow);
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 15;

    const r = CELL_SIZE / 2;

    if (foodShape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (foodShape === "square") {
      ctx.fillRect(-r, -r, CELL_SIZE, CELL_SIZE);
    }

    if (foodShape === "triangle") {
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r, r);
      ctx.lineTo(-r, r);
      ctx.closePath();
      ctx.fill();
    }

    if (foodShape === "star") {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos((18 + i * 72) * Math.PI / 180) * r,
          -Math.sin((18 + i * 72) * Math.PI / 180) * r
        );
        ctx.lineTo(
          Math.cos((54 + i * 72) * Math.PI / 180) * (r / 2),
          -Math.sin((54 + i * 72) * Math.PI / 180) * (r / 2)
        );
      }
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }, [snake, food, foodShape, cols, rows]);

  const restart = () => {
    setSnake([{ x: 5, y: 5 }, { x: 4, y: 5 }]);
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    generateFood([{ x: 5, y: 5 }]);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#f9fafb" }}>
      <div style={{ padding: "1rem", fontWeight: "bold" }}>
        🐍 Score: {score}
      </div>

      <canvas ref={canvasRef} />

      {gameOver && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <h2 style={{ color: "red" }}>Game Over</h2>
          <button onClick={restart}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
