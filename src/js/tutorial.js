import { Card } from './game/Card.js';
import { Game } from './game/Game.js';

class Tutorial {
    constructor() {
        console.log('DOM loaded, initializing tutorial');
        
        // Initialize containers
        this.cardContainer = document.getElementById('card-container');
        this.handButtons = document.getElementById('hand-buttons');
        this.handName = document.getElementById('hand-name');
        this.handDescription = document.getElementById('hand-description');
        this.phaseIndicator = document.getElementById('phase-indicator');
        this.progress = document.getElementById('progress');
        this.hint = document.getElementById('hint');
        
        // Initialize buttons
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.hintBtn = document.getElementById('hint-btn');
        this.skipBtn = document.getElementById('skip-btn');
        this.returnBtn = document.getElementById('return-btn');
        
        // Bind event listeners
        this.prevBtn.addEventListener('click', () => this.previousHand());
        this.nextBtn.addEventListener('click', () => this.nextHand());
        this.hintBtn.addEventListener('click', () => this.toggleHint());
        this.skipBtn.addEventListener('click', () => this.skipToPractice());
        this.returnBtn.addEventListener('click', () => this.returnToTutorial());
        
        // Initialize tutorial state
        this.currentHandIndex = 0;
        this.currentPhase = 'description';
        this.cards = [];
        this.game = null;
        
        // Define base poker hands for generating examples
        this.basePokerHands = [
            {
                name: "Royal Flush",
                description: "The highest possible hand: the ace, king, queen, jack and ten of the same suit.",
                hint: "Notice how all cards are of the same suit and form a sequence from 10 to Ace.",
                generator: () => this.generateRoyalFlush()
            },
            {
                name: "Straight Flush",
                description: "Five cards of the same suit in sequence.",
                hint: "Like a Royal Flush, but can be any consecutive sequence of the same suit.",
                generator: () => this.generateStraightFlush()
            },
            {
                name: "Four of a Kind",
                description: "Four cards of the same rank, plus any fifth card.",
                hint: "Focus on the four cards of the same rank - the fifth card doesn't matter.",
                generator: () => this.generateFourOfAKind()
            },
            {
                name: "Full House",
                description: "Three cards of one rank plus two cards of another rank.",
                hint: "Look for the three matching cards (three of a kind) and the two matching cards (pair).",
                generator: () => this.generateFullHouse()
            },
            {
                name: "Flush",
                description: "Any five cards of the same suit.",
                hint: "The cards don't need to be in sequence, they just need to all be the same suit.",
                generator: () => this.generateFlush()
            },
            {
                name: "Straight",
                description: "Five cards in sequence, of mixed suits.",
                hint: "Focus on the ranks forming a sequence - the suits don't matter.",
                generator: () => this.generateStraight()
            },
            {
                name: "Three of a Kind",
                description: "Three cards of the same rank, plus two unmatched cards.",
                hint: "Look for the three matching cards - the other two cards don't matter.",
                generator: () => this.generateThreeOfAKind()
            },
            {
                name: "Two Pair",
                description: "Two cards of one rank, two cards of another rank, plus any card.",
                hint: "Find the two different pairs - the fifth card doesn't matter.",
                generator: () => this.generateTwoPair()
            },
            {
                name: "One Pair",
                description: "Two cards of the same rank, plus three unmatched cards.",
                hint: "Focus on finding the matching pair - the other three cards don't matter.",
                generator: () => this.generateOnePair()
            },
            {
                name: "High Card",
                description: "When you haven't made any of the hands above, the highest card plays.",
                hint: "With no matching cards or sequences, the highest individual card determines the hand's value.",
                generator: () => this.generateHighCard()
            }
        ];
        
        // Generate 30 examples
        this.generateExamples();
        
        // Initialize the first hand
        this.showHand();
        this.updatePhaseUI();
        
        console.log('Tutorial initialized');
    }
    
    generateExamples() {
        this.pokerHands = [];
        // Generate 3 examples of each hand type
        for (let i = 0; i < 3; i++) {
            for (const baseHand of this.basePokerHands) {
                const example = {
                    name: baseHand.name,
                    description: baseHand.description,
                    hint: baseHand.hint,
                    cards: baseHand.generator()
                };
                this.pokerHands.push(example);
            }
        }
    }
    
    // Hand generation methods
    generateRoyalFlush() {
        const suit = this.getRandomSuit();
        return [
            { rank: "A", suit },
            { rank: "K", suit },
            { rank: "Q", suit },
            { rank: "J", suit },
            { rank: "10", suit }
        ];
    }
    
    generateStraightFlush() {
        const suit = this.getRandomSuit();
        const startRank = this.getRandomInt(1, 9); // 9 is max to ensure we can make 5 consecutive cards
        return Array.from({ length: 5 }, (_, i) => ({
            rank: this.numberToRank(startRank + i),
            suit
        }));
    }
    
