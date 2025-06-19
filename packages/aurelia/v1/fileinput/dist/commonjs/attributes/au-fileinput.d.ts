import { IFileInputOptions } from "@ev-core/core";
export declare class FileinputAttrComponent {
    private el;
    private fi;
    opts: IFileInputOptions;
    submit: (files: FileList | null) => void;
    handleOnClick: (e: MouseEvent) => {};
    constructor();
    attached(): void;
    detached(): void;
}
