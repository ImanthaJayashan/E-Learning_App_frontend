import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AnimalCard } from "@/components/AnimalCard";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { Volume2, RotateCcw, Brain, Info, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { gameService, PredictionResult } from "@/services/gameService";
import { 
  gameConfig, 
  shouldShowPredictionUI, 
  getModeDescription,
  getLevelDescription,
  isAdaptiveLearningEnabled,
  calculateLevelChange,
  getNextLevel,
} from "@/config/gameConfig";
// ENHANCEMENT: Import animal categories and utilities
import { getAnimalsByLevel, Animal } from "@/config/animals";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  
  // ============================================
  // 🎮 DIFFICULTY LEVEL STATE (ENHANCEMENT)
  // ============================================
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1);
  const [levelAnimals, setLevelAnimals] = useState<Animal[]>([]);
  const [levelStats, setLevelStats] = useState({
    attempts: 0,
    correct: 0,
    accuracy: 0,
  });
  const [showLevelChange, setShowLevelChange] = useState(false);
  const [levelChangeMessage, setLevelChangeMessage] = useState("");
  
  // ============================================
  // 🔴 ATTEMPT LIMIT & FAILURE HANDLING (NEW)
  // ============================================
  const MAX_ATTEMPTS_PER_LEVEL = 4; // 4 attempts per level, 12 total (3 levels × 4)
  const [totalAttempts, setTotalAttempts] = useState(0); // Track total attempts across all levels
  const [levelAttemptCounts, setLevelAttemptCounts] = useState<{[key in 1|2|3]: number}>({ 1: 0, 2: 0, 3: 0 });
  const [failedLevels, setFailedLevels] = useState<{[key in 1|2|3]: boolean}>({ 1: false, 2: false, 3: false });
  const [consecutiveWrongAnswers, setConsecutiveWrongAnswers] = useState(0);
  const [sessionFailed, setSessionFailed] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<{[key in 1|2|3]: boolean}>({ 1: false, 2: false, 3: false });
  const [showEarlyAssessment, setShowEarlyAssessment] = useState(false);
  const [shouldRedirectAfterAssessment, setShouldRedirectAfterAssessment] = useState(false);
  
  
  // ============================================
  // 🎮 GAME STATE
  // ============================================
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Prediction state
  const [canPredict, setCanPredict] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  
  // ENHANCEMENT: Wrong answer tracking for feedback
  const [wrongAnimalShown, setWrongAnimalShown] = useState<string | null>(null);
  
  const soundPlayTimeRef = useRef<number | null>(null);
  const sessionStartTimeRef = useRef<number>(Date.now());
  // 🔹 FIX: Use ref instead of state for lastAnimalName to maintain stable function reference
  // This prevents selectRandomAnimal from being recreated on every attempt
  const lastAnimalNameRef = useRef<string | null>(null);

  // ============================================
  // 🎯 INITIALIZE GAME WITH DIFFICULTY LEVEL
  // ============================================
  useEffect(() => {
    // Read selected level from session storage (set by LearnSounds)
    const selectedLevel = sessionStorage.getItem('selectedGameLevel');
    if (selectedLevel && ['1', '2', '3'].includes(selectedLevel)) {
      const level = parseInt(selectedLevel) as 1 | 2 | 3;
      setCurrentLevel(level);
      const allLevelAnimals = getAnimalsByLevel(level);
      // ENHANCEMENT: Filter out animals with missing assets
      const playableAnimals = allLevelAnimals.filter(animal => !animal.isMissingAssets);
      setLevelAnimals(playableAnimals);
      console.log(`🎮 Game started with Level ${level}: ${playableAnimals.map(a => a.name).join(', ')}`);
      
      if (playableAnimals.length < allLevelAnimals.length) {
        console.warn(`⚠️  ${allLevelAnimals.length - playableAnimals.length} animals skipped due to missing assets`);
      }
    } else {
      // Default to level 1
      const allLevelAnimals = getAnimalsByLevel(1);
      // ENHANCEMENT: Filter out animals with missing assets
      const playableAnimals = allLevelAnimals.filter(animal => !animal.isMissingAssets);
      setLevelAnimals(playableAnimals);
    }
  }, []);

  const selectRandomAnimal = useCallback(() => {
    if (levelAnimals.length > 0) {
      let randomIndex = Math.floor(Math.random() * levelAnimals.length);
      
      // 🔹 FIX: Prevent same sound in consecutive attempts
      // Use ref instead of state to maintain stable function reference
      if (levelAnimals.length > 1) {
        // Keep generating random index until we get a different animal
        while (levelAnimals[randomIndex].name === lastAnimalNameRef.current) {
          randomIndex = Math.floor(Math.random() * levelAnimals.length);
        }
      }
      
      const selectedAnimal = levelAnimals[randomIndex];
      setCurrentAnimal(selectedAnimal);
      // 🔹 FIX: Update ref synchronously (not state) to track last played animal
      lastAnimalNameRef.current = selectedAnimal.name;
      setSelectedAnimal(null);
      setWrongAnimalShown(null);
      
      // 🔹 DEBUG: Log the selected animal for verification
      console.log(`🎵 Sound selected: ${selectedAnimal.name} (${selectedAnimal.emoji})`);
    }
  }, [levelAnimals]);

  const playSound = () => {
    if (currentAnimal) {
      soundPlayTimeRef.current = Date.now();
      const audio = new Audio(currentAnimal.sound);
      audio.play().catch((e) => {
        console.error("Failed to play sound", e);
      });
      
      // 🔹 DEBUG: Verify correct animal is being played
      console.log(`🔊 Playing sound: ${currentAnimal.name}`);
      
      if (!gameStarted) {
        setGameStarted(true);
        sessionStartTimeRef.current = Date.now();
      }
    }
  };

  // ============================================
  // 📊 CHECK AND UPDATE LEVEL (ADAPTIVE LEARNING)
  // ============================================
  const checkAndUpdateLevel = useCallback((newStats: any) => {
    if (!isAdaptiveLearningEnabled()) return;

    const accuracy = newStats.correct / newStats.attempts;
    const levelChange = calculateLevelChange(accuracy, newStats.attempts);

    if (levelChange !== 'stay') {
      const newLevel = getNextLevel(currentLevel, levelChange);
      
      if (newLevel !== currentLevel) {
        // Level changed!
        setCurrentLevel(newLevel);
        const allLevelAnimals = getAnimalsByLevel(newLevel);
        // ENHANCEMENT: Filter out animals with missing assets
        const playableAnimals = allLevelAnimals.filter(animal => !animal.isMissingAssets);
        setLevelAnimals(playableAnimals);
        
        // Show feedback
        const message = levelChange === 'increase' 
          ? `🎉 Great job! Accuracy ${(accuracy * 100).toFixed(1)}%. Moving to ${getLevelDescription(newLevel)}!`
          : `📍 Keep practicing! Accuracy ${(accuracy * 100).toFixed(1)}%. Back to ${getLevelDescription(newLevel)}!`;
        
        setLevelChangeMessage(message);
        setShowLevelChange(true);
        
        toast({
          title: levelChange === 'increase' ? "Level Up! 📈" : "Level Adjusted 📍",
          description: message,
          variant: levelChange === 'increase' ? 'default' : 'secondary',
        });
        
        // Reset stats for new level
        setLevelStats({ attempts: 0, correct: 0, accuracy: 0 });
        
        setTimeout(() => setShowLevelChange(false), 3000);
      }
    }
  }, [currentLevel, isAdaptiveLearningEnabled]);

  const handleAnimalClick = async (animalName: string) => {
    // ============================================
    // 🔴 ATTEMPT LIMIT CHECK
    // ============================================
    if (levelAttemptCounts[currentLevel] >= MAX_ATTEMPTS_PER_LEVEL) {
      toast({
        title: "Attempt Limit Reached",
        description: `You've reached the maximum ${MAX_ATTEMPTS_PER_LEVEL} attempts for this level. Please go to the learning section.`,
        variant: "destructive",
      });
      return;
    }

    if (showPrediction) return;
    if (selectedAnimal || !gameStarted || !soundPlayTimeRef.current) return;

    const responseTime = Date.now() - soundPlayTimeRef.current;
    const isCorrect = animalName === currentAnimal?.name;
    
    // 🔹 DEBUG: Verify answer checking logic
    console.log(`🎯 Answer submitted:`, {
      correctAnimal: currentAnimal?.name,
      selectedAnimal: animalName,
      isCorrect,
      currentAnimalObject: currentAnimal,
    });
    
    setSelectedAnimal(animalName);

    // ============================================
    // 📊 UPDATE ATTEMPT TRACKING
    // ============================================
    // Track total attempts across all levels
    const newTotalAttempts = totalAttempts + 1;
    setTotalAttempts(newTotalAttempts);
    
    // Track level-specific attempts
    setLevelAttemptCounts(prev => ({
      ...prev,
      [currentLevel]: prev[currentLevel] + 1
    }));

    // ENHANCEMENT: Track level statistics
    const newStats = {
      attempts: levelStats.attempts + 1,
      correct: levelStats.correct + (isCorrect ? 1 : 0),
      accuracy: 0,
    };
    newStats.accuracy = newStats.correct / newStats.attempts;
    setLevelStats(newStats);

    if (currentAnimal) {
      const gameDuration = (Date.now() - sessionStartTimeRef.current) / 1000;
      
      // ENHANCEMENT: Include level in recorded attempt
      const result = await gameService.recordAttempt({
        animalShown: currentAnimal.name,
        animalSelected: animalName,
        isCorrect,
        responseTimeMs: responseTime,
        attemptNumber: newTotalAttempts, // Use total attempts
        totalScore: isCorrect ? score + 1 : score,
        gameDurationSec: gameDuration,
        level: currentLevel,
        isSessionFailed: sessionFailed,
      });

      console.log('📊 Record result:', {
        totalAttemptCount: newTotalAttempts,
        levelAttempts: levelAttemptCounts[currentLevel] + 1,
        canPredict: result.canPredict,
        level: currentLevel,
        levelStats: newStats,
      });

      // 🔹 FIX: Use backend's canPredict directly instead of local calculation
      // The backend correctly determines when prediction should be available
      if (result.canPredict && shouldShowPredictionUI()) {
        console.log('✅ Enabling assessment button!');
        setCanPredict(true);
      }

      // Check for level change (adaptive learning)
      checkAndUpdateLevel(newStats);
    }

    if (isCorrect) {
      // ============================================
      // ✅ CORRECT ANSWER
      // ============================================
      setConsecutiveWrongAnswers(0);
      setScore((prev) => prev + 1);
      setShowConfetti(true);
      toast({
        title: "🎉 Awesome!",
        description: `Correct! Response time: ${(responseTime / 1000).toFixed(2)}s`,
      });

      setTimeout(() => {
        // Check if level is complete (3+ correct answers)
        if (newStats.correct >= 3 && levelAttemptCounts[currentLevel] >= 3) {
          handleLevelCompletion();
        } else {
          setShowConfetti(false);
          selectRandomAnimal();
          soundPlayTimeRef.current = null;
        }
      }, 2000);
    } else {
      // ============================================
      // ❌ WRONG ANSWER - FAILURE HANDLING
      // ============================================
      const newConsecutiveWrong = consecutiveWrongAnswers + 1;
      setConsecutiveWrongAnswers(newConsecutiveWrong);
      
      // ENHANCEMENT: Show wrong animal feedback
      setWrongAnimalShown(animalName);
      
      // Check if child failed on this question (3+ consecutive wrong)
      if (newConsecutiveWrong >= 3) {
        // Mark level as failed
        setFailedLevels(prev => ({ ...prev, [currentLevel]: true }));
        setSessionFailed(true);
        setCanPredict(true); // Enable assessment
        
        // Different behavior for different levels
        if (currentLevel === 1) {
          // ENHANCEMENT: Level 1 - Direct redirect to learning
          toast({
            title: "Need More Practice",
            description: "You need more practice. Please go through the learning section again.",
            variant: "destructive",
          });

          setTimeout(() => {
            toast({
              title: "Redirecting",
              description: "Taking you to the learning section...",
            });

            setTimeout(() => {
              navigate('/learn');
            }, 1500);
          }, 1500);
        } else {
          // ENHANCEMENT: Level 2 & 3 - Show early assessment first
          toast({
            title: "Let's Check Progress",
            description: "You need more practice. Let's improve your listening skills.",
            variant: "destructive",
          });

          setTimeout(async () => {
            // Get and show assessment immediately
            setShouldRedirectAfterAssessment(true);
            setShowEarlyAssessment(true);
            const prediction = await gameService.getPrediction();
            if (prediction) {
              setPredictionResult(prediction);
              setShowPrediction(true);
            }
          }, 1500);
        }
      } else {
        toast({
          title: "Oops!",
          description: `The correct answer is ${currentAnimal?.name}. Try again! (${newConsecutiveWrong} wrong)`,
          variant: "destructive",
        });

        setTimeout(() => {
          setSelectedAnimal(null);
          setWrongAnimalShown(null);
        }, 1500);
      }
    }
  };

  // ============================================
  // 🎯 LEVEL COMPLETION HANDLER (NEW)
  // ============================================
  const handleLevelCompletion = () => {
    const accuracy = levelStats.correct / levelStats.attempts;
    
    // Mark level as completed
    setCompletedLevels(prev => ({ ...prev, [currentLevel]: true }));
    
    if (currentLevel === 3) {
      // ============================================
      // 🏆 ALL LEVELS COMPLETED
      // ============================================
      setSessionCompleted(true);
      setCanPredict(true);
      
      toast({
        title: "🏆 Session Complete!",
        description: "You've completed all levels! Click 'Get Assessment' to view your results.",
        variant: "default",
      });

      setShowConfetti(false);
      return;
    }

    // ============================================
    // 📈 PROGRESS TO NEXT LEVEL
    // ============================================
    const nextLevel = (currentLevel + 1) as 1 | 2 | 3;
    const message = `🎉 Level ${currentLevel} complete! Accuracy: ${(accuracy * 100).toFixed(1)}%. Moving to Level ${nextLevel}!`;
    
    setLevelChangeMessage(message);
    setShowLevelChange(true);
    
    toast({
      title: "Level Complete! 📈",
      description: message,
    });

    // Switch to next level
    setTimeout(() => {
      setShowLevelChange(false);
      setCurrentLevel(nextLevel);
      const allLevelAnimals = getAnimalsByLevel(nextLevel);
      const playableAnimals = allLevelAnimals.filter(animal => !animal.isMissingAssets);
      setLevelAnimals(playableAnimals);
      
      // Reset level stats for new level
      setLevelStats({ attempts: 0, correct: 0, accuracy: 0 });
      setConsecutiveWrongAnswers(0);
      setShowConfetti(false);
      selectRandomAnimal();
      soundPlayTimeRef.current = null;
    }, 2500);
  };

  const resetGame = () => {
    setScore(0);
    setGameStarted(false);
    setCanPredict(false);
    setPredictionResult(null);
    setShowPrediction(false);
    setLevelStats({ attempts: 0, correct: 0, accuracy: 0 });
    setWrongAnimalShown(null);
    setConsecutiveWrongAnswers(0);
    // 🔹 FIX: Reset total attempts to 0 for new game
    setTotalAttempts(0);
    // ENHANCEMENT: Reset level tracking
    setLevelAttemptCounts({ 1: 0, 2: 0, 3: 0 });
    setFailedLevels({ 1: false, 2: false, 3: false });
    setCompletedLevels({ 1: false, 2: false, 3: false });
    setSessionFailed(false);
    setSessionCompleted(false);
    setShowEarlyAssessment(false);
    setShouldRedirectAfterAssessment(false);
    // 🔹 FIX: Reset ref for sound randomization tracking
    lastAnimalNameRef.current = null;
    setCurrentLevel(1); // Reset to Level 1
    sessionStartTimeRef.current = Date.now();
    soundPlayTimeRef.current = null;
    gameService.reset();
    // FIX: Redirect to Learning Module after resetting game state
    navigate('/learn');
  };

  const handleGetPrediction = async () => {
    // ============================================
    // 🔴 ASSESSMENT AVAILABILITY CHECK
    // ============================================
    const allLevelsCompleted = completedLevels[1] && completedLevels[2] && completedLevels[3];
    
    if (!canPredict || (!allLevelsCompleted && !sessionFailed)) {
      toast({
        title: "Not Ready",
        description: sessionFailed 
          ? "Click to view your assessment results"
          : "Complete all levels or the system will assess you if you need more practice",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingPrediction(true);

    try {
      const prediction = await gameService.getPrediction();

      if (prediction) {
        setPredictionResult(prediction);
        setShowPrediction(true);
        
        // Store latest session data for progress dashboard
        const latestSession = {
          accuracy: levelStats.accuracy,
          averageReactionTime: 0, // Not available
          levelReached: currentLevel,
          weakAnimals: [], // Not tracked
          date: new Date().toISOString().split('T')[0],
          totalAttempts: levelStats.attempts,
          prediction: prediction.risk_level
        };
        localStorage.setItem('latestSession', JSON.stringify(latestSession));
      } else {
        toast({
          title: "Error",
          description: "Could not get prediction. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error getting prediction:', error);
      toast({
        title: "Error",
        description: "Failed to get prediction",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPrediction(false);
    }
  };

  useEffect(() => {
    if (levelAnimals.length > 0) {
      selectRandomAnimal();
    }
  }, [levelAnimals, selectRandomAnimal]);

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW':
        return 'bg-green-500 hover:bg-green-600';
      case 'MODERATE':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'HIGH':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20 p-4 sm:p-8">
      <Confetti show={showConfetti} />
      
      <div className="w-full text-right mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate("/learn")}>Learn sounds first</Button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Mode Indicator */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 flex justify-between items-center flex-wrap gap-2"
        >
          <Badge variant="outline" className="text-sm px-4 py-2">
            <Info className="w-4 h-4 mr-2" />
            {getModeDescription()}
          </Badge>
          
          {/* ENHANCEMENT: Display current level */}
          {gameConfig.enableDifficultyLevels && (
            <Badge className="bg-purple-600 text-white px-4 py-2">
              {getLevelDescription(currentLevel)}
            </Badge>
          )}
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-6xl font-black text-foreground mb-4 tracking-tight">
            🎵 Animal Sounds Game 🎵
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/70 mb-6">
            Listen to the sound and tap the correct animal!
          </p>
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              onClick={playSound}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xl px-8 py-6 rounded-2xl shadow-lg"
            >
              <Volume2 className="mr-2 h-6 w-6" />
              Play Sound
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={resetGame}
              className="text-xl px-8 py-6 rounded-2xl border-2"
            >
              <RotateCcw className="mr-2 h-6 w-6" />
              Reset
            </Button>
            
            <div className="bg-card px-8 py-4 rounded-2xl shadow-lg border-4 border-secondary">
              <span className="text-3xl font-bold text-foreground">
                Score: {score}
              </span>
            </div>

            {shouldShowPredictionUI() && (
              <Button
                size="lg"
                onClick={handleGetPrediction}
                disabled={!canPredict || isLoadingPrediction}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xl px-8 py-6 rounded-2xl shadow-lg disabled:opacity-50"
              >
                <Brain className="mr-2 h-6 w-6" />
                {isLoadingPrediction ? 'Analyzing...' : 'Get Assessment'}
              </Button>
            )}
          </div>

          {/* ENHANCEMENT: Display level statistics and adaptive learning feedback */}
          <div className="mt-6 space-y-2">
            <div className="text-sm text-foreground/70 space-y-1">
              <p>Attempts: {totalAttempts} | Level Attempts: {levelStats.attempts}</p>
              
              {/* ENHANCEMENT: Show attempt limit status per level */}
              <p className="text-xs font-semibold">
                Level {currentLevel} Progress: {levelAttemptCounts[currentLevel]}/{MAX_ATTEMPTS_PER_LEVEL} attempts
                {levelAttemptCounts[currentLevel] >= MAX_ATTEMPTS_PER_LEVEL && (
                  <span className="text-red-600 ml-2">⚠️ Limit reached</span>
                )}
              </p>
              
              {levelStats.attempts > 0 && (
                <p>
                  Level Accuracy: <span className="font-semibold text-blue-600">
                    {(levelStats.accuracy * 100).toFixed(1)}%
                  </span> ({levelStats.correct}/{levelStats.attempts})
                </p>
              )}
              
              {/* ENHANCEMENT: Show assessment availability */}
              {shouldShowPredictionUI() && (
                <p>
                  {sessionFailed ? (
                    <span className="text-red-600 font-semibold">⚠️ Assessment ready - more practice needed</span>
                  ) : sessionCompleted ? (
                    <span className="text-green-600 font-semibold">✅ Assessment ready - all levels completed!</span>
                  ) : (
                    <span>Complete all levels for assessment or more practice may be suggested</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* ENHANCEMENT: Show level change notification */}
          <AnimatePresence>
            {showLevelChange && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="mt-4 p-4 bg-blue-100 border-2 border-blue-500 rounded-lg"
              >
                <p className="text-lg font-bold text-blue-900">{levelChangeMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ENHANCEMENT: Animals grid with difficulty level animals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {levelAnimals.map((animal, index) => (
            <motion.div
              key={animal.name}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1 * index, type: "spring" }}
            >
              <AnimalCard
                name={animal.name}
                image={animal.image}
                onClick={() => handleAnimalClick(animal.name)}
                isCorrect={
                  selectedAnimal === animal.name &&
                  selectedAnimal === currentAnimal?.name
                }
                isWrong={
                  selectedAnimal === animal.name &&
                  selectedAnimal !== currentAnimal?.name
                }
                disabled={selectedAnimal !== null || levelAttemptCounts[currentLevel] >= MAX_ATTEMPTS_PER_LEVEL}
              />
              
              {/* ENHANCEMENT: Show correct answer feedback */}
              {wrongAnimalShown && currentAnimal && animal.name === currentAnimal.name && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-2 text-sm font-bold text-green-600"
                >
                  ✅ Correct!
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {!gameStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <p className="text-2xl text-foreground/60 font-semibold">
              👆 Click "Play Sound" to start!
            </p>
          </motion.div>
        )}

        {/* ENHANCEMENT: Show attempt limit reached message */}
        <AnimatePresence>
          {levelAttemptCounts[currentLevel] >= MAX_ATTEMPTS_PER_LEVEL && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 p-6 bg-red-50 dark:bg-red-950 border-2 border-red-500 rounded-lg text-center"
            >
              <p className="text-lg font-bold text-red-700 dark:text-red-300">
                ⚠️ Maximum Attempts Reached for Level {currentLevel}
              </p>
              <p className="text-red-600 dark:text-red-400 mt-2">
                You've completed {MAX_ATTEMPTS_PER_LEVEL} attempts on this level. Please click "Get Assessment" to view your results or go to the learning section for more practice.
              </p>
              <Button
                onClick={() => navigate('/learn')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Go to Learning Section
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prediction Results Modal */}
        <AnimatePresence>
          {showPrediction && predictionResult && (
            <Dialog
              open={showPrediction}
              onOpenChange={(open) => {
                setShowPrediction(open);
                if (!open) {
                  resetGame();
                }
              }}
            >
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl mb-4">
                    {predictionResult.recommendation.title}
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getRiskBadgeColor(predictionResult.risk_level)} text-white px-4 py-2 text-sm`}>
                          Risk Level: {predictionResult.risk_level}
                        </Badge>
                        <Badge variant="outline" className="px-4 py-2 text-sm">
                          Confidence: {predictionResult.confidence}
                        </Badge>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Analysis Results</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>Auditory Response Difficulty Probability:</strong>{' '}
                            {(predictionResult.probability.disability * 100).toFixed(1)}%
                          </p>
                          <p>
                            <strong>Normal Auditory Response Probability:</strong>{' '}
                            {(predictionResult.probability.normal * 100).toFixed(1)}%
                          </p>
                          <p>
                            <strong>Total Attempts Analyzed:</strong>{' '}
                            {predictionResult.total_attempts}
                          </p>
                          {/* ENHANCEMENT: Show level progression */}
                          {predictionResult.features.max_level_reached && (
                            <>
                              <p>
                                <strong>Maximum Level Reached:</strong>{' '}
                                Level {predictionResult.features.max_level_reached}
                              </p>
                              <p>
                                <strong>Level Progression:</strong>{' '}
                                {predictionResult.features.level_progression}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* ENHANCEMENT: Show weak animals if any */}
                      {predictionResult.features.weak_animals && predictionResult.features.weak_animals.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                          <h4 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">Animals Needing Practice:</h4>
                          <ul className="space-y-1 text-sm">
                            {predictionResult.features.weak_animals.map((animal, idx) => (
                              <li key={idx} className="text-amber-800 dark:text-amber-200">
                                🎯 <strong>{animal.animal}</strong>: {animal.accuracy}% accuracy ({animal.correct}/{animal.attempts} correct)
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm">{predictionResult.recommendation.message}</p>
                        <p className="text-sm mt-2 italic">{predictionResult.recommendation.suggestion}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Key Indicators:</h4>
                        <ul className="space-y-1 text-sm">
                          {predictionResult.recommendation.key_indicators.map((indicator, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{indicator}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Recommended Next Steps:</h4>
                        <ol className="space-y-1 text-sm">
                          {predictionResult.recommendation.next_steps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="font-semibold text-blue-500">{idx + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => {
                            setShowPrediction(false);
                            // FIX: Close button redirects to Learning Module if early assessment
                            if (shouldRedirectAfterAssessment) {
                              navigate('/learn');
                            }
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          Close
                        </Button>
                        <Button
                          onClick={() => {
                            setShowPrediction(false);
                            // FIX: Start New Game/Go to Learning redirects to Learning Module
                            navigate('/learn');
                          }}
                          className="flex-1"
                        >
                          {shouldRedirectAfterAssessment ? "Go to Learning" : "Start New Game"}
                        </Button>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;