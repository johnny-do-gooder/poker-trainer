# Poker Hand Trainer v0.2.0

An interactive web-based application to help players learn and practice poker hand rankings.

## Features

### Tutorial Mode
- Step-by-step introduction to poker hand rankings
- Interactive examples with real-time feedback
- Skip option to jump straight to practice
- Return to menu functionality

### Practice Mode
- Randomly generated poker hands
- Real-time feedback with visual effects
- Score tracking with correct/incorrect ratio
- Beautiful card animations:
  - Green glow effect for correct answers
  - Red pulse effect for incorrect answers
  - Smooth transitions between hands

## Project Structure

```
poker-trainer/
├── src/
│   ├── js/
│   │   ├── game/
│   │   │   ├── Card.js       # Card implementation
│   │   │   ├── Deck.js       # Deck management
│   │   │   ├── Game.js       # Game logic
│   │   │   └── PokerHand.js  # Hand evaluation
│   │   └── utils/
│   │       └── Constants.js   # Game constants
│   └── css/
│       └── styles.css        # Styles and animations
├── index.html               # Main game page
├── tutorial.html           # Tutorial interface
└── practice.html          # Practice mode
```

## Development

### Prerequisites
- Modern web browser with JavaScript enabled
- Node.js and npm for development
- Vite for building and serving

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Use `npm run dev` to start development server
4. Use `npm run build` to create production build

### Recent Updates (v0.2.0)
- Finalized card animation system
- Added glowing effects for correct/incorrect feedback
- Improved practice mode with score tracking
- Fixed card generation to prevent duplicates

## License

[MIT License](LICENSE)
