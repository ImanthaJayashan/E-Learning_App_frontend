import React from 'react';
import { motion } from 'framer-motion';
interface ProgressBarProps {
  progress: number; // 0 to 100
  isActive: boolean;
  isSuccess: boolean;
}
export function ProgressBar({
  progress,
  isActive,
  isSuccess
}: ProgressBarProps) {
  return (
    <div className="relative w-full h-24 flex items-center justify-center">
      {/* Stars on success */}
      {isSuccess &&
        <div className="absolute -top-4 w-full flex justify-center space-x-4 z-10">
          {[1, 2, 3, 4, 5].map((i) =>
            <motion.div
              key={i}
              initial={{
                scale: 0,
                opacity: 0
              }}
              animate={{
                scale: 1,
                opacity: 1
              }}
              transition={{
                delay: i * 0.1,
                type: 'spring'
              }}
              className="text-2xl">

              ⭐
            </motion.div>
          )}
        </div>
      }

      {/* Curved SVG Bar */}
      <svg
        width="280"
        height="80"
        viewBox="0 0 280 80"
        className="overflow-visible">

        {/* Background Track */}
        <path
          d="M 20 60 Q 140 10 260 60"
          fill="none"
          stroke="#004D40"
          strokeWidth="24"
          strokeLinecap="round"
          className="opacity-30" />


        {/* Inner Track Shadow/Depth */}
        <path
          d="M 20 60 Q 140 10 260 60"
          fill="none"
          stroke="#000000"
          strokeWidth="24"
          strokeLinecap="round"
          className="opacity-10 blur-sm" />


        {/* Progress Fill */}
        <motion.path
          d="M 20 60 Q 140 10 260 60"
          fill="none"
          stroke={isSuccess ? '#FFC107' : '#009688'}
          strokeWidth="16"
          strokeLinecap="round"
          initial={{
            pathLength: 0
          }}
          animate={{
            pathLength: progress / 100
          }}
          transition={{
            duration: 0.5,
            ease: 'easeOut'
          }} />


        {/* Bubbles/Particles when active */}
        {isActive &&
          <motion.g
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}>

            <circle cx="140" cy="35" r="4" fill="#4DB6AC">
              <animate
                attributeName="cy"
                values="35;25;35"
                dur="1s"
                repeatCount="indefinite" />

              <animate
                attributeName="opacity"
                values="1;0.5;1"
                dur="1s"
                repeatCount="indefinite" />

            </circle>
            <circle cx="100" cy="45" r="3" fill="#80CBC4">
              <animate
                attributeName="cy"
                values="45;35;45"
                dur="1.2s"
                repeatCount="indefinite" />

            </circle>
            <circle cx="180" cy="45" r="3" fill="#80CBC4">
              <animate
                attributeName="cy"
                values="45;35;45"
                dur="0.8s"
                repeatCount="indefinite" />

            </circle>
          </motion.g>
        }
      </svg>
    </div>);

}