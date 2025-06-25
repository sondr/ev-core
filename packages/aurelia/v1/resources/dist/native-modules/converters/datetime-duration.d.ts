import { FormatOptions } from 'javascript-time-ago';
export type durationConfigure = (config: IDurationOptions) => void;
export declare class DurationValueConverter {
    private static isConfigured;
    private static defaultLocale;
    private static opts;
    private static ctrs;
    toView: typeof DurationValueConverter.convert;
    static configure(cfg?: durationConfigure): void;
    static convert(date: string | Date, opts?: IDurationOptions): string;
    private static verifyConfig;
}
export interface IDurationOptions extends FormatOptions {
    locale?: string;
    base?: Date | string;
}
