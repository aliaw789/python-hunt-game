import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Game types
interface Position {
  x: number;
  y: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';
type GameState = 'ready' | 'playing' | 'ended';

interface GameResult {
  ateFood?: boolean;
  gameOver?: boolean;
}

interface SnakeGameState {
  // Game state
  gameState: GameState;
  snake: Position[];
  food: Position | null;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  
  // Game actions
  startGame: () => void;
  resetGame: () => void;
  changeDirection: (newDirection: Direction) => void;
  updateGame: () => GameResult | null;
}

// Game constants
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = 'right';

// Helper functions
const getRandomFood = (snake: Position[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT)
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
};

const isOppositeDirection = (dir1: Direction, dir2: Direction): boolean => {
  const opposites: { [key in Direction]: Direction } = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  };
  return opposites[dir1] === dir2;
};

const moveSnake = (snake: Position[], direction: Direction): Position[] => {
  const head = { ...snake[0] };
  
  switch (direction) {
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'right':
      head.x += 1;
      break;
  }
  
  return [head, ...snake];
};

const checkCollision = (head: Position, snake: Position[]): boolean => {
  // Check wall collision
  if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
    return true;
  }
  
  // Check self collision (skip head)
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
};

// Load high score from localStorage
const getStoredHighScore = (): number => {
  try {
    const stored = localStorage.getItem('snake-high-score');
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
};

// Save high score to localStorage
const saveHighScore = (score: number): void => {
  try {
    localStorage.setItem('snake-high-score', score.toString());
  } catch {
    // Silently fail if localStorage is not available
  }
};

export const useSnakeGame = create<SnakeGameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gameState: 'ready',
    snake: INITIAL_SNAKE,
    food: null,
    direction: INITIAL_DIRECTION,
    nextDirection: INITIAL_DIRECTION,
    score: 0,
    highScore: getStoredHighScore(),
    
    startGame: () => {
      const initialSnake = INITIAL_SNAKE;
      set({
        gameState: 'playing',
        snake: initialSnake,
        food: getRandomFood(initialSnake),
        direction: INITIAL_DIRECTION,
        nextDirection: INITIAL_DIRECTION,
        score: 0
      });
      console.log('Game started');
    },
    
    resetGame: () => {
      const { score, highScore } = get();
      const newHighScore = Math.max(score, highScore);
      
      if (newHighScore > highScore) {
        saveHighScore(newHighScore);
      }
      
      set({
        gameState: 'ready',
        snake: INITIAL_SNAKE,
        food: null,
        direction: INITIAL_DIRECTION,
        nextDirection: INITIAL_DIRECTION,
        score: 0,
        highScore: newHighScore
      });
      console.log('Game reset');
    },
    
    changeDirection: (newDirection: Direction) => {
      const { direction, gameState } = get();
      
      if (gameState !== 'playing') return;
      
      // Prevent reversing into self
      if (!isOppositeDirection(direction, newDirection)) {
        set({ nextDirection: newDirection });
        console.log('Direction changed to:', newDirection);
      }
    },
    
    updateGame: (): GameResult | null => {
      const { gameState, snake, food, direction, nextDirection, score } = get();
      
      if (gameState !== 'playing') return null;
      
      // Update direction
      const currentDirection = nextDirection;
      const newSnake = moveSnake(snake, currentDirection);
      const head = newSnake[0];
      
      // Check collisions
      if (checkCollision(head, snake)) {
        set({ 
          gameState: 'ended',
          direction: currentDirection 
        });
        console.log('Game over - collision detected');
        return { gameOver: true };
      }
      
      // Check food collision
      let ateFood = false;
      let newFood = food;
      let newScore = score;
      
      if (food && head.x === food.x && head.y === food.y) {
        // Ate food - don't remove tail
        ateFood = true;
        newScore = score + 10;
        newFood = getRandomFood(newSnake);
        console.log('Food eaten! Score:', newScore);
      } else {
        // Normal move - remove tail
        newSnake.pop();
      }
      
      set({
        snake: newSnake,
        food: newFood,
        direction: currentDirection,
        score: newScore
      });
      
      return ateFood ? { ateFood: true } : null;
    }
  }))
);
