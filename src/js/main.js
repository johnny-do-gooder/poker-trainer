import { Game } from './game/Game';
import { Tutorial } from './tutorial';

document.addEventListener('DOMContentLoaded', async () => {
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
    
    let game = null;
    let tutorial = null;
    
    // Function to clean up previous game/tutorial
    const cleanup = () => {
        if (game) {
            game.cleanup();
            game = null;
        }
        if (tutorial) {
            tutorial.cleanup();
            tutorial = null;
        }
    };
    
    // Add mode selection handlers
    const modeButtons = document.querySelectorAll('.mode-button');
    console.log('Mode buttons found:', modeButtons.length);
    
    modeButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const mode = button.dataset.mode;
            menuOverlay.classList.add('hidden');
            
            // Clean up any existing game/tutorial
            cleanup();
            
            if (mode === 'tutorial') {
                // Start tutorial
                tutorialOverlay.style.display = 'flex';
                tutorial = new Tutorial();
                tutorial.start();
            } else {
                // Hide overlays and show hand buttons
                tutorialOverlay.style.display = 'none';
                document.getElementById('tutorial-complete').style.display = 'none';
                handButtons.style.display = 'flex';
                
                // Create new game instance and start it
                game = new Game(gameContainer);
                await game.startGame(mode);
            }
        });
    });
    
    // Handle window unload
    window.addEventListener('beforeunload', cleanup);
});
