/**
 * 🎮 Game Configuration
 * 
 * MODULAR DESIGN - Easy to switch between modes:
 * 
 * MODE 1: DATA_COLLECTION (Training phase)
 * - Records all interactions to app.py (port 5000)
 * - Saves to CSV/JSON for future model training
 * - No predictions, just data gathering
 * 
 * MODE 2: PREDICTION (Production phase)
 * - Records to prediction_api.py (port 5001) only
 * - Makes real-time predictions after 5+ attempts
 * - No permanent storage (RAM only)
 * 
 * MODE 3: BOTH (Full system)
 * - Records to BOTH backends
 * - Permanent storage + real-time predictions
 * - Use when you want both features
 */

export type GameMode = 'DATA_COLLECTION' | 'PREDICTION' | 'BOTH';

interface GameConfig {
  // ============================================
  // 🔧 CHANGE THIS TO SWITCH MODES
  // ============================================
  mode: GameMode;
  
  // API endpoints
  appApiUrl: string;           // app.py - Port 5000
  predictionApiUrl: string;    // prediction_api.py - Port 5001
  
  // Prediction settings
  minAttemptsForPrediction: number;
  enablePredictionUI: boolean;
}

// ============================================
// 📝 CONFIGURATION
// ============================================
export const gameConfig: GameConfig = {
  /**
   * 🎯 SELECT YOUR MODE HERE:
   * 
   * 'DATA_COLLECTION' - Use when collecting training data
   *   ✅ Calls app.py only
   *   ✅ Records to CSV/JSON
   *   ❌ No predictions
   *   ❌ No prediction button
   * 
   * 'PREDICTION' - Use after model is trained
   *   ❌ No permanent storage
   *   ✅ Calls prediction_api.py only
   *   ✅ Real-time predictions
   *   ✅ Shows prediction button
   * 
   * 'BOTH' - Use for full system
   *   ✅ Calls BOTH app.py and prediction_api.py
   *   ✅ Permanent storage + predictions
   *   ✅ Full features enabled
   */
  mode: 'BOTH', // 👈 CHANGE THIS!
  
  // Backend URLs
  appApiUrl: 'http://localhost:5000/api',
  predictionApiUrl: 'http://localhost:5001/api/predict',
  
  // Prediction settings
  minAttemptsForPrediction: 5,
  enablePredictionUI: false, // Auto-set based on mode
};

// Auto-configure UI based on mode
if (gameConfig.mode === 'PREDICTION' || gameConfig.mode === 'BOTH') {
  gameConfig.enablePredictionUI = true;
}

// ============================================
// 🔍 HELPER FUNCTIONS
// ============================================

/**
 * Check if we should call app.py
 */
export const shouldCallAppAPI = (): boolean => {
  return gameConfig.mode === 'DATA_COLLECTION' || gameConfig.mode === 'BOTH';
};

/**
 * Check if we should call prediction_api.py
 */
export const shouldCallPredictionAPI = (): boolean => {
  return gameConfig.mode === 'PREDICTION' || gameConfig.mode === 'BOTH';
};

/**
 * Check if prediction UI should be shown
 */
export const shouldShowPredictionUI = (): boolean => {
  return gameConfig.enablePredictionUI;
};

/**
 * Get active mode description
 */
export const getModeDescription = (): string => {
  switch (gameConfig.mode) {
    case 'DATA_COLLECTION':
      return '📊 Data Collection Mode - Recording to CSV/JSON';
    case 'PREDICTION':
      return '🔮 Prediction Mode - Real-time ML predictions';
    case 'BOTH':
      return '🚀 Full Mode - Storage + Predictions';
    default:
      return 'Unknown mode';
  }
};

/**
 * Log current configuration (for debugging)
 */
export const logConfig = (): void => {
  console.log('='.repeat(60));
  console.log('🎮 GAME CONFIGURATION');
  console.log('='.repeat(60));
  console.log(`Mode: ${gameConfig.mode}`);
  console.log(`Description: ${getModeDescription()}`);
  console.log(`Call app.py: ${shouldCallAppAPI()}`);
  console.log(`Call prediction_api.py: ${shouldCallPredictionAPI()}`);
  console.log(`Show prediction UI: ${shouldShowPredictionUI()}`);
  console.log('='.repeat(60));
};
