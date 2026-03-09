import { motion } from 'framer-motion';

interface WoodenSignProps {
    letter: string;
    word: string;
    emoji: string;
    isSuccess: boolean;
}

export function WoodenSign({ letter, word, emoji, isSuccess }: WoodenSignProps) {
    return (
        <div className="text-center">
            {/* Wooden Board with Letter and Emoji */}
            <motion.div
                key={`${letter}-${isSuccess}`}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative inline-block"
            >
                {/* Wooden Frame Outer Border */}
                <div className="
          relative
          bg-gradient-to-b from-[#D4A574] via-[#C4944A] to-[#8B6914]
          rounded-2xl p-2
          shadow-[0_8px_24px_rgba(139,105,20,0.4)]
        ">
                    {/* Inner Wooden Board */}
                    <div className="
            bg-gradient-to-b from-[#E8C896] via-[#D4B07A] to-[#C49A5E]
            rounded-xl px-6 py-5
            relative overflow-hidden
            min-w-[280px]
          ">
                        {/* Wood grain texture overlay */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{
                                backgroundImage: `
                  repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 20px,
                    rgba(139, 105, 20, 0.1) 20px,
                    rgba(139, 105, 20, 0.1) 22px
                  ),
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 40px,
                    rgba(139, 105, 20, 0.05) 40px,
                    rgba(139, 105, 20, 0.05) 42px
                  )
                `
                            }}
                        />

                        {/* Content Row */}
                        <div className="flex items-center justify-center gap-3 relative z-10">
                            {/* Success Checkmark */}
                            {isSuccess && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                    className="flex-shrink-0"
                                >
                                    <svg
                                        width="48"
                                        height="48"
                                        viewBox="0 0 48 48"
                                        className="drop-shadow-lg"
                                    >
                                        <path
                                            d="M8 24 L18 36 L40 12"
                                            fill="none"
                                            stroke="#4CAF50"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="drop-shadow-md"
                                        />
                                    </svg>
                                </motion.div>
                            )}

                            {/* Large Letter */}
                            <motion.span
                                className="text-6xl md:text-7xl font-black drop-shadow-lg"
                                style={{
                                    color: '#E53935',
                                    textShadow: '2px 2px 0 #B71C1C, 3px 3px 6px rgba(0,0,0,0.3)'
                                }}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                {letter}
                            </motion.span>

                            {/* Emoji Icon */}
                            <motion.span
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                                className="text-5xl md:text-6xl drop-shadow-md flex-shrink-0"
                            >
                                {emoji}
                            </motion.span>
                        </div>
                    </div>
                </div>

                {/* Corner screws/nails decoration */}
                <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-gradient-to-br from-[#8B7355] to-[#5D4037] shadow-inner" />
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-gradient-to-br from-[#8B7355] to-[#5D4037] shadow-inner" />
                <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-gradient-to-br from-[#8B7355] to-[#5D4037] shadow-inner" />
                <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-gradient-to-br from-[#8B7355] to-[#5D4037] shadow-inner" />
            </motion.div>

            {/* Word Label - Changes based on success state */}
            <motion.div
                key={`${word}-${isSuccess}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
            >
                {isSuccess ? (
                    <>
                        <p className="text-xl md:text-2xl font-extrabold text-[#4CAF50] tracking-wide mb-1">
                            Great Job! 🎉
                        </p>
                        <p className="text-lg md:text-xl font-bold text-[#5D4037] tracking-wide">
                            You said {letter} for <span className="text-[#E53935]">{word}</span>!
                        </p>
                    </>
                ) : (
                    <p className="text-xl md:text-2xl font-bold text-[#5D4037] tracking-wide">
                        Say: {letter} for <span className="text-[#E53935]">{word}</span>
                    </p>
                )}
            </motion.div>
        </div>
    );
}
