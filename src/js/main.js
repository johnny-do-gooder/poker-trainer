import { Game } from './game/Game';
import { Tutorial } from './tutorial';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Initialize game elements
    const gameContainer = document.getElementById('game-container');
    const menuOverlay = document.getElementById('menu');
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    const handButtons = document.getElementById('hand-buttons');
    
    if (!gameContainer || !menuOverlay || !handButtons || !tutorialOverlay) {
        console.error('Required game elements not found!');
        return;
    }
    
    // Hide hand buttons and tutorial overlay initially
    handButtons.style.display = 'none';
    tutorialOverlay.style.display = 'none';
    
    // Create game instance
    const game = new Game(gameContainer);
    let tutorial = null;
    
    console.log('Game instance created');
    
    // Add mode selection handlers
    const modeButtons = document.querySelectorAll('.mode-button');
    console.log('Mode buttons found:', modeButtons.length);
    
    modeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            console.log('Mode button clicked:', button.dataset.mode);
            e.preventDefault();
            
            if (button.dataset.mode === 'tutorial') {
                // Start tutorial
                menuOverlay.style.display = 'none';
                tutorialOverlay.style.display = 'flex';
                tutorial = new Tutorial();
            } else if (button.dataset.mode === 'easy') {
                // Hide menu and show hand buttons
                menuOverlay.style.display = 'none';
                tutorialOverlay.style.display = 'none';
                handButtons.style.display = 'flex';
                
                // Start game
                game.startGame('easy');
            }
        });
    });
    
    // Handle window unload
    window.addEventListener('beforeunload', () => {
        if (game) {
            game.cleanup();
        }
    });
});
