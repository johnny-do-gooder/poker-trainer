import { HAND_RANKINGS } from '../utils/Constants';

export class PokerHand {
    constructor(cards) {
        this.cards = cards;
        this.rank = this.evaluateHand();
    }

    static compareRanks(rank1, rank2) {
        const rankings = Object.keys(HAND_RANKINGS);
        const index1 = rankings.indexOf(rank1);
        const index2 = rankings.indexOf(rank2);
        return index1 - index2; // Lower index = better hand
    }

    evaluateHand() {
        if (this.isRoyalFlush()) return 'royal-flush';
        if (this.isStraightFlush()) return 'straight-flush';
        if (this.isFourOfAKind()) return 'four-kind';
        if (this.isFullHouse()) return 'full-house';
        if (this.isFlush()) return 'flush';
        if (this.isStraight()) return 'straight';
        if (this.isThreeOfAKind()) return 'three-kind';
        if (this.isTwoPair()) return 'two-pair';
        if (this.isOnePair()) return 'one-pair';
        return 'high-card';
    }

    getRankCounts() {
        return this.cards.reduce((counts, card) => {
            counts[card.rank] = (counts[card.rank] || 0) + 1;
            return counts;
        }, {});
    }

    getSuitCounts() {
        return this.cards.reduce((counts, card) => {
            counts[card.suit] = (counts[card.suit] || 0) + 1;
            return counts;
        }, {});
    }

    getRankValues() {
        const values = {
            'A': 14, 'K': 13, 'Q': 12, 'J': 11,
            '10': 10, '9': 9, '8': 8, '7': 7,
            '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
        };
        return this.cards.map(card => values[card.rank]).sort((a, b) => b - a);
    }

    isRoyalFlush() {
        return this.isStraightFlush() && 
               this.getRankValues().includes(14); // Has an Ace
    }

    isStraightFlush() {
        return this.isFlush() && this.isStraight();
    }

    isFourOfAKind() {
        return Object.values(this.getRankCounts()).includes(4);
    }

    isFullHouse() {
        const counts = Object.values(this.getRankCounts());
        return counts.includes(3) && counts.includes(2);
    }

    isFlush() {
        return Object.values(this.getSuitCounts()).some(count => count === 5);
    }

    isStraight() {
        const values = this.getRankValues();
        // Check for Ace-low straight (A,2,3,4,5)
        if (values.toString() === '14,5,4,3,2') return true;
        
        // Check for normal straight
        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] !== values[i + 1] + 1) return false;
        }
        return true;
    }

    isThreeOfAKind() {
        return Object.values(this.getRankCounts()).includes(3);
    }

    isTwoPair() {
        return Object.values(this.getRankCounts())
            .filter(count => count === 2).length === 2;
    }

    isOnePair() {
        return Object.values(this.getRankCounts()).includes(2);
    }

    getHandName() {
        return HAND_RANKINGS[this.rank].name;
    }

    getPoints() {
        return HAND_RANKINGS[this.rank].points;
    }

    toString() {
        return `${this.getHandName()} (${this.cards.map(card => card.toString()).join(', ')})`;
    }
}
