import { Game } from './game/Game';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Initialize game elements
    const gameContainer = document.getElementById('game-container');
    const menuOverlay = document.getElementById('menu');
    const handButtons = document.getElementById('hand-buttons');
    
    if (!gameContainer || !menuOverlay || !handButtons) {
        console.error('Required game elements not found!');
        return;
    }
    
    // Hide hand buttons initially
    handButtons.style.display = 'none';
    
    // Create game instance
    const game = new Game(gameContainer);
    console.log('Game instance created');
    
    // Add mode selection handlers
    const modeButtons = document.querySelectorAll('.mode-button');
    console.log('Mode buttons found:', modeButtons.length);
    
    modeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            console.log('Mode button clicked:', button.dataset.mode);
            e.preventDefault();
            
            // Hide menu and show hand buttons
            menuOverlay.style.display = 'none';
            handButtons.style.display = 'flex';
            
            // Start game
            game.startGame(button.dataset.mode);
        });
    });
    
    // Handle window unload
    window.addEventListener('beforeunload', () => {
        if (game) {
            game.cleanup();
        }
    });
});
