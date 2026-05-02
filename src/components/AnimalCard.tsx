import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimalCardProps {
  name: string;
  image: string;
  onClick: () => void;
  isCorrect?: boolean;
  isWrong?: boolean;
  disabled?: boolean;
  played?: boolean; // has the sound been heard already
  isMissingAsset?: boolean; // flag if asset is missing
}

export const AnimalCard = ({
  name,
  image,
  onClick,
  isCorrect,
  isWrong,
  disabled,
  played = false,
  isMissingAsset = false,
}: AnimalCardProps) => {
  const isMissing = isMissingAsset || image.includes("MISSING");
  
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isMissing}
      whileHover={{ scale: disabled || isMissing ? 1 : 1.05 }}
      whileTap={{ scale: disabled || isMissing ? 1 : 0.95 }}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-card shadow-lg border-4 transition-all duration-300",
        isCorrect && "border-success bg-success/10 animate-bounce-gentle",
        isWrong && "border-error bg-error/10 animate-wiggle",
        !isCorrect && !isWrong && "border-transparent hover:border-primary/30",
        (disabled || isMissing) && "opacity-50 cursor-not-allowed",
        isMissing && "border-gray-300 bg-gray-50"
      )}
    >
      <div className="w-32 h-32 sm:w-40 sm:h-40 relative">
        {isMissing ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
            <span className="text-4xl">🎵</span>
          </div>
        ) : (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain"
          />
        )}
      </div>
      <span className="text-2xl sm:text-3xl font-bold text-foreground capitalize">
        {name}
      </span>
      
      {isMissing && (
        <span className="text-xs text-gray-500 font-semibold">Asset Missing</span>
      )}
      
      {isCorrect && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 text-5xl"
        >
          ✨
        </motion.div>
      )}
      
      {isWrong && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -right-3 text-5xl"
        >
          ❌
        </motion.div>
      )}

      {played && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-3 -left-3 text-4xl text-green-500"
        >
          ✅
        </motion.div>
      )}
    </motion.button>
  );
};
