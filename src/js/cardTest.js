import { Card } from './game/Card';

function createTestCards() {
    try {
        console.log('Starting card test initialization');
        
        // Get container
        const container = document.getElementById('card-container');
        if (!container) {
            throw new Error('Card container element not found');
        }
        console.log('Found card container');
        
        // Create test cards
        const testCards = [
            new Card('A', 'hearts'),
            new Card('K', 'spades'),
            new Card('Q', 'diamonds'),
            new Card('J', 'clubs'),
            new Card('10', 'hearts')
        ];
        console.log('Created test cards:', testCards);

        // Create and append card elements
        testCards.forEach((card, index) => {
            try {
                console.log(`Creating element for card ${index + 1}:`, card.toString());
                const cardElement = card.createElement();
                container.appendChild(cardElement);
                
                // Add click handler to flip card
                cardElement.addEventListener('click', () => {
                    console.log(`Flipping card ${index + 1}:`, card.toString());
                    card.flip();
                });
            } catch (error) {
                console.error(`Error creating card ${index + 1}:`, error);
            }
        });
        console.log('All card elements created and added to container');

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        // Create and add buttons
        const buttons = [
            {
                text: 'Flip All Cards',
                action: () => {
                    console.log('Flipping all cards');
                    testCards.forEach(card => card.flip());
                }
            },
            {
                text: 'Test Correct Animation',
                action: () => {
                    console.log('Testing correct animation');
                    testCards.forEach(card => {
                        if (card.element) {
                            card.element.classList.add('correct');
                            setTimeout(() => card.element.classList.remove('correct'), 600);
                        }
                    });
                }
            },
            {
                text: 'Test Incorrect Animation',
                action: () => {
                    console.log('Testing incorrect animation');
                    testCards.forEach(card => {
                        if (card.element) {
                            card.element.classList.add('incorrect');
                            setTimeout(() => card.element.classList.remove('incorrect'), 600);
                        }
                    });
                }
            }
        ];

        buttons.forEach(({ text, action }) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', action);
            buttonContainer.appendChild(button);
        });

        document.body.appendChild(buttonContainer);
        console.log('Test interface initialized');

    } catch (error) {
        console.error('Fatal error in card test initialization:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = `Error: ${error.message}. Please check the console for more details.`;
        document.body.appendChild(errorMessage);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', createTestCards);
