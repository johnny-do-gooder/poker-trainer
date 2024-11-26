import { Deck } from './Deck.js';
import { PokerHand } from './PokerHand.js';
import { HandGenerator } from './HandGenerator.js';
import { GAME_MODES, MODE_SETTINGS, MODE_DURATIONS, HAND_COMPLEXITY, HAND_RANKINGS } from '../utils/Constants.js';
import { Howl } from 'howler';
import { Card } from './Card.js';

export class Game {
    constructor(container, mode = GAME_MODES.EASY) {
        console.log('[Game] Initializing Game class with mode:', mode);
        if (!container) {
            console.error('No container provided to Game constructor');
            return;
        }
        
        this.container = container;
        this.deck = new Deck();
        this.isTestMode = true; // Enable test mode
        
        // Normalize mode to lowercase and validate
        this.mode = mode?.toLowerCase();
        this.settings = MODE_SETTINGS[this.mode];
        
        if (!this.settings) {
            console.warn(`[Game] Invalid mode: ${mode}, falling back to EASY mode`);
            this.mode = GAME_MODES.EASY;
            this.settings = MODE_SETTINGS[this.mode];
        }
        
        console.log('[Game] Mode settings:', {
            mode: this.mode,
            settings: this.settings,
            timeLimit: this.settings.timeLimit
        });
        
        this.score = {
            correct: 0,
            incorrect: 0,
            percentage: 0
        };
        
        this.timeLimit = Math.floor(this.settings.timeLimit / 1000); // Convert milliseconds to seconds
        this.timeRemaining = this.timeLimit;
        this.gameOver = false;
        this.currentHand = null;
        this.timer = null;
        this.isGameActive = false;
        this.sounds = {};
        this.soundsInitialized = false;
        this.countdownInterval = null;
        
        this.initializeSounds();
        this.setupEventListeners();
        
        console.log('[Game] Initialized with mode:', this.mode, 'settings:', this.settings);
    }

    initializeSounds() {
        try {
            // Create empty sound objects initially
            this.sounds = {
                cardDeal: null,
                cardFlip: null,
                correct: null,
                wrong: null,
                gameStart: null,
                gameOver: null
            };
            
            // Initialize sounds only on first user interaction
            const initSound = () => {
                if (!this.soundsInitialized) {
                    // Create Howl instances only after user interaction
                    this.sounds = {
                        cardDeal: new Howl({ src: ['/src/assets/sounds/card-deal.mp3'], html5: true }),
                        cardFlip: new Howl({ src: ['/src/assets/sounds/card-flip.mp3'], html5: true }),
                        correct: new Howl({ src: ['/src/assets/sounds/correct.mp3'], html5: true }),
                        wrong: new Howl({ src: ['/src/assets/sounds/wrong.mp3'], html5: true }),
                        gameStart: new Howl({ src: ['/src/assets/sounds/game-start.mp3'], html5: true }),
                        gameOver: new Howl({ src: ['/src/assets/sounds/game-over.mp3'], html5: true })
                    };
                    this.soundsInitialized = true;
                    
                    // Play game start sound to confirm audio is working
                    this.sounds.gameStart.play();
                    
                    // Remove event listeners
                    document.removeEventListener('click', initSound);
                    document.removeEventListener('keydown', initSound);
                }
            };
            
            // Add event listeners for user interaction
            document.addEventListener('click', initSound);
            document.addEventListener('keydown', initSound);
        } catch (error) {
            console.error('[Game] Error initializing sounds:', error);
            this.sounds = {};
        }
    }

    setupEventListeners() {
        this.handButtons = document.getElementById('hand-buttons');
        if (!this.handButtons) {
            console.error('[Game] Hand buttons element not found');
            return;
        }
        
        const buttons = this.handButtons.querySelectorAll('.hand-button');
        
        buttons.forEach(button => {
            const handlerFunction = () => {
                if (this.isGameActive) {
                    const selectedRank = button.dataset.hand;
                    this.checkAnswer(selectedRank);
                }
            };
            
            button.gameHandlerFunction = handlerFunction;
            button.addEventListener('click', handlerFunction);
        });
        
        // Make buttons visible
        this.handButtons.style.display = 'flex';
    }

