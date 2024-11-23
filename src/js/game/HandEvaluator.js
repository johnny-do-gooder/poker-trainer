import { CARD_RANKS } from '../utils/Constants';

export class HandEvaluator {
    static evaluate(cards) {
        if (cards.length < 5) return 'high-card';

        const ranks = cards.map(card => CARD_RANKS.indexOf(card.rank));
        const suits = cards.map(card => card.suit);

        // Sort ranks in descending order
        ranks.sort((a, b) => b - a);

        if (this.isRoyalFlush(ranks, suits)) return 'royal-flush';
        if (this.isStraightFlush(ranks, suits)) return 'straight-flush';
        if (this.isFourOfAKind(ranks)) return 'four-kind';
        if (this.isFullHouse(ranks)) return 'full-house';
        if (this.isFlush(suits)) return 'flush';
        if (this.isStraight(ranks)) return 'straight';
        if (this.isThreeOfAKind(ranks)) return 'three-kind';
        if (this.isTwoPair(ranks)) return 'two-pair';
        if (this.isPair(ranks)) return 'pair';
        return 'high-card';
    }

    static isRoyalFlush(ranks, suits) {
        const isRoyal = ranks.slice(0, 5).join(',') === '12,11,10,9,8'; // A,K,Q,J,10
        return isRoyal && this.isFlush(suits.slice(0, 5));
    }

    static isStraightFlush(ranks, suits) {
        return this.isStraight(ranks.slice(0, 5)) && this.isFlush(suits.slice(0, 5));
    }

    static isFourOfAKind(ranks) {
        const rankCounts = this.getRankCounts(ranks);
        return Object.values(rankCounts).some(count => count >= 4);
    }

    static isFullHouse(ranks) {
        const rankCounts = this.getRankCounts(ranks);
        const counts = Object.values(rankCounts);
        return counts.includes(3) && counts.includes(2);
    }

    static isFlush(suits) {
        return suits.slice(0, 5).every(suit => suit === suits[0]);
    }

    static isStraight(ranks) {
        // Check for regular straight
        for (let i = 0; i < ranks.length - 4; i++) {
            const straight = true;
            for (let j = 0; j < 4; j++) {
                if (ranks[i + j] !== ranks[i + j + 1] + 1) {
                    straight = false;
                    break;
                }
            }
            if (straight) return true;
        }

        // Check for Ace-low straight (A,2,3,4,5)
        if (ranks.includes(12)) { // If we have an Ace
            const lowStraight = [12, 3, 2, 1, 0];
            return lowStraight.every(rank => ranks.includes(rank));
        }

        return false;
    }

    static isThreeOfAKind(ranks) {
        const rankCounts = this.getRankCounts(ranks);
        return Object.values(rankCounts).some(count => count >= 3);
    }

    static isTwoPair(ranks) {
        const rankCounts = this.getRankCounts(ranks);
        const pairs = Object.values(rankCounts).filter(count => count >= 2);
        return pairs.length >= 2;
    }

    static isPair(ranks) {
        const rankCounts = this.getRankCounts(ranks);
        return Object.values(rankCounts).some(count => count >= 2);
    }

    static getRankCounts(ranks) {
        const rankCounts = {};
        for (const rank of ranks) {
            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        }
        return rankCounts;
    }

    static findBestHand(cards) {
        const allCombinations = this.getAllCombinations(cards, 5);
        let bestHand = null;
        let bestHandType = 'high-card';
        let bestHandRank = -1;

        for (const combination of allCombinations) {
            const handType = this.evaluate(combination);
            const handRank = this.getHandRank(handType);
            
            if (handRank > bestHandRank) {
                bestHandRank = handRank;
                bestHandType = handType;
                bestHand = combination;
            }
        }

        return {
            type: bestHandType,
            cards: bestHand
        };
    }

    static getHandRank(handType) {
        const rankings = {
            'royal-flush': 9,
            'straight-flush': 8,
            'four-kind': 7,
            'full-house': 6,
            'flush': 5,
            'straight': 4,
            'three-kind': 3,
            'two-pair': 2,
            'pair': 1,
            'high-card': 0
        };
        return rankings[handType];
    }

    static getAllCombinations(cards, r) {
        const combinations = [];
        const n = cards.length;
        
        function* combinationUtil(arr, data, start, end, index, r) {
            if (index === r) {
                yield [...data];
                return;
            }
            
            for (let i = start; i <= end && end - i + 1 >= r - index; i++) {
                data[index] = arr[i];
                yield* combinationUtil(arr, data, i + 1, end, index + 1, r);
            }
        }
        
        const data = new Array(r);
        for (const combo of combinationUtil(cards, data, 0, n - 1, 0, r)) {
            combinations.push(combo);
        }
        
        return combinations;
    }
}
