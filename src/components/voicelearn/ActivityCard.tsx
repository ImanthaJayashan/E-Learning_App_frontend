import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WoodenSign } from './WoodenSign';
import { ProgressBar } from './ProgressBar';
import { FoxMascot } from './FoxMascot';
import confetti from 'canvas-confetti';

type AppState = 'ready' | 'listening' | 'tryAgain' | 'success';
type Mode = 'letters' | 'words';

const DATA = [
  { char: 'A', word: 'Apple', emoji: '🍎' },
  { char: 'B', word: 'Ball', emoji: '⚽' },
  { char: 'C', word: 'Cat', emoji: '🐱' },
  { char: 'D', word: 'Dog', emoji: '🐶' },
  { char: 'E', word: 'Elephant', emoji: '🐘' },
  { char: 'F', word: 'Fish', emoji: '🐟' },
  { char: 'G', word: 'Grapes', emoji: '🍇' },
  { char: 'H', word: 'House', emoji: '🏠' },
  { char: 'I', word: 'Ice Cream', emoji: '🍦' },
  { char: 'J', word: 'Juice', emoji: '🧃' },
  { char: 'K', word: 'Kite', emoji: '🪁' },
  { char: 'L', word: 'Lion', emoji: '🦁' },
  { char: 'M', word: 'Moon', emoji: '🌙' },
  { char: 'N', word: 'Nest', emoji: '🪺' },
  { char: 'O', word: 'Orange', emoji: '🍊' },
  { char: 'P', word: 'Penguin', emoji: '🐧' },
  { char: 'Q', word: 'Queen', emoji: '👑' },
  { char: 'R', word: 'Rabbit', emoji: '🐰' },
  { char: 'S', word: 'Sun', emoji: '☀️' },
  { char: 'T', word: 'Tree', emoji: '🌳' },
  { char: 'U', word: 'Umbrella', emoji: '☂️' },
  { char: 'V', word: 'Violin', emoji: '🎻' },
  { char: 'W', word: 'Watermelon', emoji: '🍉' },
  { char: 'X', word: 'Xylophone', emoji: '🎹' },
  { char: 'Y', word: 'Yacht', emoji: '⛵' },
  { char: 'Z', word: 'Zebra', emoji: '🦓' }
];

