import { CgElement } from './utils';
export declare class Overlay {
    private active;
    private disposed;
    private element;
    private initialClasses;
    private lastActiveElement?;
    constructor();
    get isActive(): boolean;
    get Container(): CgElement;
    get isDisposed(): boolean;
    show(fullscreenElement: HTMLElement, overlayClass?: string): void;
    close(): void;
    remove_fullscreen_element(fullscreenElement: HTMLElement): void;
    dispose(): void;
    private remove_overlay;
    private prevent_scroll;
    private allow_scroll;
}
//# sourceMappingURL=overlay.d.ts.map