import { HAND_RANKINGS } from '../utils/Constants';

export class ScoreManager {
    constructor() {
        this.score = 0;
        this.streak = 0;
        this.highScore = this.loadHighScore();
    }

    evaluateGuess(guessedHand, actualHand) {
        if (guessedHand === actualHand) {
            this.streak++;
            const points = HAND_RANKINGS[actualHand].points;
            const bonus = this.calculateStreakBonus();
            this.addPoints(points * bonus);
            return {
                correct: true,
                points: points * bonus,
                message: this.getSuccessMessage(actualHand, bonus)
            };
        } else {
            this.streak = 0;
            return {
                correct: false,
                points: 0,
                message: this.getFailureMessage(guessedHand, actualHand)
            };
        }
    }

    calculateStreakBonus() {
        // Bonus multiplier increases with streak, capped at 3x
        return Math.min(1 + (this.streak * 0.1), 3);
    }

    addPoints(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }

    getSuccessMessage(hand, bonus) {
        const basePoints = HAND_RANKINGS[hand].points;
        const bonusPoints = basePoints * (bonus - 1);
        
        let message = `Correct! ${HAND_RANKINGS[hand].name}`;
        if (bonus > 1) {
            message += `\nStreak Bonus: ${bonusPoints.toFixed(0)} (${bonus.toFixed(1)}x)`;
        }
        return message;
    }

    getFailureMessage(guessed, actual) {
        return `Incorrect! You guessed ${HAND_RANKINGS[guessed].name}, but it was ${HAND_RANKINGS[actual].name}`;
    }

    getScore() {
        return this.score;
    }

    getHighScore() {
        return this.highScore;
    }

    getStreak() {
        return this.streak;
    }

    reset() {
        this.score = 0;
        this.streak = 0;
    }

    loadHighScore() {
        const saved = localStorage.getItem('pokerTrainer.highScore');
        return saved ? parseInt(saved) : 0;
    }

    saveHighScore() {
        localStorage.setItem('pokerTrainer.highScore', this.highScore.toString());
    }
}
