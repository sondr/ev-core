import { INumberFormatOptions } from '../interfaces';
export declare class NumberFormatValueConverter {
    toView: typeof NumberFormatValueConverter.convert;
    static readonly config: INumberFormatOptions;
    static setConfig(cb: (config: INumberFormatOptions) => void): void;
    static convert(value: number, opts: INumberFormatOptions): string;
}
