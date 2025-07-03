# Modern Snake Game

## Overview

This is a modern web-based Snake game built with React and TypeScript, featuring a full-stack architecture with Express.js backend and Vite development setup. The application uses Drizzle ORM for database management and includes a comprehensive UI component library based on Radix UI.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for game state and audio management
- **UI Components**: Radix UI primitives with custom styling
- **3D Graphics**: React Three Fiber for potential 3D enhancements

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Development**: tsx for TypeScript execution
- **API**: RESTful API structure (routes prefixed with `/api`)

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Provider**: Neon Database serverless
- **Schema**: Type-safe database schema definitions
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Game Engine
- **Core Logic**: Snake movement, collision detection, food generation
- **State Management**: Zustand stores for game state, audio controls
- **Canvas Rendering**: HTML5 Canvas for game graphics
- **Input Handling**: Keyboard (WASD/Arrow keys) and touch controls

### Audio System
- **Background Music**: Looped game music
- **Sound Effects**: Hit and success sound effects
- **Mute Controls**: User-controllable audio preferences
- **Cross-platform**: Works on desktop and mobile devices

### UI Components
- **Design System**: Custom components built on Radix UI
- **Responsive**: Mobile-first design with touch controls
- **Accessibility**: ARIA-compliant components
- **Theme**: HSL-based color system with CSS custom properties

### User Management
- **Schema**: User table with username/password fields
- **Storage**: In-memory storage implementation (development)
- **Future**: Database persistence ready via Drizzle ORM

## Data Flow

1. **Game Initialization**: Game starts in 'ready' state with initial snake position
2. **User Input**: Direction changes queued and processed on next game tick
3. **Game Loop**: Regular updates move snake, check collisions, update score
4. **State Updates**: Zustand stores trigger React re-renders
5. **Persistence**: High scores saved to localStorage (expandable to database)

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connection
- **@radix-ui/***: UI component primitives
- **@tanstack/react-query**: Data fetching and caching
- **drizzle-orm**: Type-safe ORM
- **express**: Web server framework
- **zustand**: State management

### Development Dependencies
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution
- **tailwindcss**: Utility-first CSS framework
- **drizzle-kit**: Database schema management

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Production**: Serves static files and API from single Node.js process

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)

### Scripts
- `npm run dev`: Development server with hot reload
- `npm run build`: Production build
- `npm start`: Production server
- `npm run db:push`: Push schema changes to database

## Changelog
- July 03, 2025. Initial setup

## User Preferences
Preferred communication style: Simple, everyday language.