    async startGame() {
        console.log('[Game] Starting game with settings:', {
            mode: this.mode,
            timeLimit: this.timeLimit,
            handTimed: this.settings.handTimed,
            handComplexity: this.settings.handComplexity
        });
        
        // Reset game state
        this.isGameActive = true;
        this.gameOver = false;
        this.score = {
            correct: 0,
            incorrect: 0,
            percentage: 0
        };
        
        // Initialize UI elements
        this.setupEventListeners();
        
        // Start game timer
        this.startTimer();
        
        // Generate first hand
        await this.generateNewHand();
    }

    async generateNewHand() {
        if (this.currentHand) {
            await this.currentHand.cleanup();
        }

        // Select hand type based on complexity
        let handTypes;
        switch (this.settings.handComplexity) {
            case 1: // Easy
                handTypes = [...HAND_COMPLEXITY.BASIC];
                break;
            case 2: // Medium
                handTypes = [...HAND_COMPLEXITY.BASIC, ...HAND_COMPLEXITY.INTERMEDIATE];
                break;
            case 3: // Hard
                handTypes = [...HAND_COMPLEXITY.INTERMEDIATE, ...HAND_COMPLEXITY.ADVANCED];
                break;
            case 4: // Gauntlet
                handTypes = [...HAND_COMPLEXITY.BASIC, ...HAND_COMPLEXITY.INTERMEDIATE, ...HAND_COMPLEXITY.ADVANCED];
                break;
            default:
                handTypes = [...HAND_COMPLEXITY.BASIC];
        }

        const handType = handTypes[Math.floor(Math.random() * handTypes.length)];
        const cards = HandGenerator.generateHand(handType);
        this.currentHand = new PokerHand(cards);

        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        this.container.appendChild(cardContainer);
        
        this.currentHand.cards.forEach((card, index) => {
            // Create card in the correct initial state for the game mode
            const cardElement = card.createElement();
            cardContainer.appendChild(cardElement);
            
            // In easy mode, flip cards face up after a delay
            if (this.mode === GAME_MODES.EASY) {
                setTimeout(() => {
                    try {
                        if (!this.isGameActive) return;
                        if (!card.faceUp) { // Only flip if not already face up
                            card.flip();
                        }
                    } catch (error) {
                        console.error('[Game] Error flipping card:', error);
                    }
                }, index * 200);
            }
        });
    }

    checkAnswer(selectedRank) {
        if (!this.currentHand || !this.isGameActive) return;

        const isCorrect = this.currentHand.checkAnswer(selectedRank);
        
        // Log answer for testing
        console.log('[Game] Answer checked:', {
            mode: this.mode,
            isCorrect,
            timeRemaining: this.timeRemaining,
            score: {
                correct: this.score.correct,
                incorrect: this.score.incorrect
            }
        });
        
        // Update score
        if (isCorrect) {
            this.score.correct++;
            this.playSound('correct');
        } else {
            this.score.incorrect++;
            this.playSound('wrong');
        }
        
        this.updateScore();

        // Deal next hand after a short delay to show the result
        setTimeout(() => {
            if (!this.gameOver) {
                this.generateNewHand();
            }
        }, 1000);
    }

    startTimer() {
        if (this.mode === GAME_MODES.GAUNTLET) {
            // Hide timer in gauntlet mode
            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.parentElement.style.display = 'none';
            }
            return;
        }

