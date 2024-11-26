// Import required modules
import { JSDOM } from 'jsdom';

// Create a minimal HTML structure
const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Menu Test</title>
</head>
<body>
    <div id="game-container"></div>
    <div id="menu" class="screen"></div>
    <div id="tutorial-overlay" class="screen"></div>
    <div id="advanced-tutorial-overlay" class="screen"></div>
    <div id="hand-buttons" class="button-container"></div>
    <div id="game-over" class="screen"></div>
    
    <!-- Menu buttons -->
    <button id="tutorial-button">Basic Tutorial</button>
    <button id="advanced-tutorial-button">Advanced Tutorial</button>
    <button id="easy-mode">Easy Mode</button>
    <button id="medium-mode">Medium Mode</button>
    <button id="hard-mode">Hard Mode</button>
    <button id="gauntlet-mode">Gauntlet Mode</button>
    
    <!-- Return buttons -->
    <button id="menu-from-tutorial">Return to Menu</button>
    <button id="menu-from-advanced">Return to Menu</button>
    <button id="game-over-menu">Return to Menu</button>
    <button id="play-again">Play Again</button>
</body>
</html>
`;

// Setup JSDOM
const dom = new JSDOM(html, {
    runScripts: 'dangerously'
});

// Setup global environment
global.window = dom.window;
global.document = dom.window.document;

// Mock classes and constants
const mockModules = {
    Game: class {
        constructor() {}
        cleanup() {}
        async startGame() {}
    },
    Tutorial: class {
        constructor() {}
        cleanup() {}
        start() {}
    },
    AdvancedTutorial: class {
        constructor() {}
        cleanup() {}
        start() {}
    },
    Card: class {},
    GAME_MODES: {
        EASY: 'easy',
        MEDIUM: 'medium',
        HARD: 'hard',
        GAUNTLET: 'gauntlet'
    }
};

// Create the main game logic
const createGameLogic = () => {
    const gameContainer = document.getElementById('game-container');
    const menuOverlay = document.getElementById('menu');
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    const advancedTutorialOverlay = document.getElementById('advanced-tutorial-overlay');
    const handButtons = document.getElementById('hand-buttons');
    
    let currentGame = null;
    let currentTutorial = null;
    let currentAdvancedTutorial = null;
    
    const hideAllScreens = () => {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        handButtons.style.display = 'none';
    };
    
    const showScreen = (screen, displayStyle = 'flex') => {
        hideAllScreens();
        screen.style.display = displayStyle;
    };
    
    const cleanup = () => {
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
    
    const startGame = async (mode) => {
        cleanup();
        hideAllScreens();
        currentGame = new mockModules.Game(gameContainer, handButtons);
        await currentGame.startGame(mode);
    };
    
    // Initialize screens
    hideAllScreens();
    showScreen(menuOverlay);
    
    // Add event listeners
    document.getElementById('tutorial-button').addEventListener('click', () => {
        cleanup();
        currentTutorial = new mockModules.Tutorial();
        currentTutorial.start();
        showScreen(tutorialOverlay);
    });
    
    document.getElementById('advanced-tutorial-button').addEventListener('click', () => {
        cleanup();
        currentAdvancedTutorial = new mockModules.AdvancedTutorial();
        currentAdvancedTutorial.start();
        showScreen(advancedTutorialOverlay);
    });
    
    const returnToMenu = () => {
        cleanup();
        showScreen(menuOverlay);
    };
    
    document.getElementById('menu-from-tutorial').addEventListener('click', returnToMenu);
    document.getElementById('menu-from-advanced').addEventListener('click', returnToMenu);
    document.getElementById('game-over-menu').addEventListener('click', returnToMenu);
    
    const gameModes = {
        'easy-mode': mockModules.GAME_MODES.EASY,
        'medium-mode': mockModules.GAME_MODES.MEDIUM,
        'hard-mode': mockModules.GAME_MODES.HARD,
        'gauntlet-mode': mockModules.GAME_MODES.GAUNTLET
    };
    
    Object.entries(gameModes).forEach(([buttonId, mode]) => {
        document.getElementById(buttonId).addEventListener('click', () => startGame(mode));
    });
    
    document.getElementById('play-again').addEventListener('click', async () => {
        const mode = currentGame?.mode || mockModules.GAME_MODES.EASY;
        await startGame(mode);
    });
};

// Helper function to wait for DOM updates
const waitForDOMUpdate = () => new Promise(resolve => setTimeout(resolve, 50));

// Test suite
async function runTests() {
    console.log('Starting menu system tests...');
    let errors = 0;

    try {
        // Initialize game logic
        createGameLogic();
        await waitForDOMUpdate();
        
        // Test 1: Initial screen states
        console.log('\nTest 1: Checking initial screen states...');
        
        const menuScreen = document.getElementById('menu');
        const tutorialOverlay = document.getElementById('tutorial-overlay');
        const advancedTutorialOverlay = document.getElementById('advanced-tutorial-overlay');
        const handButtons = document.getElementById('hand-buttons');
        
        if (menuScreen.style.display !== 'flex') {
            throw new Error('Menu screen should be visible (display: flex)');
        }
        
        if (tutorialOverlay.style.display !== 'none') {
            throw new Error('Tutorial overlay should be hidden');
        }
        
        if (advancedTutorialOverlay.style.display !== 'none') {
            throw new Error('Advanced tutorial overlay should be hidden');
        }
        
        if (handButtons.style.display !== 'none') {
            throw new Error('Hand buttons should be hidden');
        }
        
        console.log('✓ Initial screen states test passed');
        
        // Test 2: Menu button functionality
        console.log('\nTest 2: Testing menu buttons...');
        
        // Test tutorial button
        document.getElementById('tutorial-button').click();
        await waitForDOMUpdate();
        
        if (tutorialOverlay.style.display !== 'flex') {
            throw new Error('Tutorial overlay should be visible after clicking tutorial button');
        }
        
        // Test return to menu
        document.getElementById('menu-from-tutorial').click();
        await waitForDOMUpdate();
        
        if (menuScreen.style.display !== 'flex') {
            throw new Error('Menu should be visible after returning from tutorial');
        }
        
        // Test advanced tutorial
        document.getElementById('advanced-tutorial-button').click();
        await waitForDOMUpdate();
        
        if (advancedTutorialOverlay.style.display !== 'flex') {
            throw new Error('Advanced tutorial overlay should be visible after clicking advanced tutorial button');
        }
        
        console.log('✓ Menu button functionality test passed');
        
        // Test 3: Game mode buttons
        console.log('\nTest 3: Testing game mode buttons...');
        
        const gameModeButtons = ['easy-mode', 'medium-mode', 'hard-mode', 'gauntlet-mode'];
        
        for (const buttonId of gameModeButtons) {
            document.getElementById(buttonId).click();
            await waitForDOMUpdate();
            
            if (menuScreen.style.display !== 'none') {
                throw new Error(`Menu should be hidden after clicking ${buttonId}`);
            }
            
            if (handButtons.style.display !== 'none') {
                throw new Error(`Hand buttons should be hidden initially after clicking ${buttonId}`);
            }
        }
        
        console.log('✓ Game mode buttons test passed');
        
    } catch (error) {
        console.error(`✗ Test failed: ${error.message}`);
        errors++;
    }

    // Final results
    console.log('\n=== Test Results ===');
    if (errors === 0) {
        console.log('✓ All tests passed successfully!');
        process.exit(0);
    } else {
        console.error(`✗ ${errors} test(s) failed`);
        process.exit(1);
    }
}

// Run the tests
runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
