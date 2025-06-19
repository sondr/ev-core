export declare function removeEventListeners(el?: HTMLElement, events?: IElementTogglerListener[]): void;
export declare function addEventListeners(el?: HTMLElement, events?: IElementTogglerListener[]): void;
export interface IElementTogglerListener {
    key: string;
    event: <K extends keyof HTMLElementEventMap>(ev: HTMLElementEventMap[K]) => any;
    options?: boolean | AddEventListenerOptions;
}
//# sourceMappingURL=element-listening.d.ts.map