import { Game } from './game/Game';
import { Tutorial } from './tutorial';
import { GAME_MODES } from './utils/Constants';
import { Card } from './game/Card';

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
    
    let currentGame = null;
    let currentTutorial = null;
    let tutorialActive = false;
    
    // Function to clean up previous game/tutorial
    const cleanup = (preserveGameInstance = false) => {
        if (currentGame) {
            currentGame.cleanup();
            if (!preserveGameInstance) {
                currentGame = null;
            }
        }
        if (currentTutorial) {
            currentTutorial.cleanup();
            currentTutorial = null;
        }
        tutorialActive = false;
        
        // Reset UI elements
        handButtons.style.display = 'none';
        tutorialOverlay.style.display = 'none';
        document.getElementById('tutorial-complete').style.display = 'none';
        menuOverlay.style.display = 'flex';
        menuOverlay.classList.remove('hidden');
    };
    
    // Function to start game with specified mode
    const startGame = async (mode) => {
        console.log('[Main] Starting new game with mode:', mode);
        
        cleanup(true);  // Preserve game instance when starting new game

        console.log('[Main] Hiding overlays');
        // Hide all overlays
        const overlays = document.querySelectorAll('.overlay');
        overlays.forEach(overlay => {
            overlay.style.display = 'none';
            overlay.classList.add('hidden');
        });
        
        console.log('[Main] Showing hand buttons');
        // Show hand buttons
        handButtons.style.display = 'flex';
        
        if (!currentGame) {
            console.log('[Main] Creating new game instance');
            currentGame = new Game(gameContainer, mode);
        }
        console.log('[Main] Starting game');
        await currentGame.startGame(mode);
    };
    
    // Event listeners for tutorial completion
    document.getElementById('return-to-menu').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        cleanup();
        tutorialActive = false;  // Explicitly reset tutorial state
        
        // Show menu
        menuOverlay.style.display = 'flex';
        menuOverlay.classList.remove('hidden');
        
        // Hide tutorial overlays
        tutorialOverlay.style.display = 'none';
        document.getElementById('tutorial-complete').style.display = 'none';
    });

    // Add mode selection handlers
    const modeButtons = document.querySelectorAll('.menu-content .mode-button');
    console.log('Mode buttons found:', modeButtons.length);
    modeButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            // Prevent event bubbling
            e.preventDefault();
            e.stopPropagation();
            
            const mode = button.dataset.mode;
            console.log('[Main] Mode button clicked:', mode);
            
            if (mode === 'tutorial') {
                console.log('[Main] Starting tutorial mode');
                // Clean up any existing instances
                if (currentGame) {
                    currentGame.cleanup();
                    currentGame = null;
                }
                if (currentTutorial) {
                    currentTutorial.cleanup();
                    currentTutorial = null;
                }
                
                // Clean up all card instances
                Card.cleanup();
                
                // Clear all card containers explicitly
                const cardContainers = document.querySelectorAll('.card-container');
                cardContainers.forEach(container => {
                    container.innerHTML = '';
                });
                
                // Create new tutorial instance
                tutorialActive = true;
                tutorialOverlay.style.display = 'flex';
                menuOverlay.style.display = 'none';
                currentTutorial = new Tutorial();
                currentTutorial.start();
            } else {
                console.log('[Main] Starting game mode:', mode);
                // Clean up any existing instances
                if (currentGame) {
                    currentGame.cleanup();
                    currentGame = null;
                }
                if (currentTutorial) {
                    currentTutorial.cleanup();
                    currentTutorial = null;
                }
                // Clean up all card instances
                Card.cleanup();
                
                await startGame(mode || GAME_MODES.EASY);
            }
        });
    });

    // Add game over button handlers
    document.getElementById('play-again').addEventListener('click', async () => {
        console.log('[Main] Play Again clicked');
        const currentMode = currentGame?.mode?.toLowerCase() || GAME_MODES.EASY;
        if (currentGame) {
            console.log('[Main] Cleaning up existing game');
            currentGame.cleanup();
            console.log('[Main] Restarting game with mode:', currentMode);
            await currentGame.startGame(currentMode);
        } else {
            console.log('[Main] No existing game, creating new instance');
            await startGame(currentMode);
        }
    });

    document.getElementById('game-over-menu').addEventListener('click', () => {
        console.log('[Main] Return to Menu clicked from game over');
        if (currentGame) {
            currentGame.cleanup();
            currentGame = null;
        }
        const gameOver = document.getElementById('game-over');
        gameOver.style.display = 'none';
        gameOver.classList.add('hidden');
        menuOverlay.style.display = 'flex';
        menuOverlay.classList.remove('hidden');
        
        // Refresh the page after a short delay to ensure cleanup is complete
        setTimeout(() => {
            window.location.reload();
        }, 100);
    });

    // Handle window unload
    window.addEventListener('beforeunload', cleanup);
});
