type InstanceType = 'string' | 'number' | 'boolean' | 'bigint' | 'function' | 'symbol' | 'undefined' | Object | any;
export declare function isPrimitive(arg: any): boolean;
export declare function typeOf(obj: any): any;
export declare function instanceOf(obj: any, type: InstanceType): any;
export declare function isString(obj: any): obj is string;
export declare function isNumber(obj: any): obj is number;
export declare function isBool(obj: any): obj is boolean;
export declare function isDate(obj: any): obj is Date;
export {};
//# sourceMappingURL=is-of.d.ts.map