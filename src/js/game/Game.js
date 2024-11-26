import { Deck } from './Deck';
import { PokerHand } from './PokerHand';
import { HandGenerator } from './HandGenerator';
import { GAME_MODES, MODE_SETTINGS, MODE_DURATIONS, HAND_COMPLEXITY, HAND_RANKINGS } from '../utils/Constants';
import { Howl } from 'howler';
import { Card } from './Card';

export class Game {
    constructor(container, mode = GAME_MODES.EASY) {
        console.log('[Game] Initializing Game class with mode:', mode);
        if (!container) {
            console.error('No container provided to Game constructor');
            return;
        }
        
        this.container = container;
        this.deck = new Deck();
        
        // Normalize mode to lowercase and validate
        this.mode = mode?.toLowerCase();
        this.settings = MODE_SETTINGS[this.mode];
        
        if (!this.settings) {
            console.warn(`[Game] Invalid mode: ${mode}, falling back to EASY mode`);
            this.mode = GAME_MODES.EASY;
            this.settings = MODE_SETTINGS[this.mode];
        }
        
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
        
        this.initializeSounds();
        this.setupEventListeners();
        
        console.log('[Game] Initialized with mode:', this.mode, 'settings:', this.settings);
    }

    initializeSounds() {
        try {
            this.sounds = {
                cardDeal: new Howl({ src: ['/src/assets/sounds/card-deal.mp3'] }),
                cardFlip: new Howl({ src: ['/src/assets/sounds/card-flip.mp3'] }),
                correct: new Howl({ src: ['/src/assets/sounds/correct.mp3'] }),
                wrong: new Howl({ src: ['/src/assets/sounds/wrong.mp3'] }),
                gameStart: new Howl({ src: ['/src/assets/sounds/game-start.mp3'] }),
                gameOver: new Howl({ src: ['/src/assets/sounds/game-over.mp3'] })
            };
        } catch (error) {
            console.error('[Game] Error initializing sounds:', error);
            this.sounds = {};
        }
    }

    setupEventListeners() {
        const buttons = document.querySelectorAll('.hand-button');
        
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
    }

    async startGame() {
        console.log('[Game] Starting game with mode:', this.mode);
        this.score = {
            correct: 0,
            incorrect: 0,
            percentage: 0
        };
        this.timeRemaining = this.timeLimit;
        this.gameOver = false;
        this.isGameActive = true;
        
        try {
            this.sounds.gameStart?.play();
        } catch (error) {
            console.error('[Game] Error playing game start sound:', error);
        }
        
        // Start the session timer for timed modes
        if (!this.settings.handTimed && this.timeLimit !== Infinity) {
            this.timer = setInterval(() => {
                this.timeRemaining--;
                this.updateTimer();
                if (this.timeRemaining <= 0) {
                    this.endGame();
                }
            }, 1000);
        }
        
        // Deal the first hand
        await this.dealNewHand();
    }

    async dealNewHand() {
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
        if (!this.isGameActive || !this.currentHand) {
            return;
        }
        
        const isCorrect = selectedRank === this.currentHand.rank;
        
        // Play sound effect
        try {
            if (isCorrect) {
                this.sounds.correct?.play();
                this.currentHand.cards.forEach(card => card.animateCorrect());
            } else {
                this.sounds.wrong?.play();
                this.currentHand.cards.forEach(card => card.animateIncorrect());
            }
        } catch (error) {
            console.error('[Game] Error playing sound:', error);
        }

        if (isCorrect) {
            this.score.correct++;
            if (this.sounds.correct) {
                this.sounds.correct.play();
            }
        } else {
            this.score.incorrect++;
            if (this.sounds.wrong) {
                this.sounds.wrong.play();
            }
        }
        
        const total = this.score.correct + this.score.incorrect;
        this.score.percentage = total > 0 ? Math.round((this.score.correct / total) * 100) : 0;
        
        this.updateScore();

        // For easy mode, decrease time per hand
        if (this.settings.handTimed) {
            this.timeRemaining--;
            this.updateTimer();
            if (this.timeRemaining <= 0) {
                this.endGame();
                return;
            }
        }

        // Deal next hand after a short delay to show the result
        setTimeout(() => {
            if (!this.gameOver) {
                this.dealNewHand();
            }
        }, 1000);
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
        
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.timeRemaining <= 0) {
            console.log('[Game] Timer expired - Game state before ending:', {
                active: this.isGameActive,
                score: this.score,
                mode: this.mode,
                timeLeft: this.timeRemaining
            });
            clearInterval(this.timer);
            this.timer = null;
            this.endGame();
        } else if (this.timeRemaining <= 10) {
            console.log('[Game] Timer low warning:', this.timeRemaining);
        }
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
        console.log('[Game] Ending game due to:', this.timeRemaining <= 0 ? 'timer expiration' : 'other reason');
        console.log('[Game] Final game state:', {
            active: this.isGameActive,
            score: this.score,
            mode: this.mode,
            timeLeft: this.timeRemaining,
            timer: this.timer ? 'active' : 'inactive'
        });
        
