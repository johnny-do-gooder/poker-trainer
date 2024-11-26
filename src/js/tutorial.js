import { Card } from './game/Card';

export class Tutorial {
    constructor() {
        console.log('[Tutorial] Starting tutorial initialization');
        // Clean up any existing card container content
        const existingContainer = document.querySelector('.card-container');
        if (existingContainer) {
            while (existingContainer.firstChild) {
                existingContainer.removeChild(existingContainer.firstChild);
            }
        }
        
        // Initialize all elements
        this.initializeElements();
        
        // Initialize tutorial hands
        this.initializeHands();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize game state
        this.gameState = {
            isAnimating: false,
            isTransitioning: false
        };
        
        console.log('[Tutorial] Tutorial initialized');
    }

    start() {
        // Show initial hand
        this.currentIndex = 0;
        this.showHand(this.currentIndex);
        this.updateNavigationButtons();
    }

    initializeElements() {
        // Get all required DOM elements
        this.cardContainer = document.querySelector('.card-container');
        this.handName = document.getElementById('hand-name');
        this.handDescription = document.getElementById('hand-description');
        this.prevButton = document.getElementById('prev-tutorial');
        this.nextButton = document.getElementById('next-tutorial');
        this.progress = document.querySelector('.progress');
        this.returnToMenuButton = document.getElementById('return-to-menu');

        // Validate elements exist
        if (!this.cardContainer || !this.handName || !this.handDescription || 
            !this.progress || !this.prevButton || !this.nextButton) {
            console.error('Required elements not found!');
            return;
        }
        
        // Initialize state
        this.currentIndex = 0;
        this.cards = [];
    }

    initializeHands() {
        // Store the hand types
        this.tutorialHands = [
            {
                name: "Royal Flush",
                description: "The highest possible hand in poker. A straight flush from 10 to Ace, all in the same suit.",
                cards: ["AS", "KS", "QS", "JS", "TS"]  // Using Spades for consistency
            },
            {
                name: "Straight Flush",
                description: "Five consecutive cards of the same suit.",
                cards: ["9H", "8H", "7H", "6H", "5H"]  // 9-5 Hearts
            },
            {
                name: "Four of a Kind",
                description: "Four cards of the same rank.",
                cards: ["KH", "KD", "KC", "KS", "2C"]  // Kings
            },
            {
                name: "Full House",
                description: "Three cards of one rank and two cards of another rank.",
                cards: ["JH", "JD", "JC", "9S", "9C"]  // Jacks over Nines
            },
            {
                name: "Flush",
                description: "Any five cards of the same suit.",
                cards: ["AH", "JH", "8H", "6H", "2H"]  // Ace-high Hearts
            },
            {
                name: "Straight",
                description: "Five consecutive cards of different suits.",
                cards: ["9S", "8H", "7D", "6C", "5H"]  // 9-high
            },
            {
                name: "Three of a Kind",
                description: "Three cards of the same rank.",
                cards: ["7H", "7D", "7C", "KS", "2C"]  // Three Sevens
            },
            {
                name: "Two Pair",
                description: "Two different pairs of cards.",
                cards: ["AH", "AD", "KS", "KC", "2C"]  // Aces and Kings
            },
            {
                name: "One Pair",
                description: "Two cards of the same rank.",
                cards: ["QH", "QD", "AS", "8C", "3H"]  // Pair of Queens
            },
            {
                name: "High Card",
                description: "When you don't have any of the above hands, your highest card plays.",
                cards: ["AH", "JD", "8S", "6C", "2H"]  // Ace-high
            }
        ];
        
        console.log('[Tutorial] Initialized hands:', this.tutorialHands.length);
    }

    setupEventListeners() {
        // Previous button click handler
        this.prevButton.addEventListener('click', () => {
            console.log('Previous button clicked');
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.showHand(this.currentIndex);
                this.updateNavigationButtons();
            }
        });

        // Next button click handler
        this.nextButton.addEventListener('click', () => {
            console.log('Next button clicked');
            if (this.currentIndex < this.tutorialHands.length - 1) {
                this.currentIndex++;
                this.showHand(this.currentIndex);
                this.updateNavigationButtons();
            } else {
                // Tutorial complete
                document.getElementById('tutorial-overlay').style.display = 'none';
                document.getElementById('tutorial-complete').style.display = 'flex';
            }
        });

        // Add click handlers for cards
        this.cardContainer.addEventListener('click', (e) => {
            if (this.gameState.isTransitioning) return;
            const cardElement = e.target.closest('.card');
            if (cardElement) {
                const index = Array.from(this.cardContainer.children).indexOf(cardElement);
                if (index !== -1 && this.cards[index]) {
                    this.cards[index].flip();
                }
            }
        });
    }

    updateNavigationButtons() {
        this.prevButton.disabled = this.currentIndex === 0;
        this.nextButton.textContent = this.currentIndex === this.tutorialHands.length - 1 ? 'Finish' : 'Next';
    }

    showHand(index) {
        if (index < 0 || index >= this.tutorialHands.length) {
            console.error('[Tutorial] Invalid hand index:', index);
            return;
        }

        this.currentIndex = index;
        const currentHand = this.tutorialHands[index];
        
        // Update hand name and description
        this.handName.textContent = currentHand.name;
        this.handDescription.textContent = currentHand.description;
        
        // Update progress bar
        const progress = ((this.currentIndex + 1) / this.tutorialHands.length) * 100;
        this.progress.style.width = `${progress}%`;
        
        // Clean up existing cards
        if (this.cards) {
            console.log('[Tutorial] Cleaning up existing cards');
            this.cards.forEach(card => card.cleanup());
            this.cards = [];
        }
        
        // Clear card container
        if (this.cardContainer) {
            console.log('[Tutorial] Clearing card container');
            this.cardContainer.innerHTML = '';
            
            // Create and display new cards
            if (currentHand.cards) {
                console.log(`[Tutorial] Creating cards for hand: ${currentHand.name} (${currentHand.cards.join(', ')})`);
                this.cards = currentHand.cards.map((cardCode, index) => {
                    console.log(`[Tutorial] Creating card ${index + 1}/${currentHand.cards.length}: ${cardCode}`);
                    const card = Card.fromCode(cardCode, true);
                    card.attachToDOM(this.cardContainer);
                    return card;
                });
                console.log(`[Tutorial] Created ${this.cards.length} cards for ${currentHand.name}`);
            }
        }
    }

    cleanup() {
        console.log('[Tutorial] Starting cleanup');
        
        // Clean up cards
        if (this.cards) {
            console.log('[Tutorial] Cleaning up cards');
            this.cards.forEach(card => card.cleanup());
            this.cards = [];
        }

        // Clean up any remaining card instances
        console.log('[Tutorial] Cleaning up all remaining card instances');
        Card.cleanup();

        // Clean up DOM elements
        if (this.cardContainer) {
            console.log('[Tutorial] Clearing card container');
            while (this.cardContainer.firstChild) {
                this.cardContainer.removeChild(this.cardContainer.firstChild);
            }
        }

        // Reset state
        this.currentIndex = 0;
        this.gameState = {
            isAnimating: false,
            isTransitioning: false
        };

        console.log('[Tutorial] Cleanup complete');
    }
}

// Initialize tutorial when needed from main.js
// Remove the auto-start behavior since main.js handles this
