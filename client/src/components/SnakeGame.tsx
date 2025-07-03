import React, { useRef, useEffect, useCallback } from 'react';
import { useSnakeGame } from '../lib/stores/useSnakeGame';
import { useAudio } from '../lib/stores/useAudio';
import GameUI from './GameUI';
import GameControls from './GameControls';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const GRID_SIZE = 25;
const GRID_WIDTH = CANVAS_WIDTH / GRID_SIZE;
const GRID_HEIGHT = CANVAS_HEIGHT / GRID_SIZE;

// Colors for modern design
const COLORS = {
  background: '#1a1a2e',
  grid: '#16213e',
  snake: '#0f3460',
  snakeHead: '#e94560',
  food: '#f39c12',
  text: '#ffffff',
  border: '#e94560'
};

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  const {
    snake,
    food,
    direction,
    gameState,
    score,
    highScore,
    changeDirection,
    resetGame,
    startGame,
    updateGame
  } = useSnakeGame();

  const { playHit, playSuccess } = useAudio();

  // Draw game elements
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear canvas with background color
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid lines for better visual feedback
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? COLORS.snakeHead : COLORS.snake;
      
      // Add rounded corners for modern look
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;
      const radius = 4;
      
      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2, radius);
      ctx.fill();
      
      // Add subtle border for the head
      if (isHead) {
        ctx.strokeStyle = COLORS.border;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw food with pulsing effect
    if (food) {
      const time = Date.now() * 0.005;
      const pulse = Math.sin(time) * 0.1 + 1;
      const size = (GRID_SIZE - 4) * pulse;
      const offset = (GRID_SIZE - size) / 2;
      
      ctx.fillStyle = COLORS.food;
      ctx.beginPath();
      ctx.roundRect(
        food.x * GRID_SIZE + offset,
        food.y * GRID_SIZE + offset,
        size,
        size,
        size / 4
      );
      ctx.fill();
      
      // Add glow effect
      ctx.shadowColor = COLORS.food;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [snake, food]);

  // Game loop
  const gameLoop = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;
    
    // Update game at 5 FPS for slower, more comfortable gameplay
    if (deltaTime >= 200) {
      if (gameState === 'playing') {
        const result = updateGame();
        
        // Play sounds based on game events
        if (result?.ateFood) {
          playSuccess();
        } else if (result?.gameOver) {
          playHit();
        }
      }
      lastTimeRef.current = currentTime;
    }

    // Draw game
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      draw(ctx);
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, updateGame, draw, playHit, playSuccess]);

  // Handle keyboard input
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState === 'ready' || gameState === 'ended') {
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        if (gameState === 'ready') {
          startGame();
        } else {
          resetGame();
        }
        return;
      }
    }

    if (gameState === 'playing') {
      const keyMap: { [key: string]: string } = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'KeyW': 'up',
        'KeyS': 'down',
        'KeyA': 'left',
        'KeyD': 'right'
      };

      const newDirection = keyMap[event.code];
      if (newDirection) {
        event.preventDefault();
        changeDirection(newDirection as 'up' | 'down' | 'left' | 'right');
      }
    }
  }, [gameState, startGame, resetGame, changeDirection]);

  // Handle touch controls for mobile
  const handleTouchStart = useCallback((event: TouchEvent) => {
    event.preventDefault();
    
    if (gameState === 'ready' || gameState === 'ended') {
      if (gameState === 'ready') {
        startGame();
      } else {
        resetGame();
      }
      return;
    }

    if (gameState === 'playing' && event.touches.length === 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const touch = event.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      
      // Determine direction based on which axis has greater change
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        changeDirection(deltaX > 0 ? 'right' : 'left');
      } else {
        changeDirection(deltaY > 0 ? 'down' : 'up');
      }
    }
  }, [gameState, startGame, resetGame, changeDirection]);

  // Setup event listeners and game loop
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.style.touchAction = 'none';
    }

    // Start game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart);
      }
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [handleKeyPress, handleTouchStart, gameLoop]);

  return (
    <div className="game-container flex flex-col items-center space-y-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl mx-auto">
      {/* Game Title */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Modern Snake</h1>
        <p className="text-white/80 text-sm">A classic game with modern design</p>
      </div>

      {/* Game Canvas */}
      <div className="relative mt-12">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="border-2 border-white/20 rounded-lg shadow-lg bg-gray-900 max-w-full h-auto"
          style={{ 
            imageRendering: 'pixelated',
            maxWidth: '90vw',
            maxHeight: '60vh'
          }}
        />
        
        {/* Game UI Overlay */}
        <GameUI
          gameState={gameState}
          score={score}
          highScore={highScore}
          onStart={startGame}
          onRestart={resetGame}
        />
      </div>

      {/* Game Controls */}
      <GameControls gameState={gameState} />
    </div>
  );
};

export default SnakeGame;
