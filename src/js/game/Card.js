export class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.element = null;
        this.faceUp = false; // Start face down
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
        return ['hearts', 'diamonds'].includes(this.suit) ? '#e74c3c' : '#2c3e50';
    }

    createElement() {
        if (!this.element) {
            console.log(`Creating element for ${this.rank}${this.getSuitSymbol()}`);
            // Create main card container
            this.element = document.createElement('div');
            this.element.className = 'card';
            
            // Create front face with card info
            const front = document.createElement('div');
            front.className = 'card-face front';
            
            // Create front face content
            const frontContent = document.createElement('div');
            frontContent.className = 'card-front-content';
            
            const topLeft = document.createElement('div');
            topLeft.className = 'card-corner top-left';
            topLeft.innerHTML = `
                <div class="rank">${this.rank}</div>
                <div class="suit">${this.getSuitSymbol()}</div>
            `;

            const center = document.createElement('div');
            center.className = 'card-center';
            center.innerHTML = `<div class="suit">${this.getSuitSymbol()}</div>`;

            const bottomRight = document.createElement('div');
            bottomRight.className = 'card-corner bottom-right';
            bottomRight.innerHTML = `
                <div class="rank">${this.rank}</div>
                <div class="suit">${this.getSuitSymbol()}</div>
            `;

            frontContent.appendChild(topLeft);
            frontContent.appendChild(center);
            frontContent.appendChild(bottomRight);
            front.appendChild(frontContent);
            
            // Create back face with only star
            const back = document.createElement('div');
            back.className = 'card-face back';
            const backDesign = document.createElement('div');
            backDesign.className = 'card-back-design';
            back.appendChild(backDesign);
            
            // Add faces to card
            this.element.appendChild(front);
            this.element.appendChild(back);

            // Add data attributes for styling
            this.element.dataset.rank = this.rank;
            this.element.dataset.suit = this.suit;
            
            console.log(`Created card element for ${this.rank}${this.getSuitSymbol()}`);
        }
        return this.element;
    }

    flip() {
        console.log(`Flipping card ${this.rank}${this.getSuitSymbol()}`);
        this.faceUp = !this.faceUp;
        if (this.element) {
            this.element.classList.toggle('flipped', this.faceUp);
            console.log(`Card ${this.rank}${this.getSuitSymbol()} flipped to ${this.faceUp ? 'face up' : 'face down'}`);
        }
    }

    setFaceUp(faceUp) {
        if (this.faceUp !== faceUp) {
            this.flip();
        }
    }

    toString() {
        return `${this.rank}${this.suit[0].toUpperCase()}`;
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

    static fromCode(code) {
        const rank = code.slice(0, -1);
        const suitMap = {
            'H': 'hearts',
            'D': 'diamonds',
            'C': 'clubs',
            'S': 'spades'
        };
        const suit = suitMap[code.slice(-1)];
        return new Card(rank, suit);
    }
}
