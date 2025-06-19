declare abstract class TimeIntervalBase {
    protected id?: number;
    abstract start(...args: any[]): void;
    abstract clear(): TimeIntervalBase;
}
export declare class Timeouter extends TimeIntervalBase {
    start<TArgs extends any[]>(handler: TimerHandler, ms: number, ...args: TArgs): void;
    clear(): this;
}
export declare class Intervaller extends TimeIntervalBase {
    start<TArgs extends any[]>(handler: TimerHandler, timeout: number, ...args: TArgs): void;
    clear(): this;
}
export declare class AnimationFrameScheduler extends TimeIntervalBase {
    start(handler: FrameRequestCallback): void;
    clear(): TimeIntervalBase;
}
export declare class WorkerTimer extends TimeIntervalBase {
    private worker?;
    start<TArgs extends any[]>(handler: TimerHandler, timeout: number, ...args: TArgs): void;
    clear(): TimeIntervalBase;
}
export declare class PromiseTimer extends TimeIntervalBase {
    private cancel?;
    start<TArgs extends any[]>(handler: TimerHandler, timeout: number, ...args: TArgs): void;
    clear(): TimeIntervalBase;
}
export {};
