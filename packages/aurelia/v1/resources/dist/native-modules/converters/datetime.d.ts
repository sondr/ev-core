import { IDateTimeValueConverterOptions, configure } from './datetime-config';
export declare class DatetimeValueConverter {
    toView: typeof DatetimeValueConverter.convert;
    static configure: typeof configure;
    static convert(date: string | Date, options?: IDateTimeValueConverterOptions): any;
}
