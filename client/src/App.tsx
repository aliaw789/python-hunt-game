import React from 'react';
import SnakeGame from './components/SnakeGame';
import './index.css';

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-2 md:p-4 overflow-auto">
      <SnakeGame />
    </div>
  );
}

export default App;
