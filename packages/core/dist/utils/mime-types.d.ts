declare class MimeType {
    readonly type: string;
    readonly exts: string[];
    constructor(type: string, exts: string[]);
}
declare class MimeGroup {
    readonly name: string;
    readonly types: MimeType[];
    constructor(name: string, types: MimeType[]);
    findExtension(type: string): string;
    findExtensions(type: string): string[];
    findType(extension: string): string;
}
export declare const imageMimeTypes: MimeType[];
declare class MimeFinder {
    readonly image: MimeGroup;
    findExtension(type: string): MimeGroup;
    findExtensions(type: string): MimeGroup;
    findType(type: string): MimeGroup;
}
export declare const mimes: MimeFinder;
export {};
//# sourceMappingURL=mime-types.d.ts.map