    generateFourOfAKind() {
        const rank = this.getRandomRank();
        const kicker = this.getRandomRankExcept(rank);
        const kickerSuit = this.getRandomSuit();
        return [
            { rank, suit: "hearts" },
            { rank, suit: "diamonds" },
            { rank, suit: "clubs" },
            { rank, suit: "spades" },
            { rank: kicker, suit: kickerSuit }
        ];
    }
    
    generateFullHouse() {
        const rank1 = this.getRandomRank();
        const rank2 = this.getRandomRankExcept(rank1);
        return [
            { rank: rank1, suit: "hearts" },
            { rank: rank1, suit: "diamonds" },
            { rank: rank1, suit: "clubs" },
            { rank: rank2, suit: "hearts" },
            { rank: rank2, suit: "diamonds" }
        ];
    }
    
    generateFlush() {
        const suit = this.getRandomSuit();
        const ranks = this.getRandomUniqueRanks(5);
        return ranks.map(rank => ({ rank, suit }));
    }
    
    generateStraight() {
        const startRank = this.getRandomInt(1, 9);
        return Array.from({ length: 5 }, (_, i) => ({
            rank: this.numberToRank(startRank + i),
            suit: this.getRandomSuit()
        }));
    }
    
    generateThreeOfAKind() {
        const rank = this.getRandomRank();
        const [kicker1, kicker2] = this.getRandomUniqueRanks(2, [rank]);
        return [
            { rank, suit: "hearts" },
            { rank, suit: "diamonds" },
            { rank, suit: "clubs" },
            { rank: kicker1, suit: "hearts" },
            { rank: kicker2, suit: "diamonds" }
        ];
    }
    
    generateTwoPair() {
        const [rank1, rank2] = this.getRandomUniqueRanks(2);
        const kicker = this.getRandomRankExcept([rank1, rank2]);
        return [
            { rank: rank1, suit: "hearts" },
            { rank: rank1, suit: "diamonds" },
            { rank: rank2, suit: "clubs" },
            { rank: rank2, suit: "spades" },
            { rank: kicker, suit: "hearts" }
        ];
    }
    
    generateOnePair() {
        const rank = this.getRandomRank();
        const [kicker1, kicker2, kicker3] = this.getRandomUniqueRanks(3, [rank]);
        return [
            { rank, suit: "hearts" },
            { rank, suit: "diamonds" },
            { rank: kicker1, suit: "clubs" },
            { rank: kicker2, suit: "spades" },
            { rank: kicker3, suit: "hearts" }
        ];
    }
    
    generateHighCard() {
        const ranks = this.getRandomUniqueRanks(5);
        const suits = ["hearts", "diamonds", "clubs", "spades", "hearts"];
        return ranks.map((rank, i) => ({ rank, suit: suits[i] }));
    }
    
    // Helper methods
    getRandomSuit() {
        const suits = ["hearts", "diamonds", "clubs", "spades"];
        return suits[Math.floor(Math.random() * suits.length)];
    }
    
    getRandomRank() {
        const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        return ranks[Math.floor(Math.random() * ranks.length)];
    }
    
    getRandomRankExcept(excludeRanks) {
        const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
            .filter(r => !excludeRanks.includes(r));
        return ranks[Math.floor(Math.random() * ranks.length)];
    }
    
    getRandomUniqueRanks(count, exclude = []) {
        const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
            .filter(r => !exclude.includes(r));
        return this.shuffleArray(ranks).slice(0, count);
    }
    
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    numberToRank(num) {
        if (num <= 10) return num.toString();
        const faceCards = { 11: "J", 12: "Q", 13: "K", 14: "A" };
        return faceCards[num];
    }
    
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    updatePhaseUI() {
        const totalExamples = this.pokerHands.length;
        if (this.currentPhase === 'description') {
            this.phaseIndicator.textContent = `Learning Phase: Example ${this.currentHandIndex + 1}/${totalExamples}`;
            this.handDescription.style.display = 'block';
            this.hint.style.display = 'none';
            this.hintBtn.style.display = 'block';
        } else {
            this.phaseIndicator.textContent = 'Practice Phase';
            this.handDescription.style.display = 'none';
            this.hintBtn.style.display = 'none';
            this.skipBtn.style.display = 'none';
        }
    }
    
