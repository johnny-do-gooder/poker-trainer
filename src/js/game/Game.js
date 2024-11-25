import { Deck } from './Deck';
import { PokerHand } from './PokerHand';
import { GAME_MODES, MODE_DURATIONS, HAND_RANKINGS } from '../utils/Constants';
import { Howl } from 'howler';

export class Game {
    constructor(container) {
        console.log('Initializing Game class');
        if (!container) {
            console.error('No container provided to Game constructor');
            return;
        }
        
        this.container = container;
        this.deck = new Deck();
        this.currentHand = null;
        this.score = {
            correct: 0,
            incorrect: 0,
            percentage: 0
        };
        this.timeLeft = 0;
        this.gameMode = null;
        this.timer = null;
        this.isGameActive = false;
        this.sounds = {};
        this.soundsInitialized = false;
        
        this.setupEventListeners();
        
        console.log('Game class initialized');
    }

    async initializeSounds() {
        console.log('Starting sound initialization');
        if (this.soundsInitialized) {
            console.log('Sounds already initialized');
            return;
        }
        
        try {
            console.log('Creating unlock sound');
            // Create a temporary silent sound and play it to unlock audio context
            const unlockSound = new Howl({ src: ['/src/assets/sounds/card-flip.mp3'], volume: 0 });
            console.log('Unlock sound created');
            
            await new Promise((resolve, reject) => {
                console.log('Waiting for unlock sound to load');
                unlockSound.once('load', () => {
                    console.log('Unlock sound loaded, playing...');
                    unlockSound.play();
                    resolve();
                });
                unlockSound.once('loaderror', (id, err) => {
                    console.error('Error loading unlock sound:', err);
                    reject(new Error('Failed to load unlock sound'));
                });

                // Add a timeout in case the load event never fires
                setTimeout(() => {
                    reject(new Error('Timeout waiting for unlock sound to load'));
                }, 5000);
            });

            console.log('Creating sound effects');
            this.sounds = {};
            this.soundsInitialized = true; // Mark as initialized even if some sounds fail
            
            // Create each sound individually to isolate failures
            const soundFiles = {
                cardDeal: '/src/assets/sounds/card-deal.mp3',
                cardFlip: '/src/assets/sounds/card-flip.mp3',
                correct: '/src/assets/sounds/correct.mp3',
                wrong: '/src/assets/sounds/wrong.mp3',
                gameStart: '/src/assets/sounds/game-start.mp3',
                gameOver: '/src/assets/sounds/game-over.mp3'
            };

            for (const [name, src] of Object.entries(soundFiles)) {
                try {
                    console.log(`Creating sound: ${name}`);
                    this.sounds[name] = new Howl({ src: [src] });
                } catch (error) {
                    console.error(`Error creating sound ${name}:`, error);
                }
            }
            
            console.log('Sound initialization complete');
        } catch (error) {
            console.error('Error in sound initialization:', error);
            // Don't let sound initialization failure stop the game
            this.sounds = {};
            this.soundsInitialized = true; // Mark as initialized to prevent retries
            console.log('Continuing without sound effects');
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        
        // Add event listeners for hand selection buttons
        const buttons = document.querySelectorAll('.hand-button');
        console.log('Found hand buttons:', buttons.length);
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                console.log('Hand button clicked:', button.dataset.hand);
                if (!this.isGameActive) {
                    console.log('Game not active, ignoring click');
                    return;
                }
                const selectedRank = button.dataset.hand;
                this.checkAnswer(selectedRank);
            });
        });
    }

    async startGame(mode) {
        console.log('Starting game with mode:', mode);
        
        try {
            // Initialize sounds if not already done
            if (!this.soundsInitialized) {
                console.log('Initializing sounds...');
                await this.initializeSounds();
                console.log('Sounds initialized');
            }
            
            console.log('Setting up game state');
            this.gameMode = mode;
            this.score = {
                correct: 0,
                incorrect: 0,
                percentage: 0
            };
            this.timeLeft = MODE_DURATIONS[mode];
            this.isGameActive = true;
            this.deck = new Deck(); // Fresh deck

            console.log('Setting up game container');
            // Ensure game container is ready
            this.container.style.display = 'block';
            this.container.innerHTML = '';
            
            try {
                if (this.soundsInitialized) {
                    this.sounds.gameStart?.play();
                }
            } catch (error) {
                console.error('Error playing game start sound:', error);
            }
            
            console.log('Starting timer and dealing first hand');
            this.startTimer();
            this.dealNewHand();
            
            // Update UI
            this.updateScore();
            this.updateTimer();
            
            console.log('Game started successfully');
        } catch (error) {
            console.error('Error starting game:', error);
            throw error; // Re-throw to see the full stack trace
        }
    }

    dealNewHand() {
        console.log('Dealing new hand');
        
        // Clear previous hand
        if (this.currentHand) {
            console.log('Clearing previous hand');
            this.currentHand.cards.forEach(card => {
                if (card.element && card.element.parentNode) {
                    card.element.parentNode.removeChild(card.element);
                }
            });
        }

        // Deal new cards
        const cards = this.deck.dealCards(5);
        console.log('Dealt cards:', cards.map(c => `${c.rank}${c.getSuitSymbol()}`).join(' '));
        
        // Sort cards by rank (highest to lowest)
        const rankValues = {
            'A': 14, 'K': 13, 'Q': 12, 'J': 11,
            '10': 10, '9': 9, '8': 8, '7': 7,
            '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
        };
        cards.sort((a, b) => rankValues[b.rank] - rankValues[a.rank]);
        
        this.currentHand = new PokerHand(cards);
        console.log('New hand:', this.currentHand.toString());
        
        // Create and display cards
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        this.container.innerHTML = ''; // Clear container first
        this.container.appendChild(cardContainer);
        
        console.log('Created card container');
        
        // Create all card elements first
        cards.forEach(card => {
            const cardElement = card.createElement();
            cardContainer.appendChild(cardElement);
        });
        
        console.log('Added all card elements');
        
        // Then animate them with a delay
        cards.forEach((card, index) => {
            setTimeout(() => {
                try {
                    if (this.soundsInitialized) {
                        this.sounds.cardDeal?.play();
                    }
                    card.flip();
                    console.log(`Flipped card ${index + 1}`);
                } catch (error) {
                    console.error('Error during card flip:', error);
                }
            }, index * 200);
        });
    }

    checkAnswer(selectedRank) {
        console.log('Checking answer:', selectedRank, 'vs', this.currentHand.rank);
        const isCorrect = selectedRank === this.currentHand.rank;
        
        // Visual feedback
        this.currentHand.cards.forEach(card => {
            card.element.classList.add(isCorrect ? 'correct' : 'incorrect');
            setTimeout(() => {
                card.element.classList.remove(isCorrect ? 'correct' : 'incorrect');
            }, 800);
        });
        
        // Sound feedback
        try {
            this.sounds[isCorrect ? 'correct' : 'wrong']?.play();
        } catch (error) {
            console.error('Error playing feedback sound:', error);
        }
        
        // Update score
        if (isCorrect) {
            this.score.correct++;
        } else {
            this.score.incorrect++;
        }
        
        // Calculate percentage
        const total = this.score.correct + this.score.incorrect;
        this.score.percentage = total > 0 ? Math.round((this.score.correct / total) * 100) : 0;
        
        this.updateScore();
        
        // Deal next hand after a short delay
        setTimeout(() => this.dealNewHand(), 1000);
    }

    startTimer() {
        console.log('Starting timer');
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    updateTimer() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
        console.log('Game over. Final score:', this.score);
        this.isGameActive = false;
        if (this.timer) clearInterval(this.timer);
        
        try {
            this.sounds.gameOver?.play();
        } catch (error) {
            console.error('Error playing game over sound:', error);
        }
        
        // Show game over screen with final score
        const gameOverScreen = document.createElement('div');
        gameOverScreen.className = 'game-over';
        gameOverScreen.innerHTML = `
            <h2>Game Over!</h2>
            <div class="final-score">
                <p>Correct Answers: ${this.score.correct}</p>
                <p>Incorrect Answers: ${this.score.incorrect}</p>
                <p>Final Score: ${this.score.percentage}%</p>
            </div>
            <button id="play-again" class="mode-button">Play Again</button>
        `;
        
        this.container.innerHTML = '';
        this.container.appendChild(gameOverScreen);
        
        // Setup play again button
        const playAgainButton = document.getElementById('play-again');
        if (playAgainButton) {
            playAgainButton.addEventListener('click', () => {
                console.log('Play again clicked');
                this.startGame(this.gameMode);
            });
        }
    }

    cleanup() {
        console.log('Cleaning up game');
        if (this.timer) clearInterval(this.timer);
        this.isGameActive = false;
        Object.values(this.sounds).forEach(sound => {
            try {
                sound?.unload();
            } catch (error) {
                console.error('Error unloading sound:', error);
            }
        });
    }
}
