import { ISortOptions } from '../interfaces';
export declare class SortValueConverter {
    toView: typeof SortValueConverter.sort;
    static sort<T>(array: T[], opts: ISortOptions): T[];
}
