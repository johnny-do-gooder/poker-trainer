# Poker Hand Trainer

An interactive web-based application to help players learn and practice poker hand rankings.

## Current Status

The project currently has a working card implementation with:
- Clean card display with proper front and back faces
- 3D flip animations
- Correct/incorrect state animations
- Test page for verifying card functionality

## Project Structure

```
poker-trainer/
├── src/
│   ├── js/
│   │   ├── game/
│   │   │   └── Card.js      # Core card implementation
│   │   └── cardTest.js      # Card testing functionality
│   └── css/
│       └── styles.css       # Card and animation styles
├── cardtest.html           # Card testing page
└── tutorial.html           # Tutorial page (in progress)
```

## Development

### Prerequisites
- Modern web browser with JavaScript enabled
- Local development server (recommended)

### Testing
Use `cardtest.html` to verify card functionality:
- Card display and styling
- Flip animations
- Correct/incorrect state animations

## Next Steps
- Implement the tutorial interface
- Add hand evaluation logic
- Create the main game interface
- Add scoring and progress tracking

## License

[MIT License](LICENSE)
