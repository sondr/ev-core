import { OptionsInterface } from './configure';
export declare class TagManager {
    private ea;
    private settings;
    private noScriptElement?;
    private scriptElement?;
    private subscriptions;
    private flags;
    private initialized;
    private logger;
    private options;
    private dataLayer;
    constructor();
    init(initData: string | OptionsInterface): void;
    dispatchDataLayerEvent(event: Object): void;
    enable(): void;
    disable(): void;
    isActive(): boolean;
    getKey(): string;
    private setup;
    private checkSettings;
    private attachScriptElements;
    private detachScripts;
    private attachPageTracker;
    private resetDataLayer;
    private log;
    private trackPage;
    private ensureDataLayer;
}
