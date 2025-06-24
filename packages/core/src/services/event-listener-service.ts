import { IDisposable } from "../interfaces/disposable";

export type TEventType = (keyof DocumentEventMap) | string;


export class DomListenerService {
    private listeners: DomListenerItem[] = [];

    public register(element: Document | HTMLElement, event: TEventType, callback: (event: Event) => void, capture: boolean = false): DomListenerItem {
        const listener = new DomListenerItem(element, event, callback, capture, this.remove.bind(this));
        this.listeners.push(listener);

        return listener;
    }

    public getListeners() {
        return this.listeners;
    }

    private remove(listener: DomListenerItem) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }
}


export class DomListenerItem implements IDisposable {
    private isActive: boolean = false;

    constructor(
        public readonly element: Document | HTMLElement | Window,
        public readonly event: TEventType,
        private readonly callback: (event: Event) => void,
        public readonly capture: boolean,
        private removeCallback: (listener: DomListenerItem) => void
    ) {}

    public activate() {
        if (!this.isActive) {
            this.delayedAttach();
        }
        return this;
    }

    public deactivate() {
        if (this.isActive) {
            this.element.removeEventListener(this.event, this.callback, this.capture);
            this.isActive = false;
        }

        return this;
    }

    public dispose() {
        this.deactivate();
        this.removeCallback(this); // Notify the service to remove this from its tracking list
    }

    private delayedAttach() {
        setTimeout(() => { this.attach(); }, 0);
    }

    private attach() {
        this.element.addEventListener(this.event, this.callback, this.capture);
        this.isActive = true;
    }
}