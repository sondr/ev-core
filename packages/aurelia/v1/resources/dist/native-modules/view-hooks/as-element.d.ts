export interface IAsElementViewHookTags {
    from: string;
    to: string;
}
export declare class AsElementViewHook {
    static tags: IAsElementViewHookTags[];
    beforeCompile(template: DocumentFragment): void;
}
