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
        this.score = 0;
        this.timeLeft = 0;
        this.gameMode = null;
        this.timer = null;
        this.isGameActive = false;
        
        // Initialize sounds
        this.initializeSounds();
        this.setupEventListeners();
        
        console.log('Game class initialized');
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
            console.error('Error initializing sounds:', error);
            this.sounds = {};
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

    startGame(mode) {
        console.log('Starting game with mode:', mode);
        this.gameMode = mode;
        this.score = 0;
        this.timeLeft = MODE_DURATIONS[mode];
        this.isGameActive = true;
        this.deck = new Deck(); // Fresh deck
        
        try {
            this.sounds.gameStart?.play();
        } catch (error) {
            console.error('Error playing game start sound:', error);
        }
        
        this.startTimer();
        this.dealNewHand();
        
        // Update UI
        this.updateScore();
        this.updateTimer();
        
        console.log('Game started successfully');
    }

    dealNewHand() {
        console.log('Dealing new hand');
        // Clear previous hand
        if (this.currentHand) {
            this.currentHand.cards.forEach(card => {
                if (card.element && card.element.parentNode) {
                    card.element.parentNode.removeChild(card.element);
                }
            });
        }

        // Deal new cards
        const cards = this.deck.dealCards(5);
        this.currentHand = new PokerHand(cards);
        console.log('New hand:', this.currentHand.toString());
        
        // Create and display cards
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        
        cards.forEach((card, index) => {
            const cardElement = card.createElement();
            cardContainer.appendChild(cardElement);
            
            // Animate card dealing
            setTimeout(() => {
                try {
                    this.sounds.cardDeal?.play();
                } catch (error) {
                    console.error('Error playing card deal sound:', error);
                }
                card.flip();
            }, index * 200);
        });
        
        this.container.innerHTML = '';
        this.container.appendChild(cardContainer);
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
            this.score += this.currentHand.getPoints();
            this.updateScore();
        }
        
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
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score;
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
            <p>Final Score: ${this.score}</p>
            <button id="play-again">Play Again</button>
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
