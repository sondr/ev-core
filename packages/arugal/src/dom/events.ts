import { CSS_CLASSES } from '../utils/constants';

export class EventManager {
    private listeners: { target: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions }[] = [];

    public add(target: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
        target.addEventListener(type, listener, options);
        this.listeners.push({ target, type, listener, options });
    }

    public remove(target: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
        target.removeEventListener(type, listener, options);
        this.listeners = this.listeners.filter(l => l.target !== target || l.type !== type || l.listener !== listener);
    }

    public removeAll() {
        this.listeners.forEach(({ target, type, listener, options }) => {
            target.removeEventListener(type, listener, options);
        });
        this.listeners = [];
    }
}

export class ScrollLock {
    private static isLocked = false;
    private static preventDefaultHandler = (e: Event) => {
        e.preventDefault();
    }

    static lock() {
        if (this.isLocked) return;
        document.body.classList.add(CSS_CLASSES.PREVENT_SCROLL);
        document.addEventListener('touchmove', this.preventDefaultHandler, { passive: false });
        this.isLocked = true;
    }

    static unlock() {
        if (!this.isLocked) return;
        document.body.classList.remove(CSS_CLASSES.PREVENT_SCROLL);
        document.removeEventListener('touchmove', this.preventDefaultHandler);
        this.isLocked = false;
    }
}
