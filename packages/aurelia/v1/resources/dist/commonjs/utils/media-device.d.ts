export declare class MediaDevice {
    stream: MediaStream;
    start(options: DisplayMediaStreamOptions): Promise<void>;
    stop(): void;
}
