import { HAND_RANKINGS } from '../utils/Constants';

export class PokerHand {
    constructor(cards) {
        // Store the original cards array
        this.cards = cards;
        
        // Sort the cards by rank
        const rankOrder = {
            'A': 14, 'K': 13, 'Q': 12, 'J': 11,
            '10': 10, '9': 9, '8': 8, '7': 7,
            '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
        };
        
        this.sortedCards = [...cards].sort((a, b) => {
            return rankOrder[b.rank] - rankOrder[a.rank];
        });
        
        // Analyze the hand
        this.analyze();
    }
    
    analyze() {
        // Determine the hand rank and points
        const ranks = this.sortedCards.map(card => card.rank);
        const suits = this.sortedCards.map(card => card.suit);
        
        // Count occurrences of each rank
        const rankCounts = {};
        ranks.forEach(rank => {
            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        });
        
        // Check for flush (all same suit)
        const isFlush = suits.every(suit => suit === suits[0]);
        
        // Check for straight
        const rankOrder = {
            'A': 14, 'K': 13, 'Q': 12, 'J': 11,
            '10': 10, '9': 9, '8': 8, '7': 7,
            '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
        };
        
        const sortedRanks = ranks.map(r => rankOrder[r]).sort((a, b) => b - a);
        const isStraight = sortedRanks.every((rank, i) => {
            if (i === 0) return true;
            return rank === sortedRanks[i - 1] - 1;
        });
        
        // Special case for Ace-low straight (A, 2, 3, 4, 5)
        if (!isStraight && sortedRanks[0] === 14) {
            const aceLowStraight = [14, 5, 4, 3, 2];
            if (sortedRanks.join(',') === aceLowStraight.join(',')) {
                this.isStraight = true;
            }
        }
        
        // Determine hand type
        if (isFlush && isStraight && ranks.includes('A') && ranks.includes('K')) {
            this.rank = 'royal_flush';
            this.points = 100;
        } else if (isFlush && isStraight) {
            this.rank = 'straight_flush';
            this.points = 90;
        } else if (Object.values(rankCounts).includes(4)) {
            this.rank = 'four_of_a_kind';
            this.points = 80;
        } else if (Object.values(rankCounts).includes(3) && Object.values(rankCounts).includes(2)) {
            this.rank = 'full_house';
            this.points = 70;
        } else if (isFlush) {
            this.rank = 'flush';
            this.points = 60;
        } else if (isStraight) {
            this.rank = 'straight';
            this.points = 50;
        } else if (Object.values(rankCounts).includes(3)) {
            this.rank = 'three_of_a_kind';
            this.points = 40;
        } else if (Object.values(rankCounts).filter(count => count === 2).length === 2) {
            this.rank = 'two_pair';
            this.points = 30;
        } else if (Object.values(rankCounts).includes(2)) {
            this.rank = 'one_pair';
            this.points = 20;
        } else {
            this.rank = 'high_card';
            this.points = 10;
        }
    }
    
    getPoints() {
        return this.points;
    }
    
    getRanking() {
        return this.rank;
    }
    
    toString() {
        return `${this.rank} (${this.sortedCards.map(c => c.toString()).join(', ')})`;
    }
}
