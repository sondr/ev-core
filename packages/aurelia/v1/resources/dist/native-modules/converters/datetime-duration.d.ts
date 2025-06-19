import { FormatOptions } from 'javascript-time-ago';
export declare class DurationValueConverter {
    private static isConfigured;
    private static defaultLocale;
    private static opts;
    private static ctrs;
    toView: typeof DurationValueConverter.convert;
    static configure(opts?: IDurationOptions): void;
    static convert(date: string | Date, opts?: IDurationOptions): string;
    private static verifyConfig;
}
interface IDurationOptions extends FormatOptions {
    locale?: string;
    base?: Date | string;
}
export {};
