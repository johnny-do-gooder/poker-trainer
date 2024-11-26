# Johnny Do-Gooder's Poker Hand Trainer

An interactive web-based application to help players learn and practice poker hand rankings through engaging gameplay and tutorials.

## Current Status [UNSTABLE]

The project is currently in active development with the following features implemented:

### Core Features
- Complete card system with 3D animations and state management
- Multiple game modes (Easy, Medium, Hard, Gauntlet)
- Interactive tutorials for beginners and advanced players
- Sound effects and visual feedback
- Progressive difficulty system

### Game Modes
- **Easy Mode**: Basic hand recognition with unlimited time
- **Medium Mode**: More complex hands with increased time pressure
- **Hard Mode**: Advanced hand combinations and faster gameplay
- **Gauntlet Mode**: Endless challenge mode with increasing difficulty

## Known Issues
See [error_log.md](error_log.md) for a detailed list of current issues. Key items:
- Audio context initialization warnings
- HTML5 audio pool management
- Card element creation in certain scenarios

## Project Structure

```
poker-trainer/
├── src/
│   ├── js/
│   │   ├── game/
│   │   │   ├── Card.js         # Core card implementation
│   │   │   ├── Game.js         # Main game logic
│   │   │   └── HandGenerator.js # Poker hand generation
│   │   ├── tutorial.js         # Basic tutorial implementation
│   │   ├── advancedTutorial.js # Advanced tutorial system
│   │   ├── main.js            # Application entry point
│   │   └── utils/             # Utility functions
│   ├── css/
│   │   ├── styles.css         # Main styles
│   │   └── tutorial.css       # Tutorial-specific styles
│   └── assets/
│       └── sounds/            # Game sound effects
├── test/
│   └── menuTest.js           # Menu system tests
└── index.html               # Main application page
```

## Technology Stack

- **Frontend**: Vanilla JavaScript with modern ES6+ features
- **Styling**: CSS3 with 3D transforms and animations
- **Build Tool**: Vite
- **Dependencies**:
  - GSAP (^3.12.5): Advanced animations
  - Howler (^2.2.4): Audio management
- **Testing**: Custom test suite with JSDOM

## Development

### Prerequisites
- Node.js (latest LTS recommended)
- npm or yarn
- Modern web browser with JavaScript enabled

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/johnny-do-gooder/poker-trainer.git
   cd poker-trainer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Testing
Run the menu system tests by opening `test/menuTest.js` in your browser.

### Building
```bash
npm run build
```

## Roadmap
1. Fix current stability issues (see error_log.md)
2. Implement scoring system
3. Add user progress tracking
4. Enhance tutorial system
5. Add multiplayer capabilities

## Contributing
Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

[MIT License](LICENSE)

## Acknowledgments
- Card design inspiration from modern poker applications
- Sound effects from open-source gaming resources
- Community feedback and contributions
