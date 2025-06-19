interface IUtteranceOptions {
    lang?: string;
    pitch?: number;
    rate?: number;
    volume?: number;
}
export declare class SpeechGenerator {
    private readonly utterance;
    private id?;
    constructor(opts?: IUtteranceOptions);
    setOptions(opts?: IUtteranceOptions): void;
    setVoice(voice: SpeechSynthesisVoice): void;
    resume(): void;
    pause(): void;
    cancel(): void;
    getVoices(): void;
    speak(text: string): void;
}
export {};
