import { IElementTogglerListener } from "./element-listening";
export declare class ElementManager implements IElementTogglerArgs {
    private _counter;
    get counter(): number;
    el?: HTMLElement;
    attrs: {
        [key: string]: string;
    };
    css: Partial<CSSStyleDeclaration>;
    classes: string[];
    listeners: IElementTogglerListener[];
    data: any;
    static create: (args: IElementTogglerArgs) => ElementManager;
    private constructor();
    private setProperties;
    private get mutableProperties();
    get properties(): IElementTogglerArgs;
    setElement(el: HTMLElement, cleanPrevious?: boolean): void;
    apply(cb?: (args: IElementTogglerArgs) => void, cleanPrevious?: boolean): this;
    private count;
    remove(): this;
    dispose(): void;
    private removeListeners;
    private removeClass;
    private removeCss;
    private removeAttrs;
    private applyListeners;
    private applyClass;
    private applyCss;
    private applyAttrs;
}
export interface IElementTogglerArgs {
    el?: HTMLElement;
    attrs?: {
        [key: string]: string;
    };
    css?: Partial<CSSStyleDeclaration>;
    classes?: string[];
    listeners?: IElementTogglerListener[];
    data?: any;
}
//# sourceMappingURL=element-manager.d.ts.map