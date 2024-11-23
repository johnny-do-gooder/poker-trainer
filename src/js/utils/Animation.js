import { gsap } from 'gsap';
import { ANIMATION_DURATION } from './Constants';

export class Animation {
    static dealCard(cardElement, x, y, delay = 0) {
        return gsap.to(cardElement, {
            x,
            y,
            rotation: 360,
            duration: ANIMATION_DURATION.CARD_DEAL,
            delay,
            ease: "power2.out"
        });
    }

    static flipCard(cardElement, delay = 0) {
        // First half of the flip
        return gsap.timeline()
            .to(cardElement, {
                scaleX: 0,
                duration: ANIMATION_DURATION.CARD_FLIP / 2,
                delay,
                ease: "power2.in"
            })
            .to(cardElement, {
                scaleX: 1,
                duration: ANIMATION_DURATION.CARD_FLIP / 2,
                ease: "power2.out"
            });
    }

    static showCorrect(cardElement) {
        return gsap.to(cardElement, {
            boxShadow: "0 0 20px #0f0",
            duration: 0.3,
            yoyo: true,
            repeat: 2
        });
    }

    static showIncorrect(cardElement) {
        return gsap.to(cardElement, {
            boxShadow: "0 0 20px #f00",
            duration: 0.3,
            yoyo: true,
            repeat: 2
        });
    }

    static removeCard(cardElement) {
        return gsap.to(cardElement, {
            y: window.innerHeight + 100,
            rotation: Math.random() * 360,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => cardElement.remove()
        });
    }
}
