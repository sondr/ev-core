export interface OptionsInterface {
    key: string;
    enabled: boolean;
    resetDatalayerOnPageChange: boolean;
    trackCurrentPageOnEnable: boolean;
    pageTracking: PropertyOptionsInterface;
    logging: PropertyOptionsInterface;
    async: boolean;
    defer: boolean;
    [key: string]: string | boolean | PropertyOptionsInterface;
}
export interface PropertyOptionsInterface {
    name?: string;
    enabled?: boolean;
}
export declare class PropertyOption implements PropertyOptionsInterface {
    name: string;
    enabled: boolean;
    constructor(enable?: boolean, name?: string);
    enable(): void;
    disable(): void;
}
export declare class Configure {
    private _options;
    constructor();
    options(opts: string | OptionsInterface): OptionsInterface;
    getOptions(): OptionsInterface;
    get(key: string): string | boolean | PropertyOptionsInterface;
}
