export declare class FileinputCall {
    private readonly doc;
    private el;
    constructor(doc?: Document);
    call(opts?: IFileInputOptions): Promise<FileList>;
    private init;
    destroy(): void;
}
export interface IFileInputOptions {
    multiple?: boolean;
    accept?: string;
    capture?: string;
    webkitdirectory?: boolean;
}
export declare function saveAs(blob: File | Blob, filename: string, globalWindow?: Window & typeof globalThis): void;
//# sourceMappingURL=file.d.ts.map