        this.isGameActive = false;
        this.gameOver = true;
        
        // Clear any active timers
        if (this.timer) {
            console.log('[Game] Clearing final timer instance');
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Calculate final stats
        const totalAnswers = this.score.correct + this.score.incorrect;
        this.score.percentage = totalAnswers > 0 ? Math.round((this.score.correct / totalAnswers) * 100) : 0;
        
        // Clean up current hand if it exists
        if (this.currentHand) {
            console.log('[Game] Cleaning up final hand');
            this.currentHand.cleanup();
            this.currentHand = null;
        }
        
        // Clear game container
        console.log('[Game] Clearing game container in endGame');
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        
        // Show game over screen with mode-specific information
        const gameOver = document.getElementById('game-over');
        const gameOverContent = gameOver.querySelector('.game-over-content');
        
        // Update game over title based on mode
        const gameOverTitle = gameOverContent.querySelector('h2');
        if (this.mode === GAME_MODES.GAUNTLET) {
            gameOverTitle.textContent = 'Gauntlet Complete!';
        } else if (this.timeRemaining <= 0) {
            gameOverTitle.textContent = 'Time\'s Up!';
        } else {
            gameOverTitle.textContent = 'Game Over!';
        }
        
        // Update stats display
        document.getElementById('final-score').textContent = `${this.score.percentage}%`;
        document.getElementById('correct-answers').textContent = this.score.correct;
        document.getElementById('incorrect-answers').textContent = this.score.incorrect;
        
        // Add mode-specific stats
        const finalStats = gameOverContent.querySelector('.final-stats');
        
        // Remove any previous mode-specific stats
        const oldModeStats = finalStats.querySelector('.mode-stats');
        if (oldModeStats) {
            oldModeStats.remove();
        }
        
        // Add new mode-specific stats
        const modeStats = document.createElement('div');
        modeStats.className = 'mode-stats';
        
        if (this.mode !== GAME_MODES.GAUNTLET) {
            const timeUsed = this.settings.timeLimit / 1000 - this.timeRemaining;
            const minutes = Math.floor(timeUsed / 60);
            const seconds = Math.floor(timeUsed % 60);
            modeStats.innerHTML = `
                <p>Mode: ${this.mode.toUpperCase()}</p>
                <p>Time Used: ${minutes}:${seconds.toString().padStart(2, '0')}</p>
                <p>Points: ${this.score.correct * this.settings.points.correct + this.score.incorrect * this.settings.points.incorrect}</p>
            `;
        } else {
            modeStats.innerHTML = `
                <p>Mode: GAUNTLET</p>
                <p>Total Hands: ${totalAnswers}</p>
                <p>Points: ${this.score.correct * this.settings.points.correct + this.score.incorrect * this.settings.points.incorrect}</p>
            `;
        }
        
        finalStats.appendChild(modeStats);
        
        // Show game over screen
        gameOver.style.display = 'flex';
        gameOver.classList.remove('hidden');
        
        try {
            this.sounds.gameOver?.play();
        } catch (error) {
            console.error('[Game] Error playing game over sound:', error);
        }
    }

    cleanup() {
        console.log('[Game] Starting cleanup');
        
        // First cleanup the deck which will handle all card instances it owns
        if (this.deck) {
            console.log('[Game] Cleaning up deck');
            this.deck.cleanup();
            this.deck = null;
        }

        // Clear the game container - this will remove card elements from DOM
        console.log('[Game] Clearing game container');
        if (this.container) {
            this.container.innerHTML = '';
        }

        // Final safety check for any remaining card instances
        console.log('[Game] Running final card instance cleanup');
        Card.cleanup();

        // Hide game over screen
        console.log('[Game] Hiding game over screen');
        const gameOverScreen = document.getElementById('game-over');
        if (gameOverScreen) {
            gameOverScreen.style.display = 'none';
        }

        console.log('[Game] Cleanup complete');
    }
}
