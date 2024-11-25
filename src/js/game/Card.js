export class Card {
    static instances = new Set();
    static DEBUG = true;

    constructor(rank, suit, faceUp = false) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.rank = rank;
        this.suit = suit;
        this.element = null;
        this._faceUp = faceUp;
        this.createdAt = new Date();
        this.flips = [];
        Card.instances.add(this);
        this.debug(`Created card [${this.id}]: ${rank}${this.getSuitSymbol()}, face ${this._faceUp ? 'up' : 'down'}`);
        this.debug(`Card state: ${JSON.stringify(this.getState())}`);
    }

    debug(message) {
        if (Card.DEBUG) {
            console.log(`[Card ${this.id}] ${message}`);
        }
    }

    getState() {
        const elementInDOM = this.element ? !!this.element.parentNode : false;
        const state = {
            id: this.id,
            rank: this.rank,
            suit: this.suit,
            faceUp: this._faceUp,
            hasElement: !!this.element,
            elementClasses: this.element ? Array.from(this.element.classList) : [],
            flips: this.flips,
            createdAt: this.createdAt,
            elementInDOM: elementInDOM,
            parentNodeType: elementInDOM ? this.element.parentNode.nodeName : null
        };
        return state;
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
        this.debug(`Creating element, current state: ${JSON.stringify(this.getState())}`);
        
        if (this.element) {
            this.debug(`Element already exists, returning existing element`);
            return this.element;
        }

        this.element = document.createElement('div');
        this.element.className = 'card';
        this.element.dataset.cardId = this.id;
        
        const inner = document.createElement('div');
        inner.className = 'card-inner';
        
        const front = document.createElement('div');
        front.className = 'card-front';
        front.innerHTML = `
            <div class="card-value ${this.getSuitColor()}">
                <span class="rank">${this.rank}</span>
                <span class="suit">${this.getSuitSymbol()}</span>
            </div>
        `;
        
        const back = document.createElement('div');
        back.className = 'card-back';
        
        inner.appendChild(front);
        inner.appendChild(back);
        this.element.appendChild(inner);

        // Add flipped class if card should be face up
        if (this._faceUp) {
            this.debug(`Card is face up, adding flipped class`);
            this.element.classList.add('flipped');
        }

        this.debug(`Element created with classes: ${Array.from(this.element.classList).join(',')}`);
        return this.element;
    }

    attachToDOM(parentElement) {
        if (!this.element) {
            this.createElement();
        }
        if (parentElement && !this.element.parentNode) {
            parentElement.appendChild(this.element);
            this.debug(`Attached card element to DOM. New state: ${JSON.stringify(this.getState())}`);
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
        this.debug(`After flip: ${JSON.stringify(this.getState())}`);
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
        const symbol = this.getSuitSymbol();
        return `${this.rank}${symbol}`;
    }

    animateCorrect() {
        if (this.element) {
            this.element.classList.add('correct');
            setTimeout(() => this.element.classList.remove('correct'), 600);
        }
    }

    animateIncorrect() {
        if (this.element) {
            this.element.classList.add('incorrect');
            setTimeout(() => this.element.classList.remove('incorrect'), 600);
        }
    }

    cleanup() {
        this.debug(`Cleaning up card, current state: ${JSON.stringify(this.getState())}`);
        
        if (this.element) {
            try {
                // Remove all event listeners
                const clone = this.element.cloneNode(true);
                if (this.element.parentNode) {
                    this.element.parentNode.replaceChild(clone, this.element);
                }
                
                // Remove from DOM if still attached
                if (clone.parentNode) {
                    clone.parentNode.removeChild(clone);
                }
                
                this.element = null;
                this.debug(`Card cleaned up successfully, new state: ${JSON.stringify(this.getState())}`);
            } catch (error) {
                this.debug(`Error during cleanup: ${error.message}`);
                console.error('Error in cleanup:', error);
                // Attempt basic cleanup as fallback
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
                this.element = null;
            }
        } else {
            this.debug('No element to clean up');
        }
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
        card.debug(`Created card from code: ${code}, face ${faceUp ? 'up' : 'down'}`);
        return card;
    }
}
