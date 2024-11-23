export class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.element = null;
        this.faceUp = false;
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
        }
        return this.element;
    }

    flip() {
        this.faceUp = !this.faceUp;
        if (this.element) {
            this.element.classList.toggle('flipped', this.faceUp);
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
}
