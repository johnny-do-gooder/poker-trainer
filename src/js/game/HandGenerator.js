import { Card } from './Card';

export class HandGenerator {
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