        // Initialize timer display
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.parentElement.style.display = 'flex';
            timerElement.textContent = this._formatTime(this.timeLimit);
        }

        // Start countdown
        this.timeRemaining = this.timeLimit;
        this.timer = setInterval(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining--;
                if (timerElement) {
                    timerElement.textContent = this._formatTime(this.timeRemaining);
                }
                if (this.timeRemaining === 0) {
                    this.endGame();
                }
            }
        }, 1000);
    }

    _formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    updateTimer() {
        if (!this.isGameActive) return;
        
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;
        
        // Hide timer in Gauntlet mode
        if (this.mode === GAME_MODES.GAUNTLET) {
            timerElement.parentElement.style.display = 'none';
            return;
        }
        
        // Show timer for all other modes
        timerElement.parentElement.style.display = 'flex';
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        timerElement.textContent = timeString;
        
        // Log every 5 seconds for testing
        if (this.timeRemaining % 5 === 0) {
            console.log('[Game] Timer update:', {
                mode: this.mode,
                timeRemaining: this.timeRemaining,
                display: timeString
            });
        }
    }

    _updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;
        
        // Hide timer in Gauntlet mode
        if (this.mode === GAME_MODES.GAUNTLET) {
            timerElement.parentElement.style.display = 'none';
            return;
        }
        
        // Show timer for all other modes
        timerElement.parentElement.style.display = 'flex';
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        timerElement.textContent = timeString;
    }

    updateScore() {
        const correctElement = document.getElementById('correct');
        const incorrectElement = document.getElementById('incorrect');
        const scoreElement = document.getElementById('score');
        
        if (correctElement) {
            correctElement.textContent = this.score.correct;
        }
        
        if (incorrectElement) {
            incorrectElement.textContent = this.score.incorrect;
        }
        
        if (scoreElement) {
            scoreElement.textContent = `${this.score.percentage}%`;
        }
    }

    endGame() {
        console.log('[Game] Game over');
        this.gameOver = true;
        this.isGameActive = false;
        
        // Stop timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Clean up current hand
        if (this.currentHand) {
            this.currentHand.cleanup();
            this.currentHand = null;
        }
        
        // Hide game elements
        if (this.handButtons) {
            this.handButtons.style.display = 'none';
        }
        
        // Show game over screen
        const gameOverScreen = document.getElementById('game-over');
        if (gameOverScreen) {
            // Update final stats
            const finalScoreElement = document.getElementById('final-score');
            if (finalScoreElement) {
                finalScoreElement.textContent = `${this.score.percentage}%`;
            }
            
            // Show screen
            gameOverScreen.style.display = 'flex';
        }
        
        // Play game over sound
        if (this.sounds.gameOver && this.soundsInitialized) {
            this.sounds.gameOver.play();
        }
    }

    initializeMode(mode) {
        console.log('[Game] Initializing mode:', {
            mode: mode,
            settings: this.settings[mode]
        });

        this.mode = mode;
        this.settings = {
            ...this.settings[mode],
            timeLimit: mode === GAME_MODES.GAUNTLET ? 0 : this.settings[mode].timeLimit,
            points: this.settings[mode].points
        };

        // Reset game state
        this.isGameActive = true;
        this.gameOver = false;
        this.score = { correct: 0, incorrect: 0, percentage: 0 };
        this.timeRemaining = this.settings.timeLimit / 1000;

        // Hide any previous game over screen
        const gameOver = document.getElementById('game-over');
        if (gameOver) {
            gameOver.style.display = 'none';
        }

        // Start the game with countdown
        this.startGame();
    }

    cleanup() {
        console.log('[Game] Cleaning up game resources');
        
        // Stop timers
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        // Clean up event listeners
        if (this.handButtons) {
            const buttons = this.handButtons.querySelectorAll('.hand-button');
            buttons.forEach(button => {
                if (button.gameHandlerFunction) {
                    button.removeEventListener('click', button.gameHandlerFunction);
                    delete button.gameHandlerFunction;
                }
            });
            this.handButtons.style.display = 'none';
        }
        
        // Clean up current hand
        if (this.currentHand) {
            this.currentHand.cleanup();
            this.currentHand = null;
        }
        
        // Reset game state
        this.isGameActive = false;
        this.gameOver = false;
        this.score = {
            correct: 0,
            incorrect: 0,
            percentage: 0
        };
        
        // Clear game container
        if (this.container) {
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
        }
    }

    playSound(soundName) {
        try {
            if (this.sounds[soundName] && this.soundsInitialized) {
                this.sounds[soundName].play();
            }
        } catch (error) {
            console.warn('[Game] Error playing sound:', soundName, error);
        }
    }
}
