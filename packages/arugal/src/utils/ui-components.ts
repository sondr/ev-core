import { CSS_CLASSES, ARIA_LABELS } from './constants';
import { EventManager } from '../dom/events';

/**
 * Factory for creating common UI components
 */
export class UIComponents {
    /**
     * Creates a navigation button with consistent styling and accessibility
     * Used in lightbox for prev/next navigation
     */
    static createNavButton(
        type: 'prev' | 'next',
        onClick: (e: Event) => void,
        eventManager: EventManager
    ): HTMLButtonElement {
        const button = document.createElement('button');
        button.className = `${CSS_CLASSES.NAV_BTN} ${type === 'prev' ? CSS_CLASSES.PREV : CSS_CLASSES.NEXT}`;
        button.textContent = type === 'prev' ? '‹' : '›';
        button.setAttribute('aria-label', type === 'prev' ? ARIA_LABELS.PREV_BUTTON : ARIA_LABELS.NEXT_BUTTON);
        button.type = 'button';
        
        eventManager.add(button, 'click', onClick);
        
        return button;
    }

    /**
     * Creates a navigation controls container with prev/next buttons
     */
    static createNavigationControls(
        onPrev: (e: Event) => void,
        onNext: (e: Event) => void,
        eventManager: EventManager
    ): HTMLElement {
        const container = document.createElement('div');
        container.className = CSS_CLASSES.CONTROLS;

        const prevBtn = UIComponents.createNavButton('prev', onPrev, eventManager);
        const nextBtn = UIComponents.createNavButton('next', onNext, eventManager);

        container.appendChild(prevBtn);
        container.appendChild(nextBtn);

        return container;
    }

    /**
     * Creates a pagination dot
     */
    static createPaginationDot(
        index: number,
        isActive: boolean,
        onClick: (e: Event) => void,
        eventManager?: EventManager
    ): HTMLButtonElement {
        const dot = document.createElement('button');
        dot.className = CSS_CLASSES.DOT + (isActive ? ` ${CSS_CLASSES.ACTIVE}` : '');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.type = 'button';
        
        if (eventManager) {
            eventManager.add(dot, 'click', onClick);
        } else {
            dot.addEventListener('click', onClick);
        }
        
        return dot;
    }

    /**
     * Updates active state on a collection of elements
     */
    static updateActiveState(elements: NodeListOf<Element>, activeIndex: number): void {
        elements.forEach((el, i) => {
            if (i === activeIndex) {
                el.classList.add(CSS_CLASSES.ACTIVE);
            } else {
                el.classList.remove(CSS_CLASSES.ACTIVE);
            }
        });
    }
}

/**
 * Base class for components that emit events
 */
export class EventEmitter {
    private events: Record<string, Function | undefined> = {};

    constructor(events?: Record<string, unknown>) {
        if (events) {
            this.events = events as Record<string, Function>;
        }
    }

    protected trigger(eventName: string, data: any = {}): void {
        const handler = this.events[eventName];
        if (handler && typeof handler === 'function') {
            handler(data, this);
        }
    }

    public on(eventName: string, handler: Function): void {
        this.events[eventName] = handler;
    }

    public off(eventName: string): void {
        delete this.events[eventName];
    }
}
