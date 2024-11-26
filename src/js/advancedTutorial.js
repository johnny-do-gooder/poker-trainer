import { Card } from './game/Card';

export class AdvancedTutorial {
    constructor() {
        console.log('[AdvancedTutorial] Starting advanced tutorial initialization');
        // Clean up any existing card container content
        const existingContainer = document.querySelector('.advanced-card-container');
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
        
        console.log('[AdvancedTutorial] Advanced tutorial initialized');
    }

    start() {
        console.log('[AdvancedTutorial] Starting advanced tutorial');
        // Show initial hand
        this.currentIndex = 0;
        this.showHand(this.currentIndex);
        this.updateNavigationButtons();
        document.getElementById('advanced-tutorial-overlay').style.display = 'flex';
    }

    initializeElements() {
        // Get all required DOM elements
        this.cardContainer = document.querySelector('.advanced-card-container');
        this.handName = document.getElementById('advanced-hand-name');
        this.handDescription = document.getElementById('advanced-hand-description');
        this.prevButton = document.getElementById('prev-advanced');
        this.nextButton = document.getElementById('next-advanced');
        this.progress = document.querySelector('.advanced-progress');
        this.returnToMenuButton = document.getElementById('return-to-menu');

        // Validate elements exist
        if (!this.cardContainer || !this.handName || !this.handDescription || 
            !this.progress || !this.prevButton || !this.nextButton) {
            console.error('[AdvancedTutorial] Required elements not found!');
            return;
        }
        
        // Initialize state
        this.currentIndex = 0;
        this.cards = [];
    }

