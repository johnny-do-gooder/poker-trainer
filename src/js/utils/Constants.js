export const GAME_MODES = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
    GAUNTLET: 'gauntlet'
};

export const MODE_DURATIONS = {
    [GAME_MODES.EASY]: 60, // 1 minute
    [GAME_MODES.MEDIUM]: 150, // 2.5 minutes
    [GAME_MODES.HARD]: 300, // 5 minutes
    [GAME_MODES.GAUNTLET]: Infinity // Endless
};

export const MODE_SETTINGS = {
    [GAME_MODES.EASY]: {
        handComplexity: 1, // Basic hands more common
        handTimed: false, // Session timed
        timeLimit: 60000, // 1 minute
        points: {
            correct: 100,
            incorrect: -50
        }
    },
    [GAME_MODES.MEDIUM]: {
        handComplexity: 2, // More varied hands
        handTimed: false, // Session timed
        timeLimit: 150000, // 2.5 minutes
        points: {
            correct: 200,
            incorrect: -100
        }
    },
    [GAME_MODES.HARD]: {
        handComplexity: 3, // Complex hands more common
        handTimed: false, // Session timed
        timeLimit: 300000, // 5 minutes
        points: {
            correct: 300,
            incorrect: -150
        }
    },
    [GAME_MODES.GAUNTLET]: {
        handComplexity: 4, // All hands equally likely
        handTimed: false, // No timer
        timeLimit: Infinity, // No time limit
        points: {
            correct: 500,
            incorrect: -250
        }
    }
};

export const HAND_COMPLEXITY = {
    BASIC: ['one-pair', 'two-pair', 'three-kind'],
    INTERMEDIATE: ['straight', 'flush', 'full-house'],
    ADVANCED: ['four-kind', 'straight-flush', 'royal-flush']
};

export const HAND_RANKINGS = {
    'royal-flush': { name: 'Royal Flush', points: 800 },
    'straight-flush': { name: 'Straight Flush', points: 50 },
    'four-kind': { name: 'Four of a Kind', points: 25 },
    'full-house': { name: 'Full House', points: 9 },
    'flush': { name: 'Flush', points: 6 },
    'straight': { name: 'Straight', points: 4 },
    'three-kind': { name: 'Three of a Kind', points: 3 },
    'two-pair': { name: 'Two Pair', points: 2 },
    'one-pair': { name: 'One Pair', points: 1 },
    'high-card': { name: 'High Card', points: 0 }
};

export const CARD_RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const CARD_SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];

export const SOUND_EFFECTS = {
    CARD_DEAL: 'card-deal.mp3',
    CARD_FLIP: 'card-flip.mp3',
    CORRECT_GUESS: 'correct.mp3',
    WRONG_GUESS: 'wrong.mp3',
    GAME_START: 'game-start.mp3',
    GAME_OVER: 'game-over.mp3',
    BACKGROUND_MUSIC: 'background.mp3'
};
