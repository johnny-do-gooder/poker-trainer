import { Game } from './game/Game.js';
import { Tutorial } from './tutorial.js';
import { AdvancedTutorial } from './advancedTutorial.js';
import { GAME_MODES } from './utils/Constants.js';
import { Card } from './game/Card.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Main] Initializing game...');
    
    // Initialize game elements
    const gameContainer = document.getElementById('game-container');
    const menuOverlay = document.getElementById('menu');
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    const advancedTutorialOverlay = document.getElementById('advanced-tutorial-overlay');
    const handButtons = document.getElementById('hand-buttons');
    
    if (!gameContainer || !menuOverlay || !handButtons || !tutorialOverlay || !advancedTutorialOverlay) {
        console.error('Required game elements not found!');
        return;
    }
    
    let currentGame = null;
    let currentTutorial = null;
    let currentAdvancedTutorial = null;
    
    // Function to hide all screens
    const hideAllScreens = () => {
        console.log('[Main] Hiding all screens');
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            console.log('[Main] Hiding screen:', screen.id);
            screen.style.display = 'none';
        });
        
        // Also hide game container and hand buttons
        const gameContainer = document.getElementById('game-container');
        const handButtons = document.getElementById('hand-buttons');
        if (gameContainer) gameContainer.style.display = 'none';
        if (handButtons) handButtons.style.display = 'none';
    };
    
    // Function to show a specific screen
    const showScreen = (screen, displayStyle = 'flex') => {
        if (screen) {
            hideAllScreens();
            screen.style.display = displayStyle;
        }
    };
    
    // Set initial display states
    const initializeScreens = () => {
        console.log('[Main] Initializing screen states');
        hideAllScreens();
        const menuScreen = document.getElementById('menu');
        if (menuScreen) {
            menuScreen.style.display = 'flex';
        }
    };
    
    // Initialize screens
    initializeScreens();
    
    // Function to clean up previous game/tutorial
    const cleanup = () => {
        console.log('[Main] Cleaning up...');
        if (currentGame) {
            currentGame.cleanup();
            currentGame = null;
        }
        if (currentTutorial) {
            currentTutorial.cleanup();
            currentTutorial = null;
        }
        if (currentAdvancedTutorial) {
            currentAdvancedTutorial.cleanup();
            currentAdvancedTutorial = null;
        }
    };
    
    // Function to start game with specified mode
    const startGame = async (mode) => {
        console.log(`[Main] Starting game mode: ${mode}`);
        cleanup();
        hideAllScreens();
        
        // Show game container
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.display = 'flex';
        }
        
        // Initialize and start new game
        currentGame = new Game(gameContainer, mode);
        await currentGame.startGame(mode);
    };
    
    // Add event listeners with null checks
    const addClickHandler = (elementId, handler) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener('click', handler);
        }
    };
    
    // Tutorial button handlers
    addClickHandler('tutorial-button', () => {
        console.log('[Main] Starting basic tutorial');
        cleanup();
        currentTutorial = new Tutorial();
        currentTutorial.start();
        showScreen(tutorialOverlay);
    });
    
    addClickHandler('advanced-tutorial-button', () => {
        console.log('[Main] Starting advanced tutorial');
        cleanup();
        currentAdvancedTutorial = new AdvancedTutorial();
        currentAdvancedTutorial.start();
        showScreen(advancedTutorialOverlay);
    });
    
    // Game mode button handlers
    const gameModes = {
        'easy-mode': GAME_MODES.EASY,
        'medium-mode': GAME_MODES.MEDIUM,
        'hard-mode': GAME_MODES.HARD,
        'gauntlet-mode': GAME_MODES.GAUNTLET
    };
    
    Object.entries(gameModes).forEach(([buttonId, mode]) => {
        addClickHandler(buttonId, () => {
            console.log(`[Main] Starting game mode: ${mode}`);
            startGame(mode);
        });
    });
    
    // Return to menu handlers
    const returnToMenu = () => {
        cleanup();
        showScreen(document.getElementById('menu'));
    };
    
    addClickHandler('menu-from-tutorial', returnToMenu);
    addClickHandler('menu-from-advanced', returnToMenu);
    addClickHandler('game-over-menu', returnToMenu);
    
    // Game over handlers
    addClickHandler('play-again', async () => {
        console.log('[Main] Play Again clicked');
        const mode = currentGame?.mode || GAME_MODES.EASY;
        await startGame(mode);
    });
    
    // Handle window unload
    window.addEventListener('beforeunload', cleanup);
});
