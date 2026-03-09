import React from 'react';
import { motion } from 'framer-motion';
type FoxState = 'ready' | 'listening' | 'tryAgain' | 'success';
interface FoxMascotProps {
  state: FoxState;
}
const FOX_IMAGE_URL = "/foximgnb.png";

export function FoxMascot({ state }: FoxMascotProps) {
  const variants = {
    ready: {
      y: [0, -5, 0],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: 'easeInOut'
      }
    },
    listening: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        repeat: Infinity,
        duration: 0.5
      }
    },
    tryAgain: {
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 0.5
      }
    },
    success: {
      y: [0, -20, 0],
      scale: [1, 1.1, 1],
      transition: {
        repeat: Infinity,
        duration: 0.6
      }
    }
  };
  return (
    <motion.div
      className="relative w-48 h-48 mx-auto"
      animate={state}
      variants={variants}>

      <img
        src={FOX_IMAGE_URL}
        alt="Cute fox mascot"
        className="w-full h-full object-contain drop-shadow-xl"
        draggable={false} />


      {/* Question mark for tryAgain */}
      {state === 'tryAgain' &&
        <motion.div
          initial={{
            opacity: 0,
            scale: 0
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          className="absolute -top-2 -right-2 text-4xl font-bold text-red-500 drop-shadow-md">

          ?
        </motion.div>
      }

      {/* Glow ring on success */}
      {state === 'success' &&
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.15, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 1
          }}
          className="absolute inset-0 rounded-full border-4 border-yellow-400 pointer-events-none"
          style={{
            filter: 'blur(4px)'
          }} />

      }
    </motion.div>);

}