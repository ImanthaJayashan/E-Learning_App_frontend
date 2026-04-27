import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

type KidCanvasProps = {
  width?: number;
  height?: number;
};

export type KidCanvasRef = {
  clear: () => void;
  getImageData: () => Promise<Blob | null>;
};

const KidCanvas = forwardRef<KidCanvasRef, KidCanvasProps>(
  ({ width = 320, height = 320 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      clear: () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        // Clear and set white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
      },
      getImageData: async () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        return new Promise<Blob | null>((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob);
          }, "image/png");
        });
      },
    }));

    // Setup canvas
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 20;
      ctx.strokeStyle = "black";

      // Set white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";

      ctxRef.current = ctx;
    }, [width, height]);

    const getPoint = (
      e: React.MouseEvent | React.TouchEvent
    ): { x: number; y: number } => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();

      if ("touches" in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }

      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      const { x, y } = getPoint(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      const ctx = ctxRef.current;
      if (!ctx) return;

      const { x, y } = getPoint(e);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const stopDrawing = () => {
      if (!isDrawing) return;
      setIsDrawing(false);
      ctxRef.current?.beginPath();
    };

    return (
      <canvas
        ref={canvasRef}
        className="bg-white rounded-3xl shadow-2xl border-4 border-purple-300 touch-none cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    );
  }
);

KidCanvas.displayName = "KidCanvas";

export default KidCanvas;
