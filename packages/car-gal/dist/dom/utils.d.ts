import { IMedia, ICreateElementObject, ISrcSet } from '../interfaces';
import { ICgElement } from '../interfaces';
export declare function createElement(createObject: ICreateElementObject): HTMLElement;
export declare function convertToMediaObjects(elements: (HTMLElement | HTMLElement[])[]): IMedia[];
export declare function convertToMediaObject(element: HTMLElement | HTMLElement[]): IMedia;
export declare function getImageSrcSet(element: HTMLImageElement): ISrcSet[] | undefined;
export declare class CgElement {
    parentElement: HTMLElement;
    readonly element: HTMLElement;
    readonly children?: CgElement[];
    readonly options: ICgElement;
    constructor(opts?: ICgElement);
    get Element(): HTMLElement;
    setParent(parent: HTMLElement): void;
    private init;
    private mapChildren;
    appendChild(child: CgElement | ICgElement): CgElement;
    dispose(removeFromParent?: boolean): void;
}
export declare function findElement(DOM: Document | HTMLElement, query: string): HTMLElement;
export declare function progressiveImageLoad(media: IMedia): void;
export declare function deepObjectAssign<T>(o: {
    target: T;
    sources: T[];
    skipKeys?: string[];
}): T;
export declare function isObject(item: any): boolean;
export declare function isMergebleObject(item: any): boolean;
export declare function getYoutubeImg(id: string, quality?: number): string;
export declare function loadResource(element: HTMLElement): HTMLElement;
//# sourceMappingURL=utils.d.ts.map