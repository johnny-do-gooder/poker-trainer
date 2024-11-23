import { Card } from './game/Card';

class Tutorial {
    constructor() {
        // Initialize all elements
        this.initializeElements();
        
        // Initialize tutorial hands
        this.initializeHands();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Show initial hand
        this.showHand();
        
        console.log('Tutorial initialized');
    }

    initializeElements() {
        // Get all required DOM elements
        this.container = document.getElementById('game-container');
        this.handName = document.getElementById('hand-name');
        this.handDescription = document.getElementById('hand-description');
        this.hint = document.getElementById('hint');
        this.progress = document.querySelector('.progress');
        
        // Get button elements
        this.prevButton = document.getElementById('prev-hand');
        this.nextButton = document.getElementById('next-hand');
        this.hintButton = document.getElementById('reveal-hint');
        
        // Validate elements exist
        if (!this.container || !this.handName || !this.handDescription || 
            !this.hint || !this.progress || !this.prevButton || 
            !this.nextButton || !this.hintButton) {
            console.error('Required elements not found!');
            return;
        }
        
        console.log('Elements initialized:', {
            container: this.container,
            handName: this.handName,
            description: this.handDescription,
            hint: this.hint,
            progress: this.progress,
            buttons: {
                prev: this.prevButton,
                next: this.nextButton,
                hint: this.hintButton
            }
        });
        
        // Initialize state
        this.currentIndex = 0;
        this.cards = [];
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        
        this.prevButton.addEventListener('click', () => {
            console.log('Previous button clicked');
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.showHand();
            }
        });
        
        this.nextButton.addEventListener('click', () => {
            console.log('Next button clicked');
            if (this.currentIndex < this.tutorialHands.length - 1) {
                this.currentIndex++;
                this.showHand();
            }
        });
        
        this.hintButton.addEventListener('click', () => {
            console.log('Hint button clicked');
            const currentHand = this.tutorialHands[this.currentIndex];
            this.hint.textContent = currentHand.hint;
        });
        
        console.log('Event listeners attached');
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
        this.hint.textContent = '';  // Clear hint until revealed
        
        // Update progress bar
        const progressPercent = ((this.currentIndex + 1) / this.tutorialHands.length) * 100;
        this.progress.style.width = `${progressPercent}%`;
        
        // Clear old cards
        const cardContainer = this.container.querySelector('.card-container');
        if (cardContainer) {
            cardContainer.innerHTML = '';
            this.cards = [];
            
            // Create and show cards
            currentHand.cards.forEach(cardCode => {
                const rank = cardCode.slice(0, -1);
                const suitSymbol = cardCode.slice(-1);
                const suit = {
                    '♥': 'hearts',
                    '♦': 'diamonds',
                    '♣': 'clubs',
                    '♠': 'spades'
                }[suitSymbol];
                
                const card = new Card(rank, suit);
                const cardElement = card.createElement();
                cardContainer.appendChild(cardElement);
                
                // Add click handler to flip card
                cardElement.addEventListener('click', () => {
                    card.flip();
                });
                
                this.cards.push(card);
            });
        }

        // Update button states
        this.prevButton.disabled = this.currentIndex === 0;
        this.nextButton.disabled = this.currentIndex === this.tutorialHands.length - 1;
    }

    initializeHands() {
        this.tutorialHands = [
            {
                name: 'Royal Flush',
                description: 'The highest possible hand: Ten, Jack, Queen, King, and Ace of the same suit.',
                hint: 'Look for consecutive highest cards (10 through Ace) all in the same suit.',
                cards: ['A♠', 'K♠', 'Q♠', 'J♠', '10♠']
            },
            {
                name: 'Straight Flush',
                description: 'Five consecutive cards of the same suit.',
                hint: 'Like a Royal Flush, but can start with any card. Example: 6, 7, 8, 9, 10',
                cards: ['9♥', '8♥', '7♥', '6♥', '5♥']
            },
            {
                name: 'Four of a Kind',
                description: 'Four cards of the same rank.',
                hint: 'Look for all four cards of the same rank (one in each suit).',
                cards: ['8♠', '8♥', '8♦', '8♣', 'K♠']
            },
            {
                name: 'Full House',
                description: 'Three cards of one rank and two cards of another rank.',
                hint: 'Look for three of a kind plus a pair.',
                cards: ['J♥', 'J♦', 'J♠', '9♣', '9♥']
            },
            {
                name: 'Flush',
                description: 'Any five cards of the same suit.',
                hint: 'All cards share the same suit, but they are not in sequence.',
                cards: ['A♥', 'J♥', '8♥', '6♥', '2♥']
            },
            {
                name: 'Straight',
                description: 'Five consecutive cards of mixed suits.',
                hint: 'Cards are in sequence but not all the same suit.',
                cards: ['9♠', '8♥', '7♦', '6♣', '5♥']
            },
            {
                name: 'Three of a Kind',
                description: 'Three cards of the same rank.',
                hint: 'Look for three cards of the same rank with two unrelated cards.',
                cards: ['Q♥', 'Q♦', 'Q♠', '8♣', '3♥']
            },
            {
                name: 'Two Pair',
                description: 'Two different pairs of cards.',
                hint: 'Look for two sets of pairs with different ranks.',
                cards: ['K♥', 'K♦', '10♠', '10♣', '5♥']
            },
            {
                name: 'One Pair',
                description: 'Two cards of the same rank.',
                hint: 'Look for just two cards of the same rank.',
                cards: ['A♥', 'A♦', 'K♠', '8♣', '4♥']
            },
            {
                name: 'High Card',
                description: 'When you do not have any of the above hands, the highest card plays.',
                hint: 'No pairs, no sequence, no same suit. Just individual cards.',
                cards: ['K♠', 'J♥', '8♦', '6♣', '2♥']
            }
        ];
    }
}

// Start the tutorial when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting Tutorial');
    window.tutorial = new Tutorial();
});
