import React from 'react';
import { Button } from '@/components/ui/button';
import { useAudio } from '../lib/stores/useAudio';
import { Volume2, VolumeX, Smartphone, Keyboard } from 'lucide-react';

interface GameControlsProps {
  gameState: 'ready' | 'playing' | 'ended';
}

const GameControls: React.FC<GameControlsProps> = ({ gameState }) => {
  const { isMuted, toggleMute } = useAudio();

  return (
    <div className="flex flex-col items-center space-y-4 text-white">
      {/* Audio Controls */}
      <div className="flex items-center gap-4">
        <Button
          onClick={toggleMute}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
          <span className="ml-2 text-sm">
            {isMuted ? 'Unmute' : 'Mute'}
          </span>
        </Button>
      </div>

      {/* Control Instructions */}
      <div className="text-center text-sm text-white/80 max-w-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Desktop Controls */}
          <div className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-lg">
            <Keyboard className="w-5 h-5" />
            <div>
              <p className="font-semibold">Desktop</p>
              <p className="text-xs">Arrow Keys or WASD</p>
            </div>
          </div>
          
          {/* Mobile Controls */}
          <div className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-lg">
            <Smartphone className="w-5 h-5" />
            <div>
              <p className="font-semibold">Mobile</p>
              <p className="text-xs">Tap screen to turn</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs opacity-60">
          <p>Eat the golden food to grow and score points!</p>
          <p>Avoid hitting walls or yourself.</p>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
