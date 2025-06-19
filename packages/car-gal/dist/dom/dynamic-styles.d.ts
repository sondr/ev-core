import { dynCssVariables, IcGElementStyleObject } from '../interfaces';
export declare class DynamicStyle {
    private disposed;
    counter: number;
    styleSheet?: HTMLStyleElement;
    variables: dynCssVariables[];
    private attached;
    constructor();
    get isDisposed(): boolean;
    appendStyle(styles: IcGElementStyleObject): string | undefined;
    overWriteStyle(selector: string, styles: string[][]): void;
    findStyle(classString: string): void;
    buildSheet(): void;
    attachStylesheet(): void;
    dispose(): void;
}
//# sourceMappingURL=dynamic-styles.d.ts.map