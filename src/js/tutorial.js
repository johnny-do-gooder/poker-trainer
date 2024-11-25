import { Card } from './game/Card';

export class Tutorial {
    constructor() {
        // Initialize all elements
        this.initializeElements();
        
        // Initialize tutorial hands
        this.initializeHands();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Show initial hand
        this.showHand();
        
        // Initialize game state
        this.gameState = {
            isAnimating: false,
            isTransitioning: false
        };
        
        console.log('Tutorial initialized');
    }

    initializeElements() {
        // Get all required DOM elements
        this.cardContainer = document.querySelector('.card-container');
        this.handName = document.getElementById('hand-name');
        this.handDescription = document.getElementById('hand-description');
        this.progress = document.querySelector('.progress');
        
        // Get button elements
        this.prevButton = document.getElementById('prev-tutorial');
        this.nextButton = document.getElementById('next-tutorial');
        
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
        const handTypes = [
            {
                name: "Royal Flush",
                description: "The highest possible hand in poker. A straight flush from 10 to Ace, all in the same suit.",
                variations: [
                    ["AS", "KS", "QS", "JS", "TS"],  // Spades
                    ["AH", "KH", "QH", "JH", "TH"],  // Hearts
                    ["AD", "KD", "QD", "JD", "TD"]   // Diamonds
                ]
            },
            {
                name: "Straight Flush",
                description: "Five consecutive cards of the same suit.",
                variations: [
                    ["9H", "8H", "7H", "6H", "5H"],  // 9-5 Hearts
                    ["8D", "7D", "6D", "5D", "4D"],  // 8-4 Diamonds
                    ["7S", "6S", "5S", "4S", "3S"]   // 7-3 Spades
                ]
            },
            {
                name: "Four of a Kind",
                description: "Four cards of the same rank.",
                variations: [
                    ["KH", "KD", "KC", "KS", "2C"],  // Kings
                    ["AH", "AD", "AC", "AS", "3D"],  // Aces
                    ["QH", "QD", "QC", "QS", "4H"]   // Queens
                ]
            },
            {
                name: "Full House",
                description: "Three cards of one rank and two cards of another rank.",
                variations: [
                    ["JH", "JD", "JC", "9S", "9C"],  // Jacks over Nines
                    ["TH", "TD", "TC", "KS", "KD"],  // Tens over Kings
                    ["8H", "8D", "8C", "AS", "AD"]   // Eights over Aces
                ]
            },
            {
                name: "Flush",
                description: "Any five cards of the same suit.",
                variations: [
                    ["AH", "JH", "8H", "6H", "2H"],  // Ace-high Hearts
                    ["KS", "QS", "9S", "7S", "3S"],  // King-high Spades
                    ["QD", "JD", "8D", "5D", "2D"]   // Queen-high Diamonds
                ]
            },
            {
                name: "Straight",
                description: "Five consecutive cards of different suits.",
                variations: [
                    ["9S", "8H", "7D", "6C", "5H"],  // 9-high
                    ["8D", "7S", "6H", "5D", "4C"],  // 8-high
                    ["JH", "TS", "9D", "8C", "7H"]   // Jack-high
                ]
            },
            {
                name: "Three of a Kind",
                description: "Three cards of the same rank.",
                variations: [
                    ["7H", "7D", "7C", "KS", "2C"],  // Three Sevens
                    ["TH", "TD", "TC", "AS", "4D"],  // Three Tens
                    ["5H", "5D", "5C", "KS", "JD"]   // Three Fives
                ]
            },
            {
                name: "Two Pair",
                description: "Two different pairs of cards.",
                variations: [
                    ["AH", "AD", "KS", "KC", "2C"],  // Aces and Kings
                    ["QH", "QD", "JS", "JC", "3H"],  // Queens and Jacks
                    ["TH", "TD", "9S", "9C", "4D"]   // Tens and Nines
                ]
            },
            {
                name: "One Pair",
                description: "Two cards of the same rank.",
                variations: [
                    ["QH", "QD", "AS", "8C", "3H"],  // Pair of Queens
                    ["KH", "KD", "JS", "7C", "2H"],  // Pair of Kings
                    ["JH", "JD", "AS", "9C", "4H"]   // Pair of Jacks
                ]
            },
            {
                name: "High Card",
                description: "When you don't have any of the above hands, your highest card plays.",
                variations: [
                    ["AH", "JD", "8S", "6C", "2H"],  // Ace-high
                    ["KH", "QD", "9S", "7C", "3H"],  // King-high
                    ["QH", "JD", "8S", "6C", "4H"]   // Queen-high
                ]
            }
        ];

        // Expand the hand types into individual hands
        this.tutorialHands = handTypes.flatMap(handType => 
            handType.variations.map(cards => ({
                name: handType.name,
                description: handType.description,
                cards: cards
            }))
        );
    }

    setupEventListeners() {
        this.prevButton.addEventListener('click', () => {
            if (this.gameState.isTransitioning) return;
            console.log('Previous button clicked');
            if (this.currentIndex > 0) {
                this.gameState.isTransitioning = true;
                this.currentIndex--;
                this.showHand();
                this.gameState.isTransitioning = false;
            }
            this.updateNavigationButtons();
        });
        
        this.nextButton.addEventListener('click', () => {
            if (this.gameState.isTransitioning) return;
            console.log('Next button clicked');
            if (this.currentIndex < this.tutorialHands.length - 1) {
                this.gameState.isTransitioning = true;
                // Animate current cards as correct
                this.cards.forEach(card => card.animateCorrect());
                setTimeout(() => {
                    this.currentIndex++;
                    this.showHand();
                    this.gameState.isTransitioning = false;
                }, 600);
            } else {
                // End of tutorial, show menu and enable practice mode
                document.getElementById('tutorial-overlay').style.display = 'none';
                document.getElementById('menu').style.display = 'flex';
            }
            this.updateNavigationButtons();
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

    showHand() {
        console.log('Showing hand:', this.currentIndex);
        const currentHand = this.tutorialHands[this.currentIndex];
        
        if (!currentHand) {
            console.error('No hand found at index:', this.currentIndex);
            return;
        }

        // Update text content
        this.handName.textContent = currentHand.name;
        this.handDescription.textContent = currentHand.description;
        
        // Update progress bar
        const progress = ((this.currentIndex + 1) / this.tutorialHands.length) * 100;
        this.progress.style.width = `${progress}%`;
        
        // Clear existing cards
        this.cardContainer.innerHTML = '';
        this.cards = [];
        
        // Create and display new cards
        currentHand.cards.forEach(cardCode => {
            const card = Card.fromCode(cardCode);
            const cardElement = card.createElement();
            this.cardContainer.appendChild(cardElement);
            this.cards.push(card);
        });
        
        this.updateNavigationButtons();
    }
}

// Start the tutorial when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting Tutorial');
    window.tutorial = new Tutorial();
});
