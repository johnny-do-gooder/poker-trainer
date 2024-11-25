import { Deck } from './Deck';
import { PokerHand } from './PokerHand';
import { GAME_MODES, MODE_DURATIONS, HAND_RANKINGS } from '../utils/Constants';
import { Howl } from 'howler';
import { Card } from './Card';

export class Game {
    constructor(container) {
        console.log('[Game] Initializing Game class');
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
        
        console.log('[Game] Game class initialized');
    }

    async initializeSounds() {
        if (this.soundsInitialized) {
            return;
        }
        
        try {
            this.sounds = {
                cardFlip: new Howl({ src: ['/src/assets/sounds/card-flip.mp3'], volume: 0.5 }),
                correct: new Howl({ src: ['/src/assets/sounds/correct.mp3'], volume: 0.5 }),
                incorrect: new Howl({ src: ['/src/assets/sounds/incorrect.mp3'], volume: 0.5 })
            };

            await Promise.all([
                new Promise((resolve) => this.sounds.cardFlip.once('load', resolve)),
                new Promise((resolve) => this.sounds.correct.once('load', resolve)),
                new Promise((resolve) => this.sounds.incorrect.once('load', resolve))
            ]);

            this.soundsInitialized = true;
        } catch (error) {
            console.error('Error initializing sounds:', error);
            this.soundsInitialized = false;
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

    async startGame(mode) {
        console.log('[Game] Starting game with mode:', mode);
        
        // Set game mode and activate game first
        this.gameMode = mode || GAME_MODES.EASY;
        this.timeLeft = MODE_DURATIONS[this.gameMode] || MODE_DURATIONS[GAME_MODES.EASY];
        this.isGameActive = true;  // Set active immediately
        
        console.log('[Game] Game mode set to:', this.gameMode);
        console.log('[Game] Current game state:', {
            isActive: this.isGameActive,
            mode: this.gameMode,
            container: this.container.children.length
        });
        
        try {
            if (!this.soundsInitialized) {
                console.log('[Game] Initializing sounds...');
                await this.initializeSounds();
            }
            
            this.score = {
                correct: 0,
                incorrect: 0,
                percentage: 0
            };
            
            console.log('[Game] Clearing game container');
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
            
            console.log('[Game] Starting timer and dealing first hand');
            this.startTimer();
            await this.dealNewHand();
            
        } catch (error) {
            console.error('[Game] Error starting game:', error);
            this.isGameActive = false;
        }
    }

    generateEasyModeHand() {
        const handTypes = [
            this.generateRoyalFlush.bind(this),
            this.generateStraightFlush.bind(this),
            this.generateFourOfAKind.bind(this),
            this.generateFullHouse.bind(this),
            this.generateFlush.bind(this),
            this.generateStraight.bind(this),
            this.generateThreeOfAKind.bind(this),
            this.generateTwoPair.bind(this),
            this.generateOnePair.bind(this),
            this.generateHighCard.bind(this)
        ];
        
        const generator = handTypes[Math.floor(Math.random() * handTypes.length)];
        return generator();
    }

    generateHighCard() {
        const ranks = ['A', 'K', 'Q', 'J', '9'];
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        return ranks.map(rank => {
            const suit = suits[Math.floor(Math.random() * suits.length)];
            return new Card(rank, suit);
        });
    }

    generateOnePair() {
        const pairRank = ['K', 'Q', 'J'][Math.floor(Math.random() * 3)];
        const otherRanks = ['A', 'K', 'Q', 'J'].filter(r => r !== pairRank).slice(0, 3);
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        
        const pairSuits = suits.slice().sort(() => Math.random() - 0.5).slice(0, 2);
        const cards = [
            new Card(pairRank, pairSuits[0]),
            new Card(pairRank, pairSuits[1])
        ];

        otherRanks.forEach(rank => {
            const suit = suits[Math.floor(Math.random() * suits.length)];
            cards.push(new Card(rank, suit));
        });

        return cards;
    }

    generateTwoPair() {
        const [pair1Rank, pair2Rank] = ['A', 'K', 'Q'].slice(0, 2);
        const lastRank = ['A', 'K', 'Q'].find(r => r !== pair1Rank && r !== pair2Rank);
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        
        const pair1Suits = suits.slice().sort(() => Math.random() - 0.5).slice(0, 2);
        const cards = [
            new Card(pair1Rank, pair1Suits[0]),
            new Card(pair1Rank, pair1Suits[1])
        ];

        const pair2Suits = suits.slice().sort(() => Math.random() - 0.5).slice(0, 2);
        cards.push(new Card(pair2Rank, pair2Suits[0]));
        cards.push(new Card(pair2Rank, pair2Suits[1]));

        const suit = suits[Math.floor(Math.random() * suits.length)];
        cards.push(new Card(lastRank, suit));

        return cards;
    }

    generateThreeOfAKind() {
        const tripRank = ['A', 'K', 'Q'][Math.floor(Math.random() * 3)];
        const otherRanks = ['A', 'K', 'Q'].filter(r => r !== tripRank);
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        
        const tripSuits = suits.slice().sort(() => Math.random() - 0.5).slice(0, 3);
        const cards = [
            new Card(tripRank, tripSuits[0]),
            new Card(tripRank, tripSuits[1]),
            new Card(tripRank, tripSuits[2])
        ];

        otherRanks.forEach(rank => {
            const suit = suits[Math.floor(Math.random() * suits.length)];
            cards.push(new Card(rank, suit));
        });

        return cards;
    }

    generateStraight() {
        const straightTypes = [
            ['A', 'K', 'Q', 'J', '10'],
            ['K', 'Q', 'J', '10', '9']
        ];
        const ranks = straightTypes[Math.floor(Math.random() * straightTypes.length)];
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        
        return ranks.map(rank => {
            const suit = suits[Math.floor(Math.random() * suits.length)];
            return new Card(rank, suit);
        });
    }

    generateFlush() {
        const suit = ['hearts', 'diamonds', 'clubs', 'spades'][Math.floor(Math.random() * 4)];
        const ranks = ['A', 'K', 'Q', 'J', '9'];
        
        return ranks.map(rank => new Card(rank, suit));
    }

    generateRoyalFlush() {
        const suit = ['hearts', 'diamonds', 'clubs', 'spades'][Math.floor(Math.random() * 4)];
        const ranks = ['A', 'K', 'Q', 'J', '10'];
        return ranks.map(rank => new Card(rank, suit));
    }

    generateStraightFlush() {
        const suit = ['hearts', 'diamonds', 'clubs', 'spades'][Math.floor(Math.random() * 4)];
        const ranks = ['K', 'Q', 'J', '10', '9'];
        return ranks.map(rank => new Card(rank, suit));
    }

    generateFourOfAKind() {
        const quadRank = ['K', 'Q', 'J'][Math.floor(Math.random() * 3)];
        const otherRank = 'A';  
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const otherSuit = suits[Math.floor(Math.random() * suits.length)];
        
        return [
            ...suits.map(suit => new Card(quadRank, suit)),
            new Card(otherRank, otherSuit)
        ];
    }

    generateFullHouse() {
        const tripRank = ['K', 'Q', 'J'][Math.floor(Math.random() * 3)];
        const pairRank = 'A';  
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        
        const tripSuits = suits.slice().sort(() => Math.random() - 0.5).slice(0, 3);
        const cards = [
            new Card(tripRank, tripSuits[0]),
            new Card(tripRank, tripSuits[1]),
            new Card(tripRank, tripSuits[2])
        ];

        const pairSuits = suits.slice().sort(() => Math.random() - 0.5).slice(0, 2);
        cards.push(new Card(pairRank, pairSuits[0]));
        cards.push(new Card(pairRank, pairSuits[1]));

        return cards;
    }

    dealNewHand() {
        console.log('[Game] Attempting to deal new hand. Game active:', this.isGameActive);
        if (!this.isGameActive) return;

        if (this.currentHand) {
            console.log('[Game] Cleaning up previous hand');
            // Clean up previous cards
            this.currentHand.cards.forEach(card => card.cleanup());
            // Clear container
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
        }

        const cards = this.generateEasyModeHand();
        console.log('[Game] Generated new hand:', cards.map(c => `${c.rank}${c.getSuitSymbol()}`).join(' '));
        
        const rankValues = {
            'A': 14, 'K': 13, 'Q': 12, 'J': 11,
            '10': 10, '9': 9, '8': 8, '7': 7,
            '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
        };
        cards.sort((a, b) => rankValues[b.rank] - rankValues[a.rank]);
        
        this.currentHand = new PokerHand(cards);
        console.log('[Game] New hand type:', this.currentHand.rank);
        
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        this.container.appendChild(cardContainer);
        
        cards.forEach((card, index) => {
            // Create card in the correct initial state for the game mode
            const cardElement = card.createElement();
            cardContainer.appendChild(cardElement);
            
            // In easy mode, flip cards face up after a delay
            if (this.gameMode === 'easy') {
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
        if (!this.isGameActive) {
            return;
        }
        
        const isCorrect = selectedRank === this.currentHand.rank;
        
        this.currentHand.cards.forEach(card => {
            card.element.classList.add(isCorrect ? 'correct' : 'incorrect');
            setTimeout(() => {
                card.element.classList.remove(isCorrect ? 'correct' : 'incorrect');
            }, 800);
        });
        
        if (this.soundsInitialized) {
            if (isCorrect) {
                this.sounds.correct.play();
            } else {
                this.sounds.incorrect.play();
            }
        }
        
        if (isCorrect) {
            this.score.correct++;
        } else {
            this.score.incorrect++;
        }
        
        const total = this.score.correct + this.score.incorrect;
        this.score.percentage = total > 0 ? Math.round((this.score.correct / total) * 100) : 0;
        
        this.updateScore();
        
        if (this.timeLeft <= 0) {
            this.endGame();
        } else {
            setTimeout(() => this.dealNewHand(), 1000);
        }
    }

    startTimer() {
        console.log('[Game] Starting timer with time left:', this.timeLeft);
        
        if (this.timer) {
            console.log('[Game] Clearing existing timer');
            clearInterval(this.timer);
        }
        
        const timerDisplay = document.getElementById('timer');
        if (!timerDisplay) {
            console.error('[Game] Timer display element not found');
            return;
        }
        
        timerDisplay.textContent = this.timeLeft;
        console.log('[Game] Timer display initialized with:', this.timeLeft);
        
        this.timer = setInterval(() => {
            this.updateTimer();
        }, 1000);
        
        console.log('[Game] Timer interval started');
    }

    updateTimer() {
        const timerDisplay = document.getElementById('timer');
        if (!timerDisplay) {
            console.error('[Game] Timer display element not found in updateTimer');
            return;
        }

        this.timeLeft--;
        timerDisplay.textContent = this.timeLeft;
        
        if (this.timeLeft <= 0) {
            console.log('[Game] Timer expired - Game state before ending:', {
                active: this.isGameActive,
                score: this.score,
                mode: this.gameMode,
                timeLeft: this.timeLeft
            });
            clearInterval(this.timer);
            this.timer = null;
            this.endGame();
        } else if (this.timeLeft <= 10) {
            console.log('[Game] Timer low warning:', this.timeLeft);
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
        console.log('[Game] Ending game due to:', this.timeLeft <= 0 ? 'timer expiration' : 'other reason');
        console.log('[Game] Final game state:', {
            active: this.isGameActive,
            score: this.score,
            mode: this.gameMode,
            timeLeft: this.timeLeft,
            timer: this.timer ? 'active' : 'inactive'
        });
        
        this.isGameActive = false;
        
        if (this.timer) {
            console.log('[Game] Clearing final timer instance');
            clearInterval(this.timer);
            this.timer = null;
        }
        
        const totalAnswers = this.score.correct + this.score.incorrect;
        this.score.percentage = Math.round((this.score.correct / totalAnswers) * 100);
        
        // Clean up current hand if it exists
        if (this.currentHand) {
            console.log('[Game] Cleaning up final hand');
            this.currentHand.cards.forEach(card => card.cleanup());
        }
        
        console.log('[Game] Clearing game container in endGame');
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        
        const gameOver = document.getElementById('game-over');
        gameOver.style.display = 'flex';
        gameOver.classList.remove('hidden');
        
        document.getElementById('final-score').textContent = `${this.score.percentage}%`;
        document.getElementById('correct-answers').textContent = this.score.correct;
        document.getElementById('incorrect-answers').textContent = this.score.incorrect;
        
        console.log('[Game] Game over screen displayed');
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
