/**
 * 🎮 Game Service - Modular API Integration
 * 
 * This service handles all backend communication based on the configured mode.
 * It automatically calls the appropriate APIs based on gameConfig.mode.
 */

import { 
  gameConfig, 
  shouldCallAppAPI, 
  shouldCallPredictionAPI,
  logConfig 
} from '@/config/gameConfig';

// ============================================
// 📊 TYPES
// ============================================

export interface AttemptData {
  animalShown: string;
  animalSelected: string;
  isCorrect: boolean;
  responseTimeMs: number;
  attemptNumber: number;
  totalScore: number;
  gameDurationSec: number;
}

export interface PredictionStats {
  total_attempts: number;
  avg_response_time: number;
  median_response_time: number;
  slow_responses: number;
  accuracy_rate: number;
  can_predict: boolean;
}

export interface PredictionResult {
  success: boolean;
  session_id: string;
  total_attempts: number;
  has_hearing_disability: boolean;
  probability: {
    disability: number;
    normal: number;
  };
  risk_level: 'LOW' | 'MODERATE' | 'HIGH';
  confidence: string;
  features: {
    avg_response_time: number;
    median_response_time: number;
    slow_responses: number;
    accuracy_rate: number;
    total_attempts: number;
  };
  recommendation: {
    level: string;
    title: string;
    message: string;
    suggestion: string;
    key_indicators: string[];
    next_steps: string[];
  };
}

export interface RecordAttemptResult {
  success: boolean;
  attemptCount: number;
  stats?: PredictionStats;
  canPredict: boolean;
  mode: string;
}

// ============================================
// 🎯 GAME SERVICE CLASS
// ============================================

class GameService {
  private sessionId: string;
  private attemptCount: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.attemptCount = 0;
    
    // Log configuration on initialization
    logConfig();
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `session_${timestamp}_${random}`;
  }

  /**
   * 📝 Record attempt to appropriate backend(s)
   * 
   * Behavior based on mode:
   * - DATA_COLLECTION: Calls app.py only
   * - PREDICTION: Calls prediction_api.py only
   * - BOTH: Calls both backends
   */
  async recordAttempt(data: AttemptData): Promise<RecordAttemptResult> {
    this.attemptCount++;

    const results: Promise<any>[] = [];
    let stats: PredictionStats | undefined;

    try {
      // ============================================
      // CALL 1: app.py (if enabled)
      // ============================================
      if (shouldCallAppAPI()) {
        console.log('📊 Recording to app.py (permanent storage)...');
        
        const appPromise = fetch(`${gameConfig.appApiUrl}/log-interaction`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: this.sessionId,
            animal_shown: data.animalShown,
            animal_selected: data.animalSelected,
            is_correct: data.isCorrect,
            response_time_ms: data.responseTimeMs,
            attempt_number: this.attemptCount,
            total_score: data.totalScore,
            game_duration_sec: data.gameDurationSec,
          }),
        });

        results.push(appPromise);
      }

      // ============================================
      // CALL 2: prediction_api.py (if enabled)
      // ============================================
      if (shouldCallPredictionAPI()) {
        console.log('🔮 Recording to prediction_api.py (ML analysis)...');
        
        const predictionPromise = fetch(`${gameConfig.predictionApiUrl}/record`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: this.sessionId,
            animal_shown: data.animalShown,
            animal_selected: data.animalSelected,
            is_correct: data.isCorrect,
            response_time_ms: data.responseTimeMs,
            attempt_number: this.attemptCount,
            total_score: data.totalScore,
            game_duration_sec: data.gameDurationSec,
          }),
        });

        results.push(predictionPromise);
      }

      // Wait for all API calls to complete
      const responses = await Promise.all(results);
      
      // Process responses
      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        const data = await response.json();
        
        if (shouldCallAppAPI() && shouldCallPredictionAPI()) {
          // BOTH mode: first is app.py, second is prediction
          if (i === 0) {
            console.log('✅ app.py response:', data);
          } else {
            console.log('✅ prediction_api.py response:', data);
            console.log('📊 Stats from prediction_api:', data.stats);
            stats = data.stats;
          }
        } else if (shouldCallPredictionAPI()) {
          // PREDICTION mode only
          console.log('✅ prediction_api.py response:', data);
          console.log('📊 Stats from prediction_api:', data.stats);
          stats = data.stats;
        } else {
          // DATA_COLLECTION mode only
          console.log('✅ app.py response:', data);
        }
      }

      console.log('🎯 Final stats:', stats);
      console.log('🎯 Can predict:', stats?.can_predict);

      return {
        success: true,
        attemptCount: this.attemptCount,
        stats,
        canPredict: stats?.can_predict || false,
        mode: gameConfig.mode,
      };

    } catch (error) {
      console.error('❌ Error recording attempt:', error);
      
      // Return partial success - don't break the game
      return {
        success: false,
        attemptCount: this.attemptCount,
        canPredict: false,
        mode: gameConfig.mode,
      };
    }
  }

  /**
   * 🔮 Get prediction from ML model
   * 
   * Only available in PREDICTION or BOTH modes
   */
  async getPrediction(): Promise<PredictionResult | null> {
    if (!shouldCallPredictionAPI()) {
      console.warn('⚠️ Predictions disabled in DATA_COLLECTION mode');
      return null;
    }

    if (this.attemptCount < gameConfig.minAttemptsForPrediction) {
      console.warn(
        `⚠️ Need ${gameConfig.minAttemptsForPrediction} attempts. Current: ${this.attemptCount}`
      );
      return null;
    }

    try {
      console.log('🔮 Requesting prediction...');
      
      const response = await fetch(`${gameConfig.predictionApiUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.sessionId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        console.warn('⚠️ Prediction not ready:', data.message);
        return null;
      }

      console.log('✅ Prediction received:', data);
      return data;

    } catch (error) {
      console.error('❌ Error getting prediction:', error);
      return null;
    }
  }

  /**
   * 📊 Get current session data (for debugging)
   */
  async getSessionData(): Promise<any> {
    if (!shouldCallPredictionAPI()) {
      console.warn('⚠️ Session data only available in PREDICTION mode');
      return null;
    }

    try {
      const response = await fetch(
        `${gameConfig.predictionApiUrl}/session/${this.sessionId}`
      );
      return await response.json();
    } catch (error) {
      console.error('❌ Error getting session data:', error);
      return null;
    }
  }

  /**
   * 🔄 Reset session
   */
  reset(): void {
    this.sessionId = this.generateSessionId();
    this.attemptCount = 0;
    console.log('🔄 Session reset:', this.sessionId);
  }

  /**
   * 📌 Getters
   */
  getSessionId(): string {
    return this.sessionId;
  }

  getAttemptCount(): number {
    return this.attemptCount;
  }

  getCurrentMode(): string {
    return gameConfig.mode;
  }
}

// ============================================
// 🎯 SINGLETON EXPORT
// ============================================

export const gameService = new GameService();
