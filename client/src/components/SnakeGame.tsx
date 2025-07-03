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
    // Clear canvas with natural background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#2d4a2b'); // Dark forest green
    gradient.addColorStop(1, '#1a2e1a'); // Darker forest green
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw subtle grid lines like forest floor pattern
    ctx.strokeStyle = 'rgba(79, 106, 76, 0.3)';
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

    // Draw snake with python-like appearance
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;
      const centerX = x + GRID_SIZE / 2;
      const centerY = y + GRID_SIZE / 2;
      const radius = (GRID_SIZE - 2) / 2;
      
      if (isHead) {
        // Draw python head - more elongated and detailed
        ctx.fillStyle = '#4a5c2a'; // Dark olive green
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius + 2, radius - 1, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Head pattern - diamond shape
        ctx.fillStyle = '#6b7c3a';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius - 2, radius - 4, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Eyes
        const eyeOffset = radius * 0.6;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX - eyeOffset/2, centerY - eyeOffset/2, 2, 0, 2 * Math.PI);
        ctx.arc(centerX + eyeOffset/2, centerY - eyeOffset/2, 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Eye highlights
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX - eyeOffset/2 + 1, centerY - eyeOffset/2 - 1, 1, 0, 2 * Math.PI);
        ctx.arc(centerX + eyeOffset/2 + 1, centerY - eyeOffset/2 - 1, 1, 0, 2 * Math.PI);
        ctx.fill();
        
      } else {
        // Draw python body segments with realistic pattern
        const bodyRadius = radius * (0.9 + Math.sin(index * 0.5) * 0.1); // Slight variation
        
        // Base body color - olive green
        ctx.fillStyle = '#556b2f';
        ctx.beginPath();
        ctx.arc(centerX, centerY, bodyRadius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Python pattern - darker diamond shapes
        ctx.fillStyle = '#3d4f1f';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, bodyRadius * 0.7, bodyRadius * 0.4, 
                   (index * 0.3) % (Math.PI * 2), 0, 2 * Math.PI);
        ctx.fill();
        
        // Lighter center stripe
        ctx.fillStyle = '#7a8f4a';
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, bodyRadius * 0.4, bodyRadius * 0.2, 
                   (index * 0.3) % (Math.PI * 2), 0, 2 * Math.PI);
        ctx.fill();
        
        // Scale texture - small lines
        ctx.strokeStyle = '#2a3318';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, bodyRadius * 0.8, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      // Add subtle shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    });

    // Draw food as a small mouse/prey animal
    if (food) {
      const time = Date.now() * 0.005;
      const pulse = Math.sin(time) * 0.05 + 1;
      const x = food.x * GRID_SIZE;
      const y = food.y * GRID_SIZE;
      const centerX = x + GRID_SIZE / 2;
      const centerY = y + GRID_SIZE / 2;
      const bodyRadius = (GRID_SIZE / 3) * pulse;
      
      // Mouse body - brown/tan color
      ctx.fillStyle = '#8b6f47';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 2, bodyRadius * 1.2, bodyRadius * 0.8, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Mouse head
      ctx.fillStyle = '#a0825a';
      ctx.beginPath();
      ctx.arc(centerX, centerY - 2, bodyRadius * 0.7, 0, 2 * Math.PI);
      ctx.fill();
      
      // Ears
      ctx.fillStyle = '#6b4e32';
      ctx.beginPath();
      ctx.arc(centerX - 3, centerY - 5, 2, 0, 2 * Math.PI);
      ctx.arc(centerX + 3, centerY - 5, 2, 0, 2 * Math.PI);
      ctx.fill();
      
      // Eyes
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(centerX - 2, centerY - 3, 1, 0, 2 * Math.PI);
      ctx.arc(centerX + 2, centerY - 3, 1, 0, 2 * Math.PI);
      ctx.fill();
      
      // Tail
      ctx.strokeStyle = '#8b6f47';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY + 6);
      ctx.quadraticCurveTo(centerX + 8, centerY + 8, centerX + 6, centerY + 12);
      ctx.stroke();
      
      // Subtle glow effect
      ctx.shadowColor = 'rgba(139, 111, 71, 0.3)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Python Hunt</h1>
        <p className="text-white/80 text-sm">Guide the python through the forest to catch prey</p>
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
