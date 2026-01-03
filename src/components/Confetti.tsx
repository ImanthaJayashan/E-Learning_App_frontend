import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiProps {
  show: boolean;
}

export const Confetti = ({ show }: ConfettiProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string }>>([]);

  useEffect(() => {
    if (show) {
      const colors = ["#4ade80", "#fbbf24", "#60a5fa", "#f87171", "#c084fc"];
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ y: -20, x: `${particle.x}vw`, opacity: 1 }}
          animate={{ y: "100vh", opacity: 0 }}
          transition={{ duration: 2, ease: "easeIn" }}
          className="absolute w-3 h-3 rounded-full"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  );
};
