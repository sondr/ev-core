import { Overlay } from './dom/overlay';
import { DynamicStyle } from './dom/dynamic-styles';
export let _PLATFORM;
export class PLATFORM {
    // static create(DOM: Document, global: Window, container: HTMLElement, defaultOptions: Options) {
    //     _PLATFORM = new PLATFORM(DOM, global, container, defaultOptions);
    //     return _PLATFORM;
    // }
    static create(config) {
        _PLATFORM = new PLATFORM(config.document, config.window, config.containerElement, config.defaultOptions, config.Events);
        return _PLATFORM;
    }
    constructor(DOM, global, container, defaultOptions, configEvents) {
        this.DOM = DOM;
        this.global = global;
        this.container = container;
        this.defaultOptions = defaultOptions;
        this.configEvents = configEvents;
        this.variables = {};
        _PLATFORM = this;
        this.overlay = new Overlay();
        this.styleSheet = new DynamicStyle();
        //console.log("Container", this.container);
    }
    dispose() {
        try {
            if (!this.overlay.isDisposed)
                this.overlay.dispose();
            if (!this.styleSheet.isDisposed)
                this.styleSheet.dispose();
        }
        catch (e) {
            console.error("Cargal _platform", e);
        }
    }
}
//# sourceMappingURL=platform.js.map