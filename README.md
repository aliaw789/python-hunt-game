# Python Hunt Game 🐍

A modern, realistic take on the classic Snake game where you control a python hunting mice in a forest environment.

![Python Hunt Game](./generated-icon.png)

## Features

- **Realistic Python Graphics**: Detailed python head with eyes, natural olive green coloring, and diamond-pattern body segments
- **Authentic Prey**: Hunt realistic mice complete with ears, eyes, and tails
- **Forest Environment**: Natural gradient background with forest floor grid pattern
- **Responsive Design**: Works on both desktop and mobile devices
- **Touch Controls**: Mobile-friendly touch controls for direction changes
- **Score Tracking**: Persistent high score storage in browser
- **Sound Effects**: Audio feedback for game events (hunt success, collisions)
- **Design Thinking Approach**: User-centered design with intuitive controls and clear visual feedback

## How to Play

### Desktop Controls
- Use **Arrow Keys** or **WASD** to control the python's direction
- Press **Space** or **Enter** to start/restart the game

### Mobile Controls
- **Tap** anywhere on the screen to change direction
- The python will turn toward where you tap

### Objective
- Guide your python to hunt mice and grow longer
- Avoid hitting walls or your own body
- Try to achieve the highest score possible

## Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Canvas API** for game rendering
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Vite** for development and building

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **Neon Database** for PostgreSQL

### Key Components
- `SnakeGame.tsx` - Main game component with canvas rendering
- `GameUI.tsx` - Game overlay with score and controls
- `useSnakeGame.tsx` - Game state management store
- `useAudio.tsx` - Audio system for sound effects

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd python-hunt-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes

## Game Design Philosophy

This project applies **design thinking principles** to reimagine the classic Snake game:

1. **Empathy**: Understanding that players want engaging, realistic visuals
2. **Define**: Creating a nature-themed hunting experience
3. **Ideate**: Realistic python graphics and forest environment
4. **Prototype**: Iterative development with user feedback
5. **Test**: Responsive design and intuitive controls

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by the classic Snake game
- Built with modern web technologies
- Designed using human-centered design principles