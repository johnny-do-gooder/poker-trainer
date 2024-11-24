import { Deck } from './Deck';
import { PokerHand } from './PokerHand';
import { GAME_MODES, MODE_DURATIONS, HAND_RANKINGS } from '../utils/Constants';
import { Howl } from 'howler';
import { Card } from './Card'; // Import the Card class

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
        this.handTypeWeights = null;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        
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
        this.handTypeWeights = null;
        
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

    startPracticeMode() {
        console.log('Starting practice mode');
        
        // Reset game state
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.isGameActive = true;
        this.currentHand = null;
        
        // Create practice stats element if it doesn't exist
        let practiceStats = document.querySelector('.practice-stats');
        if (!practiceStats) {
            practiceStats = document.createElement('div');
            practiceStats.className = 'practice-stats';
            document.body.appendChild(practiceStats);
        }
        this.updatePracticeStats();
        
        // Hide score and timer elements since they're not needed in practice mode
        const stats = document.getElementById('stats');
        if (stats) stats.style.display = 'none';
        
        // Initialize hand type weights for better distribution
        this.handTypeWeights = {
            royal_flush: 1,
            straight_flush: 2,
            four_of_a_kind: 3,
            full_house: 4,
            flush: 4,
            straight: 4,
            three_of_a_kind: 4,
            two_pair: 4,
            one_pair: 3,
            high_card: 1
        };
        
        // Generate and show first hand
        this.dealNewHand();
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

        // Deal new cards with weighted hand type selection
        let cards;
        if (this.handTypeWeights) {
            // We're in practice mode, use weighted selection
            const handTypes = Object.keys(this.handTypeWeights);
            const weights = Object.values(this.handTypeWeights);
            const totalWeight = weights.reduce((a, b) => a + b, 0);
            
            let random = Math.random() * totalWeight;
            let selectedType;
            
            for (let i = 0; i < weights.length; i++) {
                random -= weights[i];
                if (random <= 0) {
                    selectedType = handTypes[i];
                    break;
                }
            }
            
            cards = this.generateSpecificHand(selectedType);
        } else {
            // Normal game mode, completely random
            cards = this.deck.dealCards(5);
        }

        this.currentHand = new PokerHand(cards);
        console.log('New hand:', this.currentHand.toString());
        
        // Sort cards by rank
        const rankOrder = {
            'A': 14, 'K': 13, 'Q': 12, 'J': 11,
            '10': 10, '9': 9, '8': 8, '7': 7,
            '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
        };
        
        const sortedCards = [...cards].sort((a, b) => {
            return rankOrder[b.rank] - rankOrder[a.rank];
        });
        
        // Create and display cards
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        
        sortedCards.forEach((card, index) => {
            const cardElement = card.createElement();
            cardContainer.appendChild(cardElement);
            
            // Start all cards face down
            card.faceUp = false;
            cardElement.classList.add('face-down');
            
            // Animate card dealing and flipping
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

    generateSpecificHand(handType) {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        // Helper function to check if a card is already used
        const isCardUsed = (usedCards, rank, suit) => {
            return usedCards.some(card => card.rank === rank && card.suit === suit);
        };

        // Helper function to get a random unused card
        const getRandomUnusedCard = (usedCards, excludeRanks = [], excludeSuits = []) => {
            const availableRanks = ranks.filter(r => !excludeRanks.includes(r));
            const availableSuits = suits.filter(s => !excludeSuits.includes(s));
            
            let attempts = 0;
            const maxAttempts = 100; // Prevent infinite loops
            
            while (attempts < maxAttempts) {
                const rank = availableRanks[Math.floor(Math.random() * availableRanks.length)];
                const suit = availableSuits[Math.floor(Math.random() * availableSuits.length)];
                
                if (!isCardUsed(usedCards, rank, suit)) {
                    return { rank, suit };
                }
                attempts++;
            }
            
            throw new Error('Could not find unused card after maximum attempts');
        };
        
        let cardSpecs = [];
        const usedCards = [];
        
        try {
            switch (handType) {
                case 'royal_flush': {
                    const suit = suits[Math.floor(Math.random() * suits.length)];
                    cardSpecs = ['10', 'J', 'Q', 'K', 'A'].map(rank => {
                        const card = { rank, suit };
                        usedCards.push(card);
                        return card;
                    });
                    break;
                }
                
                case 'straight_flush': {
                    const suit = suits[Math.floor(Math.random() * suits.length)];
                    const startIdx = Math.floor(Math.random() * 9); // Leave room for 5 consecutive cards
                    cardSpecs = ranks.slice(startIdx, startIdx + 5).map(rank => {
                        const card = { rank, suit };
                        usedCards.push(card);
                        return card;
                    });
                    break;
                }
                
                case 'four_of_a_kind': {
                    const rank = ranks[Math.floor(Math.random() * ranks.length)];
                    // Add four cards of the same rank
                    suits.forEach(suit => {
                        const card = { rank, suit };
                        usedCards.push(card);
                        cardSpecs.push(card);
                    });
                    // Add a random kicker
                    const kicker = getRandomUnusedCard(usedCards, [rank]);
                    usedCards.push(kicker);
                    cardSpecs.push(kicker);
                    break;
                }
                
                case 'full_house': {
                    // Get first rank for three of a kind
                    const rank1 = ranks[Math.floor(Math.random() * ranks.length)];
                    // Get three different suits for the first rank
                    const suits1 = suits.slice(0, 3);
                    suits1.forEach(suit => {
                        const card = { rank: rank1, suit };
                        usedCards.push(card);
                        cardSpecs.push(card);
                    });
                    
                    // Get second rank for pair, ensuring it's different
                    let rank2;
                    do {
                        rank2 = ranks[Math.floor(Math.random() * ranks.length)];
                    } while (rank2 === rank1);
                    
                    // Get two different suits for the pair
                    const remainingSuits = suits.filter(s => !suits1.includes(s));
                    remainingSuits.slice(0, 2).forEach(suit => {
                        const card = { rank: rank2, suit };
                        usedCards.push(card);
                        cardSpecs.push(card);
                    });
                    break;
                }
                
                case 'flush': {
                    const suit = suits[Math.floor(Math.random() * suits.length)];
                    // Get 5 different ranks for the flush
                    while (cardSpecs.length < 5) {
                        const card = getRandomUnusedCard(usedCards, [], []);
                        card.suit = suit; // Override suit to ensure flush
                        if (!isCardUsed(usedCards, card.rank, card.suit)) {
                            usedCards.push(card);
                            cardSpecs.push(card);
                        }
                    }
                    break;
                }
                
                case 'straight': {
                    const startIdx = Math.floor(Math.random() * 9);
                    const straightRanks = ranks.slice(startIdx, startIdx + 5);
                    straightRanks.forEach(rank => {
                        const card = getRandomUnusedCard(usedCards, [], []);
                        card.rank = rank; // Override rank to ensure straight
                        usedCards.push(card);
                        cardSpecs.push(card);
                    });
                    break;
                }
                
                case 'three_of_a_kind': {
                    return this.generateThreeOfAKind();
                }
                
                case 'two_pair': {
                    // Get ranks for two pairs
                    const [rank1, rank2] = ranks.sort(() => Math.random() - 0.5).slice(0, 2);
                    
                    // Add first pair
                    for (let i = 0; i < 2; i++) {
                        const card = getRandomUnusedCard(usedCards, [], []);
                        card.rank = rank1;
                        usedCards.push(card);
                        cardSpecs.push(card);
                    }
                    
                    // Add second pair
                    for (let i = 0; i < 2; i++) {
                        const card = getRandomUnusedCard(usedCards, [], []);
                        card.rank = rank2;
                        usedCards.push(card);
                        cardSpecs.push(card);
                    }
                    
                    // Add kicker
                    const kicker = getRandomUnusedCard(usedCards, [rank1, rank2]);
                    usedCards.push(kicker);
                    cardSpecs.push(kicker);
                    break;
                }
                
                case 'one_pair': {
                    // Get rank for pair
                    const rank1 = ranks[Math.floor(Math.random() * ranks.length)];
                    
                    // Add pair
                    for (let i = 0; i < 2; i++) {
                        const card = getRandomUnusedCard(usedCards, [], []);
                        card.rank = rank1;
                        usedCards.push(card);
                        cardSpecs.push(card);
                    }
                    
                    // Add three kickers
                    for (let i = 0; i < 3; i++) {
                        const card = getRandomUnusedCard(usedCards, [rank1]);
                        usedCards.push(card);
                        cardSpecs.push(card);
                    }
                    break;
                }
                
                default: // high_card
                    while (cardSpecs.length < 5) {
                        const card = getRandomUnusedCard(usedCards);
                        usedCards.push(card);
                        cardSpecs.push(card);
                    }
            }
            
            // Validate no duplicate cards and ensure exactly 5 cards
            const cardStrings = new Set();
            cardSpecs.forEach(card => {
                const cardString = `${card.rank}-${card.suit}`;
                if (cardStrings.has(cardString)) {
                    throw new Error(`Duplicate card found: ${cardString}`);
                }
                cardStrings.add(cardString);
            });

            // Ensure exactly 5 cards
            if (cardSpecs.length !== 5) {
                throw new Error(`Invalid hand size: ${cardSpecs.length} cards (expected 5)`);
            }

            // Convert card specs to Card instances
            return cardSpecs.map(spec => new Card(spec.rank, spec.suit));
            
        } catch (error) {
            console.error('Error generating hand:', error);
            // If we fail to generate a specific hand, fall back to random cards
            console.log('Falling back to random hand generation');
            const cards = this.deck.dealCards(5);
            // Double check we got 5 cards
            if (cards.length !== 5) {
                console.error('Emergency: Deck dealt wrong number of cards:', cards.length);
                // Create emergency high card hand
                return [
                    new Card('A', 'spades'),
                    new Card('K', 'hearts'),
                    new Card('Q', 'diamonds'),
                    new Card('J', 'clubs'),
                    new Card('9', 'hearts')
                ];
            }
            return cards;
        }
    }

    generateThreeOfAKind() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        // Get rank for three of a kind
        const rank1 = ranks[Math.floor(Math.random() * ranks.length)];
        const usedCards = [];
        const cardSpecs = [];
        
        // Get three different suits for the three of a kind
        const suitChoices = [...suits].sort(() => Math.random() - 0.5).slice(0, 3);
        suitChoices.forEach(suit => {
            const card = new Card(rank1, suit);
            usedCards.push(card);
            cardSpecs.push(card);
        });
        
        // Get remaining ranks for the two kickers
        const remainingRanks = ranks.filter(r => r !== rank1);
        const remainingSuits = suits.filter(s => !suitChoices.includes(s));
        
        // Add two kickers with different ranks and suits
        for (let i = 0; i < 2; i++) {
            const rank = remainingRanks[Math.floor(Math.random() * remainingRanks.length)];
            const suit = remainingSuits[Math.floor(Math.random() * remainingSuits.length)];
            
            // Remove used rank and suit
            const rankIndex = remainingRanks.indexOf(rank);
            if (rankIndex > -1) remainingRanks.splice(rankIndex, 1);
            const suitIndex = remainingSuits.indexOf(suit);
            if (suitIndex > -1) remainingSuits.splice(suitIndex, 1);
            
            const card = new Card(rank, suit);
            usedCards.push(card);
            cardSpecs.push(card);
        }
        
        return cardSpecs;
    }

    checkAnswer(selectedRank) {
        console.log('Checking answer:', selectedRank);
        const isCorrect = selectedRank === this.currentHand.getRanking();
        
        if (isCorrect) {
            this.score += 1;
            if (this.gameMode === 'practice') {
                this.correctAnswers++;
            }
            try {
                this.sounds.correct?.play();
            } catch (error) {
                console.error('Error playing correct sound:', error);
            }
        } else {
            if (this.gameMode === 'practice') {
                this.wrongAnswers++;
            }
            try {
                this.sounds.wrong?.play();
            } catch (error) {
                console.error('Error playing wrong sound:', error);
            }
        }
        
        if (this.gameMode === 'practice') {
            this.updatePracticeStats();
        }
        
        // Find the selected button and the correct button
        const selectedButton = document.querySelector(`.hand-button[data-hand="${selectedRank}"]`);
        const correctButton = document.querySelector(`.hand-button[data-hand="${this.currentHand.getRanking()}"]`);
        
        // Remove any existing feedback classes
        document.querySelectorAll('.hand-button').forEach(button => {
            button.classList.remove('correct-answer', 'incorrect-answer');
        });
        
        // Disable all buttons temporarily
        document.querySelectorAll('.hand-button').forEach(button => {
            button.disabled = true;
        });
        
        // Add card feedback
        this.currentHand.cards.forEach(card => {
            const element = card.element;
            element.classList.remove('correct', 'incorrect');
            element.classList.add(isCorrect ? 'correct' : 'incorrect');
        });
        
        if (isCorrect) {
            // Show correct feedback
            selectedButton.classList.add('correct-answer');
        } else {
            // Show incorrect feedback on selected button
            selectedButton.classList.add('incorrect-answer');
            // Highlight the correct answer
            correctButton.classList.add('correct-answer');
        }
        
        // Re-enable buttons and deal new hand after delay
        setTimeout(() => {
            // Re-enable all buttons
            document.querySelectorAll('.hand-button').forEach(button => {
                button.disabled = false;
                button.classList.remove('correct-answer', 'incorrect-answer');
            });
            
            // Remove card feedback
            this.currentHand.cards.forEach(card => {
                card.element.classList.remove('correct', 'incorrect');
            });
            
            // Deal new hand
            if (this.isGameActive) {
                this.dealNewHand();
            }
        }, 3000);
        
        return isCorrect;
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

    updatePracticeStats() {
        const practiceStats = document.querySelector('.practice-stats');
        if (!practiceStats) return;
        
        const total = this.correctAnswers + this.wrongAnswers;
        const ratio = total > 0 ? ((this.correctAnswers / total) * 100).toFixed(1) : '0.0';
        
        practiceStats.innerHTML = `
            <span class="correct">${this.correctAnswers}</span> / 
            <span class="wrong">${this.wrongAnswers}</span>
            (${ratio}%)
        `;
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