export function ActivityCard() {
  const [mode, setMode] = useState<Mode>('letters');
  const [state, setState] = useState<AppState>('ready');
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentItem = DATA[currentIndex];

  const targetText = mode === 'letters' ? currentItem.char : currentItem.word;

  // Handle Progress Bar Animation
  useEffect(() => {
    let interval: any;
    if (state === 'listening') {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 1.6));
      }, 50);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [state]);

  const verifySpeechWithAI = async (audioBlob: Blob) => {
    const formData = new FormData();
    // We append the blob. The filename extension doesn't matter as much 
    // as the Blob's internal type which the server now handles via pydub.
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('word', targetText); 

    try {
      const response = await fetch('https://yasithadulara-preschool-voice-checker.hf.space/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Network response was not ok");
      
      const result = await response.json();

      if (result.is_correct) {
        setState('success');
        triggerConfetti();
      } else {
        console.log("AI heard:", result.heard);
        setState('tryAgain');
      }
    } catch (error) {
      console.error("Connection Error:", error);
      setState('tryAgain');
    }
  };

  const handleMainAction = async () => {
    if (state === 'ready' || state === 'tryAgain') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            } 
        });
        
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = async () => {
          // FIX: Use the native recorder mimeType (audio/webm or audio/ogg)
          // This prevents sending "fake" WAV headers that crash the backend
          const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
          await verifySpeechWithAI(audioBlob);
          
          // Stop all mic tracks to release the hardware
          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setState('listening');
        
        // Auto-stop recording after 3 seconds
        setTimeout(() => { 
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop(); 
          }
        }, 3000);

      } catch (err) { 
        alert("Microphone access is needed for the Magic Mic! 🎤"); 
        console.error(err);
      }
    } else if (state === 'success') {
      setCurrentIndex((prev) => (prev + 1) % DATA.length);
      setState('ready');
    }
  };

  const triggerConfetti = () => {
    confetti({ 
      particleCount: 150, 
      spread: 80, 
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF4500', '#32CD32', '#1E90FF'] 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-md mx-auto p-4"
    >
      <div className="flex justify-center mb-6 bg-amber-100/50 p-1 rounded-2xl border-2 border-amber-200 backdrop-blur-sm">
        <button 
          onClick={() => { setMode('letters'); setState('ready'); }}
          className={`px-8 py-2 rounded-xl font-bold transition-all duration-300 ${
            mode === 'letters' ? 'bg-amber-500 text-white shadow-lg' : 'text-amber-800 hover:bg-amber-200/50'
          }`}
        >
          🔤 Letters
        </button>
        <button 
          onClick={() => { setMode('words'); setState('ready'); }}
          className={`px-8 py-2 rounded-xl font-bold transition-all duration-300 ${
            mode === 'words' ? 'bg-amber-500 text-white shadow-lg' : 'text-amber-800 hover:bg-amber-200/50'
          }`}
        >
          📖 Words
        </button>
      </div>

      <div className="glass-panel rounded-[32px] p-8 shadow-2xl border-[6px] border-[#C4944A] bg-white/95 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl" />

        <div className="flex justify-center gap-3 mb-4">
          {[1, 2, 3].map((s) => (
            <motion.span 
              key={s} 
              animate={{ 
                filter: state === 'success' ? 'grayscale(0%)' : 'grayscale(100%)',
                scale: state === 'success' ? [1, 1.2, 1] : 1,
                rotate: state === 'success' ? [0, 10, -10, 0] : 0
              }} 
              transition={{ delay: s * 0.1 }}
              className="text-4xl drop-shadow-sm"
            >
              ⭐
            </motion.span>
          ))}
        </div>

        <WoodenSign
          letter={mode === 'letters' ? currentItem.char : ""}
          word={currentItem.word}
          emoji={currentItem.emoji}
          isSuccess={state === 'success'} 
        />

        <div className="mt-8 text-center">
          <AnimatePresence mode="wait">
            <motion.p 
              key={state}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className={`font-black mb-3 uppercase tracking-wider text-lg ${
                state === 'tryAgain' ? 'text-red-500' : 'text-amber-900'
              }`}
            >
              {state === 'listening' ? "Listening..." : 
               state === 'tryAgain' ? "Try Again! 🦊" :
               state === 'success' ? "Amazing! ✨" :
               `Say: ${targetText}`}
            </motion.p>
          </AnimatePresence>
          
          <ProgressBar 
            progress={progress} 
            isActive={state === 'listening'} 
            isSuccess={state === 'success'} 
          />
        </div>

        <div className="mt-4 flex justify-center">
          <FoxMascot state={state} />
        </div>

        <div className="text-center mt-8">
          <motion.button
            whileHover={state !== 'listening' ? { scale: 1.02 } : {}}
            whileTap={state !== 'listening' ? { scale: 0.95 } : {}}
            onClick={handleMainAction}
            disabled={state === 'listening'}
            className={`w-full py-5 rounded-3xl text-white font-black text-2xl shadow-[0_6px_0_0_rgba(0,0,0,0.2)] transition-all ${
              state === 'listening' ? 'bg-gray-400 cursor-not-allowed shadow-none translate-y-1' : 
              state === 'success' ? 'bg-gradient-to-r from-orange-400 to-orange-500 border-b-4 border-orange-700' : 
              state === 'tryAgain' ? 'bg-gradient-to-r from-red-500 to-red-600 border-b-4 border-red-800' :
              'bg-gradient-to-r from-green-500 to-green-600 border-b-4 border-green-800'
            }`}
          >
            {state === 'ready' ? 'START MAGIC' : 
             state === 'listening' ? 'LISTENING...' : 
             state === 'success' ? 'NEXT ONE!' : 
             'TRY AGAIN'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}