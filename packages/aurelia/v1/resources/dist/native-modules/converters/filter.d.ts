import { Parser } from 'aurelia-framework';
import { IFilterOptions } from '../interfaces';
export declare class FilterValueConverter {
    private readonly parser;
    constructor(parser: Parser);
    toView(arr: any, opts: IFilterOptions): any;
}
