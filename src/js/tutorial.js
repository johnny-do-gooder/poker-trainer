import { Card } from './game/Card.js';

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
        console.log('[Tutorial] Starting tutorial');
        // Show initial hand
        this.currentIndex = 0;
        this.showHand(this.currentIndex);
        this.updateNavigationButtons();
        document.getElementById('tutorial-overlay').style.display = 'flex';
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
            // Basic Hands (1-10)
            {
                name: "Royal Flush",
                description: "The highest possible hand in poker. A straight flush from 10 to Ace, all in the same suit.",
                cards: ["AS", "KS", "QS", "JS", "TS"]
            },
            {
                name: "Straight Flush",
                description: "Five consecutive cards of the same suit.",
                cards: ["9H", "8H", "7H", "6H", "5H"]
            },
            {
                name: "Four of a Kind",
                description: "Four cards of the same rank.",
                cards: ["KH", "KD", "KC", "KS", "2C"]
            },
            {
                name: "Full House",
                description: "Three cards of one rank and two cards of another rank.",
                cards: ["JH", "JD", "JC", "9S", "9C"]
            },
            {
                name: "Flush",
                description: "Any five cards of the same suit.",
                cards: ["AH", "JH", "8H", "6H", "2H"]
            },
            {
                name: "Straight",
                description: "Five consecutive cards of different suits.",
                cards: ["9S", "8H", "7D", "6C", "5H"]
            },
            {
                name: "Three of a Kind",
                description: "Three cards of the same rank.",
                cards: ["7H", "7D", "7C", "KS", "2C"]
            },
            {
                name: "Two Pair",
                description: "Two different pairs of cards.",
                cards: ["AH", "AD", "KS", "KC", "2C"]
            },
            {
                name: "One Pair",
                description: "Two cards of the same rank.",
                cards: ["QH", "QD", "AS", "8C", "3H"]
            },
            {
                name: "High Card",
                description: "When you don't have any of the above hands, your highest card plays.",
                cards: ["AH", "JD", "8S", "6C", "2H"]
            },
            // Advanced Examples (11-20)
            {
                name: "Steel Wheel",
                description: "A special type of straight flush: Ace through 5 in the same suit.",
                cards: ["AS", "2S", "3S", "4S", "5S"]
            },
            {
                name: "Broadway Straight",
                description: "A straight from Ten to Ace, also known as a Broadway.",
                cards: ["AC", "KC", "QH", "JD", "TS"]
            },
            {
                name: "Wheel Straight",
                description: "The lowest possible straight: Ace through 5.",
                cards: ["AC", "2D", "3H", "4S", "5C"]
            },
            {
                name: "Pocket Rockets",
                description: "A pair of Aces, the highest possible pair.",
                cards: ["AH", "AD", "KS", "QC", "JH"]
            },
            {
                name: "Monster Full House",
                description: "The highest possible full house: Aces full of Kings.",
                cards: ["AH", "AD", "AC", "KS", "KH"]
            },
            {
                name: "Mini Full House",
                description: "The lowest possible full house: Twos full of Threes.",
                cards: ["2H", "2D", "2C", "3S", "3H"]
            },
            {
                name: "Suited Connectors",
                description: "Adjacent cards of the same suit, valuable for making straights and flushes.",
                cards: ["JH", "TH", "9H", "8H", "7H"]
            },
            {
                name: "Rainbow Straight",
                description: "A straight where each card is a different suit.",
                cards: ["8H", "7S", "6D", "5C", "4H"]
            },
            {
                name: "Quads with Kicker",
                description: "Four of a kind with the highest possible kicker.",
                cards: ["QH", "QD", "QS", "QC", "AH"]
            },
            {
                name: "Double Suited",
                description: "Two pairs where each pair shares the same suit.",
                cards: ["AH", "AD", "KH", "KD", "2C"]
            },
            // Special Situations (21-30)
            {
                name: "Almost Royal",
                description: "One card away from a Royal Flush, showing the importance of drawing hands.",
                cards: ["AS", "KS", "QS", "JS", "9S"]
            },
            {
                name: "Four to a Straight Flush",
                description: "Four cards to a potential straight flush, a powerful drawing hand.",
                cards: ["7H", "6H", "5H", "4H", "2S"]
            },
            {
                name: "Trips vs Set",
                description: "Three of a kind made differently: two in hand, one on board (set) is stronger.",
                cards: ["8H", "8D", "8C", "AH", "KD"]
            },
            {
                name: "Backdoor Flush Draw",
                description: "Three cards of the same suit, potential for a flush with two perfect cards.",
                cards: ["AH", "KH", "QH", "JS", "TD"]
            },
            {
                name: "Gutshot Straight Draw",
                description: "Four cards to a straight with one missing card in the middle.",
                cards: ["QH", "JD", "9S", "8C", "7H"]
            },
            {
                name: "Open-Ended Straight Draw",
                description: "Four consecutive cards that can make a straight with a card at either end.",
                cards: ["9H", "8D", "7S", "6C", "4H"]
            },
            {
                name: "Overcard Draw",
                description: "High cards that haven't paired but could make a strong hand.",
                cards: ["AH", "KD", "7S", "5C", "2H"]
            },
            {
                name: "Double Gutter Draw",
                description: "A unique straight draw that can be completed by cards at two different positions.",
                cards: ["TH", "8D", "7S", "6C", "4H"]
            },
            {
                name: "Ace-High Flush Draw",
                description: "Four cards to a flush with an Ace, a very strong drawing hand.",
                cards: ["AH", "JH", "8H", "5H", "2C"]
            },
            {
                name: "Double Paired Board",
                description: "Two pairs with potential for a full house, showing board texture reading.",
                cards: ["TH", "TD", "7S", "7C", "AH"]
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
                console.log('[Tutorial] Completing tutorial');
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
        console.log('[Tutorial] Updating to step:', this.currentIndex);
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
