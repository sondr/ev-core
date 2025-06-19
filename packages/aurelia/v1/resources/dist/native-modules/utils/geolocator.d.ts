export declare class GeoLocator {
    private readonly ctr;
    private id?;
    constructor();
    locate(): Promise<GeolocationPosition>;
    watch(success: PositionCallback, error: PositionErrorCallback): void;
    stopWatch(): void;
}