    showHand() {
        const currentHand = this.pokerHands[this.currentHandIndex];
        console.log('Showing hand:', currentHand);
        
        // Update text content
        this.handName.textContent = currentHand.name;
        this.handDescription.textContent = currentHand.description;
        this.hint.textContent = currentHand.hint;
        
        // Clear existing cards
        this.cardContainer.innerHTML = '';
        this.cards = [];
        
        // Create new cards
        currentHand.cards.forEach((cardData, index) => {
            try {
                console.log(`Creating card ${index + 1}:`, cardData);
                const card = new Card(cardData.rank, cardData.suit);
                const cardElement = card.createElement();
                this.cards.push(card);
                this.cardContainer.appendChild(cardElement);
                
                // Add click handler to flip card
                cardElement.addEventListener('click', () => {
                    console.log(`Flipping card ${index + 1}`);
                    card.flip();
                });
                
                // Auto-flip after a short delay
                setTimeout(() => card.flip(), 100 * (index + 1));
            } catch (error) {
                console.error(`Error creating card ${index + 1}:`, error);
            }
        });
        
        // Update progress bar
        const progress = ((this.currentHandIndex + 1) / this.pokerHands.length) * 100;
        this.progress.style.width = `${progress}%`;
        
        // Update button states
        this.prevBtn.disabled = this.currentHandIndex === 0;
        this.nextBtn.disabled = false;
        this.nextBtn.textContent = this.currentHandIndex === this.pokerHands.length - 1 ? 'Start Practice' : 'Next';
        
        // Update phase-specific UI
        this.updatePhaseUI();
    }
    
    previousHand() {
        if (this.currentHandIndex > 0) {
            this.currentHandIndex--;
            this.showHand();
        }
    }
    
    nextHand() {
        if (this.currentHandIndex < this.pokerHands.length - 1) {
            this.currentHandIndex++;
            this.showHand();
        } else {
            this.startPracticeMode();
        }
    }
    
    skipToPractice() {
        console.log('Skipping to practice mode');
        
        // Hide tutorial elements
        this.handName.style.display = 'none';
        this.handDescription.style.display = 'none';
        this.prevBtn.style.display = 'none';
        this.nextBtn.style.display = 'none';
        this.skipBtn.style.display = 'none';
        this.progress.parentElement.style.display = 'none';
        this.hint.style.display = 'none';
        this.hintBtn.style.display = 'none';
        
        // Show practice mode elements
        this.handButtons.style.display = 'flex';
        this.returnBtn.style.display = 'inline-block';
        
        // Update phase indicator
        this.phaseIndicator.textContent = 'Practice Mode';
        
        // Clear existing cards
        this.cardContainer.innerHTML = '';
        
        // Initialize game for practice
        this.game = new Game(this.cardContainer);
        
        // Add click handlers to hand buttons
        const handButtons = document.querySelectorAll('.hand-button');
        handButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.game) {
                    this.game.checkAnswer(button.dataset.hand);
                }
            });
        });
        
        // Start practice mode
        this.game.startPracticeMode();
    }
    
    startPracticeMode() {
        console.log('Starting practice mode');
        
        // Hide tutorial elements
        this.handDescription.style.display = 'none';
        this.prevBtn.style.display = 'none';
        this.nextBtn.style.display = 'none';
        this.skipBtn.style.display = 'none';
        this.progress.style.display = 'none';
        
        // Show practice mode elements
        this.handButtons.style.display = 'flex';
        this.returnBtn.style.display = 'inline-block';
        
        // Update phase indicator
        this.phaseIndicator.textContent = 'Practice Mode';
        
        // Initialize game for practice
        this.game = new Game(this.cardContainer);
        
        // Add click handlers to hand buttons
        const handButtons = document.querySelectorAll('.hand-button');
        handButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.game) {
                    this.game.checkAnswer(button.dataset.hand);
                }
            });
        });
        
        // Start practice mode (similar to easy mode but without timer/score)
        this.game.startPracticeMode();
    }
    
    returnToTutorial() {
        console.log('Returning to tutorial');
        
        // Hide practice mode elements
        this.handButtons.style.display = 'none';
        this.returnBtn.style.display = 'none';
        
        // Show tutorial elements
        this.handName.style.display = 'block';
        this.handDescription.style.display = 'block';
        this.prevBtn.style.display = 'block';
        this.nextBtn.style.display = 'block';
        this.skipBtn.style.display = 'block';
        this.progress.parentElement.style.display = 'block';
        this.hint.style.display = 'block';
        this.hintBtn.style.display = 'block';
        
        // Update phase indicator
        this.phaseIndicator.textContent = 'Learning Phase';
        
        // Clear existing cards
        this.cardContainer.innerHTML = '';
        
        // Reset game
        this.game = null;
        
        // Reset tutorial state
        this.currentHandIndex = 0;
        this.currentPhase = 'description';
        
        // Show the first hand
        this.showHand();
    }
    
    toggleHint() {
        const isHintVisible = this.hint.style.display === 'block';
        this.hint.style.display = isHintVisible ? 'none' : 'block';
        this.hintBtn.textContent = isHintVisible ? 'Show Hint' : 'Hide Hint';
    }
}

// Initialize the tutorial when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing tutorial');
    new Tutorial();
});
