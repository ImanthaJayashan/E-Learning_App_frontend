import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WoodenSign } from './WoodenSign';
import { ProgressBar } from './ProgressBar';
import { FoxMascot } from './FoxMascot';
import confetti from 'canvas-confetti';

type AppState = 'ready' | 'listening' | 'tryAgain' | 'success' | 'skipped';
type Mode = 'letters' | 'words';

export type LetterResult = {
  char: string;
  word: string;
  emoji: string;
  status: 'correct' | 'missed' | 'skipped' | 'pending';
  attempts: number;
};

export const VOICE_LEARN_DATA = [
  { char: 'A', word: 'Apple', emoji: '🍎' },
  { char: 'B', word: 'Ball', emoji: '⚽' },
  { char: 'C', word: 'Cat', emoji: '🐱' },
  { char: 'D', word: 'Dog', emoji: '🐶' },
  { char: 'E', word: 'Egg', emoji: '🥚' },       
  { char: 'F', word: 'Fish', emoji: '🐟' },
  { char: 'G', word: 'Goat', emoji: '🐐' },    
  { char: 'H', word: 'Hat', emoji: '👒' },     
  { char: 'I', word: 'Igloo', emoji: '❄️' },   
  { char: 'J', word: 'Jam', emoji: '🍓' },        
  { char: 'K', word: 'Kite', emoji: '🪁' },
  { char: 'L', word: 'Lion', emoji: '🦁' },
  { char: 'M', word: 'Milk', emoji: '🥛' },   
  { char: 'N', word: 'Nose', emoji: '👃' },   
  { char: 'O', word: 'Owl', emoji: '🦉' },     
  { char: 'P', word: 'Pig', emoji: '🐷' },     
  { char: 'Q', word: 'Queen', emoji: '👑' },
  { char: 'R', word: 'Rain', emoji: '🌧️' },   
  { char: 'S', word: 'Sun', emoji: '☀️' },
  { char: 'T', word: 'Toy', emoji: '🧸' },     
  { char: 'U', word: 'Up', emoji: '⬆️' },        
  { char: 'V', word: 'Van', emoji: '🚐' },      
  { char: 'W', word: 'Web', emoji: '🕸️' },      
  { char: 'X', word: 'X-ray', emoji: '🩻' }       
  { char: 'Y', word: 'Yo-yo', emoji: '🪀' },     
  { char: 'Z', word: 'Zoo', emoji: '🦒' }       
];

const MAX_ATTEMPTS = 2;

interface ActivityCardProps {
  onResultsUpdate?: (results: LetterResult[]) => void;
}

