import { IGallery, ICgElement, IcGElementStyleObject } from '../interfaces';
import { Fullscreen } from './fullscreen';
import { CgElement } from '../dom/utils';
import { Thumbnails } from './thumbnails';
export declare class Carousel {
    readonly fullScreen: Fullscreen;
    readonly gallery: IGallery;
    thumbnails?: Thumbnails;
    private running;
    private intervalTimer;
    private activeIndex?;
    private element?;
    private carouselElement?;
    private descriptionElement?;
    private buttonContainer?;
    private btnsEntries;
    constructor(gallery: IGallery, fullScreen?: Fullscreen);
    get Element(): CgElement;
    get CarouselElement(): CgElement;
    get Thumbnails(): Thumbnails;
    get Media(): import("../interfaces").IMedia[];
    get getActiveIndex(): number;
    get DescriptionElement(): CgElement;
    private activateThumbnails;
    private init;
    createButtons(): ICgElement;
    MakeStylesObject(values: {
        entries: [string, any][];
        container?: string[];
        childs?: string[];
    }): IcGElementStyleObject | undefined;
    togglePlay(): void;
    play(): void;
    stop(): void;
    cycle(count: number, continuePlay?: boolean): void;
    set_active(index: number, continuePlay?: boolean): void;
    set_interval(interval: number): void;
    dispose(): void;
    private restart;
    private set_inactive;
    private set_all_inactive;
}
//# sourceMappingURL=carousel.d.ts.map