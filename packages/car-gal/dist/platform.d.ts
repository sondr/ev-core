import { Options, Config, ConfigEvents } from './interfaces';
import { Overlay } from './dom/overlay';
import { DynamicStyle } from './dom/dynamic-styles';
export declare let _PLATFORM: PLATFORM;
export declare class PLATFORM {
    readonly DOM: Document;
    readonly global: Window;
    readonly overlay: Overlay;
    readonly styleSheet: DynamicStyle;
    readonly configEvents: ConfigEvents;
    readonly container: HTMLElement;
    readonly defaultOptions: Options;
    readonly variables: any;
    static create(config: Config): PLATFORM;
    constructor(DOM: Document, global: Window, container: HTMLElement, defaultOptions: Options, configEvents?: ConfigEvents);
    dispose(): void;
}
//# sourceMappingURL=platform.d.ts.map