export class Card {
    constructor(rank, suit) {
        this.rank = rank;
        if (!suit || !['hearts', 'diamonds', 'clubs', 'spades'].includes(suit.toLowerCase())) {
            throw new Error(`Invalid suit: ${suit}`);
        }
        this.suit = suit.toLowerCase();
        this.faceUp = false;
        this.element = this.createElement();
    }

    createElement() {
        const cardElement = document.createElement('div');
        cardElement.className = 'card face-down';
        
        const frontFace = document.createElement('div');
        frontFace.className = 'card-face front';
        frontFace.innerHTML = `
            <div class="card-corner top-left">
                <div class="card-rank">${this.rank}</div>
                <div class="card-suit">${this.getSuitSymbol()}</div>
            </div>
            <div class="card-center">
                <div class="card-suit large">${this.getSuitSymbol()}</div>
            </div>
            <div class="card-corner bottom-right">
                <div class="card-rank">${this.rank}</div>
                <div class="card-suit">${this.getSuitSymbol()}</div>
            </div>
        `;
        
        const backFace = document.createElement('div');
        backFace.className = 'card-face back';
        
        cardElement.appendChild(frontFace);
        cardElement.appendChild(backFace);
        
        this.element = cardElement;
        return cardElement;
    }

    getSuitSymbol() {
        switch (this.suit.toLowerCase()) {
            case 'hearts': return '♥';
            case 'diamonds': return '♦';
            case 'clubs': return '♣';
            case 'spades': return '♠';
            default: return '';
        }
    }

    flip() {
        this.faceUp = !this.faceUp;
        if (this.faceUp) {
            this.element.classList.remove('face-down');
            this.element.classList.add('face-up');
        } else {
            this.element.classList.remove('face-up');
            this.element.classList.add('face-down');
        }
    }

    setFeedback(isCorrect) {
        // Remove any existing feedback classes
        this.element.classList.remove('correct', 'incorrect');
        
        // Add new feedback class
        this.element.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // Remove the feedback class after animation completes
        setTimeout(() => {
            this.element.classList.remove('correct', 'incorrect');
        }, 600);
    }

    toString() {
        return `${this.rank} of ${this.suit}`;
    }
}