export function ActivityCard({ onResultsUpdate }: ActivityCardProps) {
  const [mode, setMode] = useState<Mode>('letters');
  const [state, setState] = useState<AppState>('ready');
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [results, setResults] = useState<LetterResult[]>(
    VOICE_LEARN_DATA.map(d => ({ ...d, status: 'pending', attempts: 0 }))
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentItem = VOICE_LEARN_DATA[currentIndex];
  const targetText = mode === 'letters' ? currentItem.char : currentItem.word;

  // Persist results to localStorage for ParentsDashboard to read
  useEffect(() => {
    localStorage.setItem('voiceLearnResults', JSON.stringify(results));
    if (onResultsUpdate) onResultsUpdate(results);
  }, [results]);

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

  const updateResult = (index: number, status: LetterResult['status'], attemptCount: number) => {
    setResults(prev => {
      const next = [...prev];
      next[index] = { ...next[index], status, attempts: attemptCount };
      return next;
    });
  };

  const advanceToNext = (currentIdx: number) => {
    setCurrentIndex((currentIdx + 1) % VOICE_LEARN_DATA.length);
    setAttempts(0);
    setState('ready');
  };

  const verifySpeechWithAI = async (audioBlob: Blob, currentAttempts: number, currentIdx: number) => {
    const formData = new FormData();
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
        updateResult(currentIdx, 'correct', currentAttempts + 1);
        setState('success');
        triggerConfetti();
      } else {
        const newAttempts = currentAttempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          updateResult(currentIdx, 'missed', newAttempts);
          setState('skipped');
          setTimeout(() => advanceToNext(currentIdx), 2000);
        } else {
          setState('tryAgain');
        }
      }
    } catch (error) {
      console.error("Connection Error:", error);
      const newAttempts = currentAttempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        updateResult(currentIdx, 'missed', newAttempts);
        setState('skipped');
        setTimeout(() => advanceToNext(currentIdx), 2000);
      } else {
        setState('tryAgain');
      }
    }
  };

  const handleMainAction = async () => {
    if (state === 'ready' || state === 'tryAgain') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });

        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        const capturedAttempts = attempts;
        const capturedIndex = currentIndex;

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
          await verifySpeechWithAI(audioBlob, capturedAttempts, capturedIndex);
          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setState('listening');

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
      advanceToNext(currentIndex);
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
          onClick={() => { setMode('letters'); setState('ready'); setAttempts(0); }}
          className={`px-8 py-2 rounded-xl font-bold transition-all duration-300 ${mode === 'letters' ? 'bg-amber-500 text-white shadow-lg' : 'text-amber-800 hover:bg-amber-200/50'}`}
        >
          🔤 Letters
        </button>
        <button
          onClick={() => { setMode('words'); setState('ready'); setAttempts(0); }}
          className={`px-8 py-2 rounded-xl font-bold transition-all duration-300 ${mode === 'words' ? 'bg-amber-500 text-white shadow-lg' : 'text-amber-800 hover:bg-amber-200/50'}`}
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
            >⭐</motion.span>
          ))}
        </div>

        {state === 'tryAgain' && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center items-center gap-2 mb-3">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${i < attempts ? 'bg-red-400' : 'bg-gray-200'}`} />
            ))}
            <span className="text-xs text-gray-500 ml-1 font-semibold">{MAX_ATTEMPTS - attempts} try left</span>
          </motion.div>
        )}

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
                state === 'tryAgain' ? 'text-red-500' :
                state === 'skipped' ? 'text-orange-500' :
                'text-amber-900'
              }`}
            >
              {state === 'listening' ? "Listening..." :
               state === 'tryAgain' ? "Try Again! 🦊" :
               state === 'success' ? "Amazing! ✨" :
               state === 'skipped' ? "Moving On... ➡️" :
               `Say: ${targetText}`}
            </motion.p>
          </AnimatePresence>

          <ProgressBar progress={progress} isActive={state === 'listening'} isSuccess={state === 'success'} />
        </div>

        <div className="mt-4 flex justify-center">
          <FoxMascot state={state === 'skipped' ? 'tryAgain' : state} />
        </div>

        <div className="text-center mt-8">
          <motion.button
            whileHover={state !== 'listening' && state !== 'skipped' ? { scale: 1.02 } : {}}
            whileTap={state !== 'listening' && state !== 'skipped' ? { scale: 0.95 } : {}}
            onClick={handleMainAction}
            disabled={state === 'listening' || state === 'skipped'}
            className={`w-full py-5 rounded-3xl text-white font-black text-2xl shadow-[0_6px_0_0_rgba(0,0,0,0.2)] transition-all ${
              state === 'listening' || state === 'skipped' ? 'bg-gray-400 cursor-not-allowed shadow-none translate-y-1' :
              state === 'success' ? 'bg-gradient-to-r from-orange-400 to-orange-500 border-b-4 border-orange-700' :
              state === 'tryAgain' ? 'bg-gradient-to-r from-red-500 to-red-600 border-b-4 border-red-800' :
              'bg-gradient-to-r from-green-500 to-green-600 border-b-4 border-green-800'
            }`}
          >
            {state === 'ready' ? 'START MAGIC' :
             state === 'listening' ? 'LISTENING...' :
             state === 'success' ? 'NEXT ONE!' :
             state === 'skipped' ? 'MOVING ON...' :
             'TRY AGAIN'}
          </motion.button>
        </div>

        {state === 'tryAgain' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-3">
            <button
              onClick={() => {
                updateResult(currentIndex, 'skipped', attempts);
                advanceToNext(currentIndex);
              }}
              className="text-sm text-gray-400 hover:text-gray-600 underline font-semibold transition-colors"
            >
              Skip this letter →
            </button>
          </motion.div>
        )}
      </div>

      {/* Mini A–Z progress tracker */}
      <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl p-3 border-2 border-amber-200">
        <p className="text-xs font-bold text-amber-700 mb-2 text-center">ABC Progress</p>
        <div className="flex flex-wrap gap-1 justify-center">
          {results.map((r, i) => (
            <div
              key={r.char}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all ${
                i === currentIndex ? 'ring-2 ring-amber-500 scale-110' :
                r.status === 'correct' ? 'bg-green-400 text-white' :
                r.status === 'missed' ? 'bg-red-300 text-white' :
                r.status === 'skipped' ? 'bg-orange-300 text-white' :
                'bg-gray-100 text-gray-400'
              }`}
              title={`${r.char} - ${r.status}`}
            >
              {r.status === 'correct' ? '✓' : r.status === 'missed' || r.status === 'skipped' ? '✗' : r.char}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
