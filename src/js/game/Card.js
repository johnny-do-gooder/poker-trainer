export class Card {
    static instances = new Set();
    static DEBUG = true;

    constructor(rank, suit, faceUp = false) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.rank = rank;
        this.suit = suit;
        this.element = null;
        this._faceUp = faceUp;
        this.createdAt = new Date().toISOString();
        this.flips = [];
        this.hasElement = false;
        this.elementClasses = [];
        this.elementInDOM = false;
        this.parentNodeType = null;
        Card.instances.add(this);
        
        // Only log in debug mode
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Card ${this.id}] Created card [${this.id}]: ${rank}${this.getSuitSymbol()}, face ${this._faceUp ? 'up' : 'down'}`);
        }
    }

    debug(message, state = false) {
        if (Card.DEBUG) {
            if (state) {
                console.log(`[Card ${this.id}] ${message}`, this.getState());
            } else {
                console.log(`[Card ${this.id}] ${message}`);
            }
        }
    }

    getState() {
        const elementInDOM = this.element ? !!this.element.parentNode : false;
        const state = {
            id: this.id,
            rank: this.rank,
            suit: this.suit,
            faceUp: this._faceUp,
            hasElement: this.hasElement,
            elementClasses: this.elementClasses,
            flips: this.flips,
            createdAt: this.createdAt,
            elementInDOM: elementInDOM,
            parentNodeType: elementInDOM ? this.element.parentNode.nodeName : null
        };
        return state;
    }

    updateState() {
        // Only log in debug mode
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Card ${this.id}] Card state:`, this.getState());
        }
    }

    get faceUp() {
        return this._faceUp;
    }

    set faceUp(value) {
        this.debug(`Attempting to set faceUp to ${value}`);
        if (this._faceUp === value) {
            this.debug(`Card is already face ${value ? 'up' : 'down'}, ignoring`);
            return;
        }
        this.setFaceUp(value);
    }

    createElement() {
        if (this.hasElement) return;

        const element = document.createElement('div');
        element.classList.add('card');
        
        if (this.faceUp) {
            element.classList.add('flipped');
        }
        
        this.element = element;
        this.hasElement = true;
        this.elementClasses = ['card'];
        
        this.debug('Element created with classes:', false);
    }

    attachToDOM(parentElement) {
        if (!this.element) {
            this.createElement();
        }
        if (parentElement && !this.element.parentNode) {
            parentElement.appendChild(this.element);
            this.updateState();
        }
    }

    setFaceUp(faceUp) {
        this.debug(`Setting face up to ${faceUp}, current state: ${JSON.stringify(this.getState())}`);
        
        if (this._faceUp === faceUp) {
            this.debug('Card is already in desired face up state, no change needed');
            return;
        }

        this._faceUp = faceUp;
        
        if (this.element) {
            try {
                requestAnimationFrame(() => {
                    if (this.element) {  // Double-check element still exists
                        if (faceUp) {
                            this.element.classList.add('flipped');
                        } else {
                            this.element.classList.remove('flipped');
                        }
                        this.debug(`Updated element classes: ${Array.from(this.element.classList).join(',')}`);
                    }
                });
            } catch (error) {
                this.debug(`Error updating face up state: ${error.message}`);
                console.error('Error in setFaceUp:', error);
            }
        }
    }

    flip() {
        this.debug(`Flip called`);
        this.debug(`Before flip: ${JSON.stringify(this.getState())}`);
        this.setFaceUp(!this._faceUp);
        this.updateState();
    }

    getSuitSymbol() {
        const symbols = {
            'hearts': '♥',
            'diamonds': '♦',
            'clubs': '♣',
            'spades': '♠'
        };
        return symbols[this.suit] || '?';
    }

    getSuitColor() {
        return ['hearts', 'diamonds'].includes(this.suit) ? 'red' : 'black';
    }

    toString() {
        return `${this.rank}${this.getSuitSymbol()}`;
    }

    animateCorrect() {
        if (this.element) {
            this.element.classList.add('correct');
            setTimeout(() => {
                if (this.element) {
                    this.element.classList.remove('correct');
                }
            }, 600);
        }
    }

    animateIncorrect() {
        if (this.element) {
            this.element.classList.add('incorrect');
            setTimeout(() => {
                if (this.element) {
                    this.element.classList.remove('incorrect');
                }
            }, 600);
        }
    }

    cleanup() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        this.element = null;
        this.hasElement = false;
        this.elementClasses = [];
        this.elementInDOM = false;
        this.parentNodeType = null;
        
        this.debug('Card cleaned up', false);
    }

    static cleanup() {
        console.log(`[Card] Starting cleanup of ${Card.instances.size} instances`);
        // Create a new array to avoid modifying Set while iterating
        [...Card.instances].forEach(card => card.cleanup());
        console.log(`[Card] Cleaned up all instances`);
    }

    static fromCode(code, faceUp = false) {
        const rank = code.slice(0, -1);
        const suitMap = {
            'H': 'hearts',
            'D': 'diamonds',
            'C': 'clubs',
            'S': 'spades'
        };
        const suit = suitMap[code.slice(-1)];
        if (!suit) {
            console.error(`[Card] Invalid suit code: ${code.slice(-1)}`);
            return null;
        }
        
        const card = new Card(rank, suit, faceUp);
        // Only log in debug mode
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Card ${card.id}] Created card from code: ${code}, face ${faceUp ? 'up' : 'down'}`);
        }
        return card;
    }
}
