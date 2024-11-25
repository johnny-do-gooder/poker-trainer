import { Card } from './Card';
import { CARD_RANKS, CARD_SUITS } from '../utils/Constants';

export class Deck {
    constructor() {
        this.cards = [];
        this.createDeck();
        this.shuffle();
    }

    createDeck() {
        for (const suit of CARD_SUITS) {
            for (const rank of CARD_RANKS) {
                this.cards.push(new Card(rank, suit));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    dealCards(count) {
        if (count > this.cards.length) {
            this.reset();
        }
        return this.cards.splice(0, count);
    }

    reset() {
        // Clean up existing cards
        this.cleanup();
        // Create new deck
        this.createDeck();
        this.shuffle();
    }

    cleanup() {
        // Clean up all cards in the deck
        this.cards.forEach(card => card.cleanup());
        this.cards = [];
    }

    // Helper method to generate specific hands for training
    generateHand(handType) {
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
            case 'pair':
                return this.generatePair();
            default:
                return this.generateHighCard();
        }
    }

    generateRoyalFlush() {
        const suit = CARD_SUITS[Math.floor(Math.random() * CARD_SUITS.length)];
        const royalCards = ['10', 'J', 'Q', 'K', 'A'].map(rank => new Card(rank, suit));
        const extraCards = this.generateRandomCards(2, royalCards);
        return [...royalCards, ...extraCards];
    }

    generateStraightFlush() {
        const suit = CARD_SUITS[Math.floor(Math.random() * CARD_SUITS.length)];
        const startIdx = Math.floor(Math.random() * 9); // Ensure we have room for 5 consecutive cards
        const straightCards = CARD_RANKS.slice(startIdx, startIdx + 5).map(rank => new Card(rank, suit));
        const extraCards = this.generateRandomCards(2, straightCards);
        return [...straightCards, ...extraCards];
    }

    generateFourOfAKind() {
        const rank = CARD_RANKS[Math.floor(Math.random() * CARD_RANKS.length)];
        const fourCards = CARD_SUITS.map(suit => new Card(rank, suit));
        const extraCards = this.generateRandomCards(3, fourCards);
        return [...fourCards, ...extraCards];
    }

    generateFullHouse() {
        const rank1 = CARD_RANKS[Math.floor(Math.random() * CARD_RANKS.length)];
        let rank2;
        do {
            rank2 = CARD_RANKS[Math.floor(Math.random() * CARD_RANKS.length)];
        } while (rank2 === rank1);

        const threeCards = CARD_SUITS.slice(0, 3).map(suit => new Card(rank1, suit));
        const twoCards = CARD_SUITS.slice(0, 2).map(suit => new Card(rank2, suit));
        const extraCards = this.generateRandomCards(2, [...threeCards, ...twoCards]);
        return [...threeCards, ...twoCards, ...extraCards];
    }

    generateFlush() {
        const suit = CARD_SUITS[Math.floor(Math.random() * CARD_SUITS.length)];
        const ranks = this.getRandomUniqueRanks(5);
        const flushCards = ranks.map(rank => new Card(rank, suit));
        const extraCards = this.generateRandomCards(2, flushCards);
        return [...flushCards, ...extraCards];
    }

    generateStraight() {
        const startIdx = Math.floor(Math.random() * 9);
        const straightCards = CARD_RANKS.slice(startIdx, startIdx + 5).map(rank => 
            new Card(rank, CARD_SUITS[Math.floor(Math.random() * CARD_SUITS.length)])
        );
        const extraCards = this.generateRandomCards(2, straightCards);
        return [...straightCards, ...extraCards];
    }

    generateThreeOfAKind() {
        const rank = CARD_RANKS[Math.floor(Math.random() * CARD_RANKS.length)];
        const threeCards = CARD_SUITS.slice(0, 3).map(suit => new Card(rank, suit));
        const extraCards = this.generateRandomCards(4, threeCards);
        return [...threeCards, ...extraCards];
    }

    generateTwoPair() {
        const rank1 = CARD_RANKS[Math.floor(Math.random() * CARD_RANKS.length)];
        let rank2;
        do {
            rank2 = CARD_RANKS[Math.floor(Math.random() * CARD_RANKS.length)];
        } while (rank2 === rank1);

        const pair1 = CARD_SUITS.slice(0, 2).map(suit => new Card(rank1, suit));
        const pair2 = CARD_SUITS.slice(0, 2).map(suit => new Card(rank2, suit));
        const extraCards = this.generateRandomCards(3, [...pair1, ...pair2]);
        return [...pair1, ...pair2, ...extraCards];
    }

    generatePair() {
        const rank = CARD_RANKS[Math.floor(Math.random() * CARD_RANKS.length)];
        const pairCards = CARD_SUITS.slice(0, 2).map(suit => new Card(rank, suit));
        const extraCards = this.generateRandomCards(5, pairCards);
        return [...pairCards, ...extraCards];
    }

    generateHighCard() {
        return this.generateRandomCards(7, []);
    }

    generateRandomCards(count, excludeCards) {
        const result = [];
        const usedCards = new Set(excludeCards.map(card => `${card.rank}_${card.suit}`));

        while (result.length < count) {
            const rank = CARD_RANKS[Math.floor(Math.random() * CARD_RANKS.length)];
            const suit = CARD_SUITS[Math.floor(Math.random() * CARD_SUITS.length)];
            const cardKey = `${rank}_${suit}`;

            if (!usedCards.has(cardKey)) {
                usedCards.add(cardKey);
                result.push(new Card(rank, suit));
            }
        }

        return result;
    }

    getRandomUniqueRanks(count) {
        const ranks = [...CARD_RANKS];
        const result = [];
        
        while (result.length < count) {
            const index = Math.floor(Math.random() * ranks.length);
            result.push(ranks.splice(index, 1)[0]);
        }
        
        return result;
    }
}
