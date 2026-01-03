import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimalCard } from "@/components/AnimalCard";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { Volume2, RotateCcw, Brain, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { gameService, PredictionResult } from "@/services/gameService";
import { 
  gameConfig, 
  shouldShowPredictionUI, 
  getModeDescription 
} from "@/config/gameConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import dogImage from "@/assets/dog.png";
import catImage from "@/assets/cat.png";
import cowImage from "@/assets/cow.png";
import lionImage from "@/assets/lion.png";

interface Animal {
  name: string;
  image: string;
  sound: string;
}

const animals: Animal[] = [
  { name: "dog", image: dogImage, sound: "Woof! Woof!" },
  { name: "cat", image: catImage, sound: "Meow! Meow!" },
  { name: "cow", image: cowImage, sound: "Moo! Moo!" },
  { name: "lion", image: lionImage, sound: "Roar! Roar!" },
];

const Index = () => {
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
  
  const soundPlayTimeRef = useRef<number | null>(null);
  const sessionStartTimeRef = useRef<number>(Date.now());

  const selectRandomAnimal = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * animals.length);
    setCurrentAnimal(animals[randomIndex]);
    setSelectedAnimal(null);
  }, []);

  const playSound = () => {
    if (currentAnimal) {
      // Record the time when sound is played
      soundPlayTimeRef.current = Date.now();
      
      // Using speech synthesis for animal sounds
      const utterance = new SpeechSynthesisUtterance(currentAnimal.sound);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
      
      if (!gameStarted) {
        setGameStarted(true);
        sessionStartTimeRef.current = Date.now();
      }
    }
  };

  const handleAnimalClick = async (animalName: string) => {
    if (selectedAnimal || !gameStarted || !soundPlayTimeRef.current) return;

    // Calculate response time
    const responseTime = Date.now() - soundPlayTimeRef.current;
    const isCorrect = animalName === currentAnimal?.name;
    
    setSelectedAnimal(animalName);

    // Record attempt using modular service
    if (currentAnimal) {
      const gameDuration = (Date.now() - sessionStartTimeRef.current) / 1000;
      
      const result = await gameService.recordAttempt({
        animalShown: currentAnimal.name,
        animalSelected: animalName,
        isCorrect,
        responseTimeMs: responseTime,
        attemptNumber: gameService.getAttemptCount() + 1,
        totalScore: isCorrect ? score + 1 : score,
        gameDurationSec: gameDuration,
      });

      // Debug logging
      console.log('📊 Record result:', {
        attemptCount: result.attemptCount,
        canPredict: result.canPredict,
        stats: result.stats,
        showPredictionUI: shouldShowPredictionUI()
      });

      // Update prediction availability - check both API response AND attempt count
      const shouldEnable = (result.canPredict && shouldShowPredictionUI()) || 
                          (result.attemptCount >= gameConfig.minAttemptsForPrediction && shouldShowPredictionUI());
      
      if (shouldEnable) {
        console.log('✅ Enabling prediction button!');
        setCanPredict(true);
      } else {
        console.log('⏳ Not ready yet. Attempts:', result.attemptCount, 'Can predict:', result.canPredict);
      }
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setShowConfetti(true);
      toast({
        title: "🎉 Awesome!",
        description: `Correct! Response time: ${(responseTime / 1000).toFixed(2)}s`,
      });

      setTimeout(() => {
        setShowConfetti(false);
        selectRandomAnimal();
        soundPlayTimeRef.current = null;
      }, 2000);
    } else {
      toast({
        title: "Oops!",
        description: "Try again!",
        variant: "destructive",
      });

      setTimeout(() => {
        setSelectedAnimal(null);
      }, 1500);
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameStarted(false);
    setCanPredict(false);
    setPredictionResult(null);
    setShowPrediction(false);
    sessionStartTimeRef.current = Date.now();
    soundPlayTimeRef.current = null;
    gameService.reset();
    selectRandomAnimal();
  };

  const handleGetPrediction = async () => {
    if (!canPredict) {
      toast({
        title: "Not Ready",
        description: `Need at least ${gameConfig.minAttemptsForPrediction} attempts`,
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
    selectRandomAnimal();
  }, [selectRandomAnimal]);

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
      
      <div className="max-w-6xl mx-auto">
        {/* Mode Indicator */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4"
        >
          <Badge variant="outline" className="text-sm px-4 py-2">
            <Info className="w-4 h-4 mr-2" />
            {getModeDescription()}
          </Badge>
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-8 py-6 rounded-2xl shadow-lg"
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

            {/* Prediction Button (only shows in PREDICTION or BOTH modes) */}
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

          {/* Analytics info display */}
          <div className="mt-4 text-sm text-foreground/50 space-y-1">
            <p>Session: {gameService.getSessionId().slice(-8)} | Attempts: {gameService.getAttemptCount()}</p>
            {shouldShowPredictionUI() && (
              <p>
                {canPredict ? (
                  <span className="text-green-600 font-semibold">✅ Ready for prediction!</span>
                ) : (
                  <span>Need {gameConfig.minAttemptsForPrediction - gameService.getAttemptCount()} more attempts for prediction</span>
                )}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {animals.map((animal, index) => (
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
                disabled={selectedAnimal !== null}
              />
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

        {/* Prediction Results Modal */}
        <AnimatePresence>
          {showPrediction && predictionResult && (
            <Dialog open={showPrediction} onOpenChange={setShowPrediction}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl mb-4">
                    {predictionResult.recommendation.title}
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="space-y-4">
                      {/* Risk Badge */}
                      <div className="flex items-center gap-2">
                        <Badge className={`${getRiskBadgeColor(predictionResult.risk_level)} text-white px-4 py-2 text-sm`}>
                          Risk Level: {predictionResult.risk_level}
                        </Badge>
                        <Badge variant="outline" className="px-4 py-2 text-sm">
                          Confidence: {predictionResult.confidence}
                        </Badge>
                      </div>

                      {/* Probability */}
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Analysis Results</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>Hearing Difficulty Probability:</strong>{' '}
                            {(predictionResult.probability.disability * 100).toFixed(1)}%
                          </p>
                          <p>
                            <strong>Normal Hearing Probability:</strong>{' '}
                            {(predictionResult.probability.normal * 100).toFixed(1)}%
                          </p>
                          <p>
                            <strong>Total Attempts Analyzed:</strong>{' '}
                            {predictionResult.total_attempts}
                          </p>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm">{predictionResult.recommendation.message}</p>
                        <p className="text-sm mt-2 italic">{predictionResult.recommendation.suggestion}</p>
                      </div>

                      {/* Key Indicators */}
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

                      {/* Next Steps */}
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

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => setShowPrediction(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Close
                        </Button>
                        <Button
                          onClick={() => {
                            setShowPrediction(false);
                            resetGame();
                          }}
                          className="flex-1"
                        >
                          Start New Game
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