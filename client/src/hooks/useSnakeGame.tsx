import { useEffect, useRef } from 'react';
import { useSnakeGame as useSnakeGameStore } from '../lib/stores/useSnakeGame';

/**
 * Custom hook for Snake game functionality
 * Provides game logic and utilities for the Snake game component
 */
export const useSnakeGame = () => {
  const store = useSnakeGameStore();
  const lastUpdateRef = useRef<number>(0);
  
  // Game loop timing control
  const shouldUpdate = (currentTime: number, interval: number = 125): boolean => {
    if (currentTime - lastUpdateRef.current >= interval) {
      lastUpdateRef.current = currentTime;
      return true;
    }
    return false;
  };
  
  // Auto-save high score when game ends
  useEffect(() => {
    if (store.gameState === 'ended' && store.score > store.highScore) {
      console.log('New high score achieved:', store.score);
    }
  }, [store.gameState, store.score, store.highScore]);
  
  // Log game state changes for debugging
  useEffect(() => {
    console.log('Game state changed to:', store.gameState);
  }, [store.gameState]);
  
  return {
    ...store,
    shouldUpdate,
    
    // Additional utility methods
    getGameStats: () => ({
      snakeLength: store.snake.length,
      foodPosition: store.food,
      currentDirection: store.direction,
      isGameActive: store.gameState === 'playing'
    }),
    
    // Check if new high score
    isNewHighScore: () => store.score > 0 && store.score === store.highScore,
    
    // Get game progress (snake length as percentage of grid)
    getProgress: () => {
      const maxPossibleLength = 20 * 20; // Grid size
      return (store.snake.length / maxPossibleLength) * 100;
    }
  };
};