    initializeHands() {
        // Store the advanced hand types
        this.tutorialHands = [
            // Advanced Examples (1-10)
            {
                name: "Steel Wheel",
                description: "A special type of straight flush: Ace through 5 in the same suit. This is the lowest possible straight flush.",
                cards: ["AS", "2S", "3S", "4S", "5S"]
            },
            {
                name: "Broadway Straight",
                description: "A straight from Ten to Ace, also known as a Broadway. This is the highest possible straight without being a straight flush.",
                cards: ["AC", "KC", "QH", "JD", "TS"]
            },
            {
                name: "Wheel Straight",
                description: "The lowest possible straight: Ace through 5. The Ace plays as a low card in this case.",
                cards: ["AC", "2D", "3H", "4S", "5C"]
            },
            {
                name: "Pocket Rockets",
                description: "A pair of Aces, the highest possible pair. In Texas Hold'em, this is the strongest starting hand.",
                cards: ["AH", "AD", "KS", "QC", "JH"]
            },
            {
                name: "Monster Full House",
                description: "The highest possible full house: Aces full of Kings. This hand loses only to four of a kind and straight flushes.",
                cards: ["AH", "AD", "AC", "KS", "KH"]
            },
            {
                name: "Mini Full House",
                description: "The lowest possible full house: Twos full of Threes. Even the lowest full house beats any flush or straight.",
                cards: ["2H", "2D", "2C", "3S", "3H"]
            },
            {
                name: "Suited Connectors",
                description: "Adjacent cards of the same suit. These cards have great potential for making straights and flushes, making them valuable drawing hands.",
                cards: ["JH", "TH", "9H", "8H", "7H"]
            },
            {
                name: "Rainbow Straight",
                description: "A straight where each card is a different suit. While not as strong as a straight flush, it's still a powerful hand.",
                cards: ["8H", "7S", "6D", "5C", "4H"]
            },
            {
                name: "Quads with Kicker",
                description: "Four of a kind with the highest possible kicker. In this case, four Queens with an Ace kicker is a very strong hand.",
                cards: ["QH", "QD", "QS", "QC", "AH"]
            },
            {
                name: "Double Suited",
                description: "Two pairs where each pair shares the same suit. This pattern can be valuable for making flushes while already having strong pairs.",
                cards: ["AH", "AD", "KH", "KD", "2C"]
            },
            // Drawing Hands and Special Situations (11-20)
            {
                name: "Almost Royal",
                description: "One card away from a Royal Flush. This is a powerful drawing hand as you could make the highest possible poker hand.",
                cards: ["AS", "KS", "QS", "JS", "9S"]
            },
            {
                name: "Four to a Straight Flush",
                description: "Four cards to a potential straight flush. This is one of the strongest drawing hands possible, with potential for both a straight and a flush.",
                cards: ["7H", "6H", "5H", "4H", "2S"]
            },
            {
                name: "Trips vs Set",
                description: "Three of a kind made differently: two in hand, one on board (set) is stronger than two on board, one in hand (trips).",
                cards: ["8H", "8D", "8C", "AH", "KD"]
            },
            {
                name: "Backdoor Flush Draw",
                description: "Three cards of the same suit. While weaker than a four-card flush draw, it can still make a flush with the right cards.",
                cards: ["AH", "KH", "QH", "JS", "TD"]
            },
            {
                name: "Gutshot Straight Draw",
                description: "Four cards to a straight with one missing card in the middle. Also known as an inside straight draw, it needs exactly one specific card to complete.",
                cards: ["QH", "JD", "9S", "8C", "7H"]
            },
            {
                name: "Open-Ended Straight Draw",
                description: "Four consecutive cards that can make a straight with a card at either end. This is stronger than a gutshot as it has twice as many outs.",
                cards: ["9H", "8D", "7S", "6C", "4H"]
            },
            {
                name: "Overcard Draw",
                description: "High cards that haven't paired but could make strong pairs. These hands have potential to win even without making a straight or flush.",
                cards: ["AH", "KD", "7S", "5C", "2H"]
            },
            {
                name: "Double Gutter Draw",
                description: "A unique straight draw that can be completed by cards at two different positions. This hand has eight outs to make a straight.",
                cards: ["TH", "8D", "7S", "6C", "4H"]
            },
            {
                name: "Ace-High Flush Draw",
                description: "Four cards to a flush with an Ace. This is the strongest possible flush draw, as completing it gives you the nut flush.",
                cards: ["AH", "JH", "8H", "5H", "2C"]
            },
            {
                name: "Double Paired Board",
                description: "Two pairs with potential for a full house. Understanding board texture helps in reading opponents' possible hands.",
                cards: ["TH", "TD", "7S", "7C", "AH"]
            }
        ];
        
        console.log('[AdvancedTutorial] Initialized hands:', this.tutorialHands.length);
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
                console.log('[AdvancedTutorial] Completing advanced tutorial');
                document.getElementById('advanced-tutorial-overlay').style.display = 'none';
                document.getElementById('advanced-tutorial-complete').style.display = 'flex';
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
        console.log('[AdvancedTutorial] Updating to step:', this.currentIndex);
        this.prevButton.disabled = this.currentIndex === 0;
        this.nextButton.textContent = this.currentIndex === this.tutorialHands.length - 1 ? 'Finish' : 'Next';
    }

    showHand(index) {
        if (index < 0 || index >= this.tutorialHands.length) {
            console.error('[AdvancedTutorial] Invalid hand index:', index);
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
            console.log('[AdvancedTutorial] Cleaning up existing cards');
            this.cards.forEach(card => card.cleanup());
            this.cards = [];
        }
        
        // Clear card container
        if (this.cardContainer) {
            console.log('[AdvancedTutorial] Clearing card container');
            this.cardContainer.innerHTML = '';
            
            // Create and display new cards
            if (currentHand.cards) {
                console.log(`[AdvancedTutorial] Creating cards for hand: ${currentHand.name} (${currentHand.cards.join(', ')})`);
                this.cards = currentHand.cards.map((cardCode, index) => {
                    console.log(`[AdvancedTutorial] Creating card ${index + 1}/${currentHand.cards.length}: ${cardCode}`);
                    const card = Card.fromCode(cardCode, true);
                    card.attachToDOM(this.cardContainer);
                    return card;
                });
            }
        }
    }

    cleanup() {
        console.log('[AdvancedTutorial] Cleaning up resources');
        if (this.cards) {
            this.cards.forEach(card => card.cleanup());
            this.cards = [];
        }
    }
}
