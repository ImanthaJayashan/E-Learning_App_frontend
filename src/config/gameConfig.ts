/**
 * 🎮 Game Configuration
 *
 * Both services now run on a single Hugging Face Space.
 * Just update HF_SPACE_URL below if your space name changes.
 */

export type GameMode = 'DATA_COLLECTION' | 'PREDICTION' | 'BOTH';

export interface AdaptiveLearningRules {
  highAccuracyThreshold: number;
  mediumAccuracyThreshold: number;
  lowAccuracyThreshold: number;
  minAttemptsPerLevel: number;
}

interface GameConfig {
  mode: GameMode;
  appApiUrl: string;
  predictionApiUrl: string;
  minAttemptsForPrediction: number;
  enablePredictionUI: boolean;
  currentLevel: 1 | 2 | 3;
  enableDifficultyLevels: boolean;
  enableAdaptiveLearning: boolean;
  adaptiveLearningRules: AdaptiveLearningRules;
}

// ============================================
// 🌐 CHANGE THIS TO YOUR HF SPACE URL
// ============================================
const HF_SPACE_URL = 'https://yasithadulara-animal-sound-safari-backend.hf.space';

export const gameConfig: GameConfig = {
  // 'DATA_COLLECTION' | 'PREDICTION' | 'BOTH'
  mode: 'BOTH',

  // Both endpoints live on the same HF Space now
  appApiUrl: `${HF_SPACE_URL}/api/analytics`,
  predictionApiUrl: `${HF_SPACE_URL}/api/predict`,

  minAttemptsForPrediction: 5,
  enablePredictionUI: false, // auto-set below

  currentLevel: 1,
  enableDifficultyLevels: true,
  enableAdaptiveLearning: true,

  adaptiveLearningRules: {
    highAccuracyThreshold: 0.75,
    mediumAccuracyThreshold: 0.50,
    lowAccuracyThreshold: 0.50,
    minAttemptsPerLevel: 5,
  },
};

if (gameConfig.mode === 'PREDICTION' || gameConfig.mode === 'BOTH') {
  gameConfig.enablePredictionUI = true;
}

export const shouldCallAppAPI = (): boolean =>
  gameConfig.mode === 'DATA_COLLECTION' || gameConfig.mode === 'BOTH';

export const shouldCallPredictionAPI = (): boolean =>
  gameConfig.mode === 'PREDICTION' || gameConfig.mode === 'BOTH';

export const shouldShowPredictionUI = (): boolean =>
  gameConfig.enablePredictionUI;

export const getModeDescription = (): string => {
  switch (gameConfig.mode) {
    case 'DATA_COLLECTION': return '📊 Data Collection Mode';
    case 'PREDICTION':      return '🔮 Prediction Mode';
    case 'BOTH':            return '🚀 Full Mode - Storage + Predictions';
    default:                return 'Unknown mode';
  }
};

export const logConfig = (): void => {
  console.log('='.repeat(60));
  console.log('🎮 GAME CONFIGURATION');
  console.log('='.repeat(60));
  console.log(`Mode:           ${gameConfig.mode}`);
  console.log(`Analytics URL:  ${gameConfig.appApiUrl}`);
  console.log(`Prediction URL: ${gameConfig.predictionApiUrl}`);
  console.log(`Prediction UI:  ${shouldShowPredictionUI()}`);
  console.log('='.repeat(60));
};

export const isAdaptiveLearningEnabled = (): boolean =>
  gameConfig.enableAdaptiveLearning && gameConfig.enableDifficultyLevels;

export const getLevelDescription = (level: 1 | 2 | 3): string => {
  switch (level) {
    case 1: return '🏠 Level 1 - Domestic Animals (Easy)';
    case 2: return '🌳 Level 2 - Mixed Animals (Medium)';
    case 3: return '🦁 Level 3 - Wild Animals (Hard)';
    default: return 'Unknown Level';
  }
};

export const calculateLevelChange = (
  accuracy: number,
  attemptCount: number
): 'increase' | 'decrease' | 'stay' => {
  if (attemptCount < gameConfig.adaptiveLearningRules.minAttemptsPerLevel) return 'stay';
  if (accuracy >= gameConfig.adaptiveLearningRules.highAccuracyThreshold)  return 'increase';
  if (accuracy < gameConfig.adaptiveLearningRules.mediumAccuracyThreshold) return 'decrease';
  return 'stay';
};

export const getNextLevel = (
  currentLevel: 1 | 2 | 3,
  change: 'increase' | 'decrease' | 'stay'
): 1 | 2 | 3 => {
  if (change === 'increase' && currentLevel < 3) return (currentLevel + 1) as 1 | 2 | 3;
  if (change === 'decrease' && currentLevel > 1) return (currentLevel - 1) as 1 | 2 | 3;
  return currentLevel;
};
