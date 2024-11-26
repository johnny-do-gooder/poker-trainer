import { Card } from './Card';

export class HandGenerator {
    constructor() {
        this.testStats = {
            generatedHands: {},
            totalHands: 0
        };
    }

    static generateHand(handType) {
        switch (handType) {
            case 'royal-flush':
                return this.generateRoyalFlush();
            case 'straight-flush':
                return this.generateStraightFlush();
            case 'four-kind':
                return this.generateFourOfAKind();
            case 'full-house':
                return this.generateFullHouse();
            case 'flush':
                return this.generateFlush();
            case 'straight':
                return this.generateStraight();
            case 'three-kind':
                return this.generateThreeOfAKind();
            case 'two-pair':
                return this.generateTwoPair();
            case 'one-pair':
                return this.generateOnePair();
            default:
                return this.generateHighCard();
        }
    }

    generateHand(complexity = 1) {
        // Track statistics in test mode
        if (this.testStats) {
            this.testStats.totalHands++;
        }

        // Generate hand logic...
        const hand = this._generateRandomHand(complexity);
        
        // Track hand type in test mode
        if (this.testStats) {
            const handType = hand.getHandRank();
            this.testStats.generatedHands[handType] = (this.testStats.generatedHands[handType] || 0) + 1;
        }

        return hand;
    }

    getTestStats() {
        return {
            ...this.testStats,
            distribution: Object.entries(this.testStats.generatedHands).map(([type, count]) => ({
                type,
                count,
                percentage: ((count / this.testStats.totalHands) * 100).toFixed(2) + '%'
            }))
        };
    }

    _generateRandomHand(complexity) {
        const handTypes = [
            { type: 'royal-flush', weight: 1 },
            { type: 'straight-flush', weight: 2 },
            { type: 'four-kind', weight: 3 },
            { type: 'full-house', weight: 4 },
            { type: 'flush', weight: 5 },
            { type: 'straight', weight: 6 },
            { type: 'three-kind', weight: 7 },
            { type: 'two-pair', weight: 8 },
            { type: 'one-pair', weight: 9 },
            { type: 'high-card', weight: 10 }
        ];

        // Adjust weights based on complexity
        const adjustedHands = handTypes.map(hand => ({
            ...hand,
            weight: this._adjustWeight(hand.weight, complexity)
        }));

        // Calculate total weight
        const totalWeight = adjustedHands.reduce((sum, hand) => sum + hand.weight, 0);

        // Random number between 0 and total weight
        let random = Math.random() * totalWeight;

        // Select hand based on weights
        for (const hand of adjustedHands) {
            if (random <= hand.weight) {
                return HandGenerator.generateHand(hand.type);
            }
            random -= hand.weight;
        }

        // Fallback to high card
        return HandGenerator.generateHand('high-card');
    }

    _adjustWeight(baseWeight, complexity) {
        switch (complexity) {
            case 1: // Easy - Basic hands more common
                return baseWeight * (11 - baseWeight);
            case 2: // Medium - More varied
                return baseWeight;
            case 3: // Hard - Complex hands more common
                return baseWeight * baseWeight;
            case 4: // Gauntlet - All hands equally likely
                return 1;
            default:
                return baseWeight;
        }
    }

    static generateHighCard() {
        const ranks = ['A', 'K', 'Q', 'J', '9'];
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        return ranks.map(rank => {
            const suit = suits[Math.floor(Math.random() * suits.length)];
            return new Card(rank, suit);
        });
    }

    static generateOnePair() {
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

    static generateTwoPair() {
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

    static generateThreeOfAKind() {
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

    static generateStraight() {
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

    static generateFlush() {
        const suit = ['hearts', 'diamonds', 'clubs', 'spades'][Math.floor(Math.random() * 4)];
        const ranks = ['A', 'K', 'Q', 'J', '9'];
        
        return ranks.map(rank => new Card(rank, suit));
    }

    static generateRoyalFlush() {
        const suit = ['hearts', 'diamonds', 'clubs', 'spades'][Math.floor(Math.random() * 4)];
        const ranks = ['A', 'K', 'Q', 'J', '10'];
        return ranks.map(rank => new Card(rank, suit));
    }

    static generateStraightFlush() {
        const suit = ['hearts', 'diamonds', 'clubs', 'spades'][Math.floor(Math.random() * 4)];
        const ranks = ['K', 'Q', 'J', '10', '9'];
        return ranks.map(rank => new Card(rank, suit));
    }

    static generateFourOfAKind() {
        const quadRank = ['K', 'Q', 'J'][Math.floor(Math.random() * 3)];
        const otherRank = 'A';  
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const otherSuit = suits[Math.floor(Math.random() * suits.length)];
        
        return [
            ...suits.map(suit => new Card(quadRank, suit)),
            new Card(otherRank, otherSuit)
        ];
    }

    static generateFullHouse() {
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
}
