# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
GotJokes is a voice-based comedy web application where users record jokes, receive AI-powered feedback, and build an audience. Built as a mobile-first responsive web app using React, TypeScript, and Vite.

## Prerequisites
- **Node.js**: v22.17.0 (required for Vite 7.0.0)
- Use `nvm use 22.17.0` or similar to ensure correct Node version

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server with HMR
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Future Testing Commands
No test framework is currently set up. When implementing tests, consider adding:
- Vitest for unit testing (integrates well with Vite)
- React Testing Library for component testing

## Architecture & Code Structure

### Current Stack
- **Framework**: React 19.1.0 with TypeScript 5.8.3
- **Build Tool**: Vite 7.0.0
- **Routing**: React Router DOM 7.6.2
- **UI Library**: Mantine 8.1.2 (core, hooks, dates, notifications, form)
- **Styling**: Tailwind CSS 4.1.11
- **Linting**: ESLint 9.29.0 with React plugins
- **Module System**: ES Modules (type: "module")

### Planned Architecture (from PRD)
The application should be structured as follows:
```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers (AppContext for global state)
├── hooks/          # Custom React hooks
├── utils/          # Helper functions (audio processing, Claude API)
├── types/          # TypeScript type definitions
└── assets/         # Images, sounds, and other static files
```

### Key Technical Components
1. **State Management**: React Context API + useReducer pattern for global state
2. **Audio Processing**: Web Audio API and MediaRecorder API for voice recording
3. **AI Integration**: Claude API for joke analysis and feedback
4. **Data Persistence**: localStorage for MVP (IndexedDB for future)
5. **Styling**: Tailwind CSS + Mantine UI components
6. **Animations**: React Spring (to be installed) for UI animations

### Design System
- **Primary Colors**: Deep purple (#5B21B6), Hot pink (#EC4899)
- **Background**: Navy blue gradient (#0F172A to #1E293B)
- **Typography**: System fonts with fallbacks
- **Mobile Breakpoints**: 320px base, responsive up to desktop
- **Custom Styling**: Tailwind CSS for layout and custom components

## Implementation Priorities

Based on the PRD's 4-hour implementation plan:
1. **Foundation & Avatar System**: Set up Tailwind, basic layout, avatar creation
2. **Recording & Stage**: Voice recording functionality, animated stage UI
3. **AI Integration**: Claude API integration, reaction system
4. **Polish & Profile**: User profiles, social feed, achievements

## Core Libraries (Already Installed)

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for custom styling
- **React Router DOM**: Client-side routing

### Dependencies to Install

Additional dependencies for specific features:
```bash
# Animation
npm install react-spring

# Audio visualization (if needed)
npm install wavesurfer.js
```

## API Integration Notes

### Claude API
- Endpoint for joke analysis should be implemented in `utils/ai.ts`
- Handle API keys securely (environment variables)
- Implement retry logic and error handling
- Cache responses to minimize API calls

### Audio Recording
- Use MediaRecorder API with webm/opus format
- Implement 60-second max recording limit
- Add noise gate and basic audio processing
- Store recordings as base64 or Blob URLs

## Development Guidelines

### Component Development
- Use functional components with TypeScript
- Leverage Mantine components for consistent UI
- Use Tailwind for layout and custom styling
- Implement proper error boundaries
- Follow mobile-first responsive design
- Use semantic HTML for accessibility

### Performance Considerations
- Lazy load components where appropriate
- Optimize audio file handling
- Implement virtual scrolling for feed
- Use React.memo for expensive components

### State Management Pattern
```typescript
// Example context structure
interface AppState {
  user: UserProfile;
  currentJoke: JokeRecording | null;
  feed: JokePost[];
  isRecording: boolean;
}
```

## Current Project Status
The project has been initialized with:
- Vite + React + TypeScript boilerplate
- React Router DOM for routing
- Tailwind CSS for styling
- PostCSS configuration

No features have been implemented yet. The comprehensive PRD in `ClaudeResources/PRD.md` contains detailed specifications for all planned features.

## Common Component Patterns

### Using Mantine with Tailwind
```tsx
import { Button, TextInput } from '@mantine/core';

// Mantine component with Tailwind classes
<Button className="mt-4 w-full" color="violet">
  Submit
</Button>

// Custom component mixing both
<div className="flex gap-4 p-6 bg-gradient-to-b from-navy-dark to-navy-light">
  <TextInput placeholder="Enter joke title" />
</div>
```