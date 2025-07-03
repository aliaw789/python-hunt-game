import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy } from 'lucide-react';

interface GameUIProps {
  gameState: 'ready' | 'playing' | 'ended';
  score: number;
  highScore: number;
  onStart: () => void;
  onRestart: () => void;
}

const GameUI: React.FC<GameUIProps> = ({
  gameState,
  score,
  highScore,
  onStart,
  onRestart
}) => {
  return (
    <>
      {/* Score Display */}
      <div className="absolute -top-12 left-0 right-0 flex justify-between items-center text-white font-mono">
        <div className="bg-black/70 px-3 py-2 rounded-md backdrop-blur-sm border border-white/20">
          <span className="text-sm opacity-80">Score: </span>
          <span className="text-lg font-bold">{score}</span>
        </div>
        
        {highScore > 0 && (
          <div className="bg-black/70 px-3 py-2 rounded-md backdrop-blur-sm border border-white/20 flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm opacity-80">Best: </span>
            <span className="text-lg font-bold text-yellow-400">{highScore}</span>
          </div>
        )}
      </div>

      {/* Game State Overlays */}
      {gameState === 'ready' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
            <p className="text-sm opacity-80 mb-6">
              Use arrow keys or WASD to move<br />
              Touch screen on mobile
            </p>
            <Button 
              onClick={onStart}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Game
            </Button>
            <p className="text-xs opacity-60 mt-3">Press Space or Enter to start</p>
          </div>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-2 text-red-400">Game Over!</h2>
            <p className="text-lg mb-2">Final Score: <span className="font-bold text-yellow-400">{score}</span></p>
            
            {score === highScore && score > 0 && (
              <p className="text-sm text-yellow-400 mb-4 flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4" />
                New High Score!
              </p>
            )}
            
            <Button 
              onClick={onRestart}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
            <p className="text-xs opacity-60 mt-3">Press Space or Enter to restart</p>
          </div>
        </div>
      )}
    </>
  );
};

export default GameUI;
