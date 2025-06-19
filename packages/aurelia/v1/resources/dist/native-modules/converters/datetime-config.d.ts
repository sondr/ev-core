import { DateTimeOptions, Zone } from 'luxon';
import { IDateTimeValueConverterConfig } from '../interfaces';
export declare function configure(cb: (config: IDateTimeValueConverterOptions) => void): void;
export declare function getDate(date: string | Date, opts?: DateTimeOptions): any;
export declare function buildOptions(opts?: IDateTimeValueConverterOptions): IDateTimeValueConverterOptions;
export declare function getDateTimeOptions(opts?: IDateTimeValueConverterOptions): DateTimeOptions;
export interface IDateTimeValueConverterOptions extends Partial<IDateTimeValueConverterConfig> {
    format?: string;
    type?: 'toFormat' | 'toRelative' | 'relativeToCalendar';
    relativeBase?: string | Date;
    zone?: string | Zone | undefined;
}
