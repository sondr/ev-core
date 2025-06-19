import { CgElement } from '../dom/utils';
import { Carousel } from './carousel';
import { IGallery, IMedia } from '../interfaces';
export declare class Fullscreen {
    private readonly gallery;
    private readonly images;
    private readonly carousel;
    private readonly menubar;
    element?: CgElement;
    private carouselContainer?;
    private options;
    private titleElement?;
    private indicator?;
    private overlayStyleClass?;
    constructor(gallery: IGallery);
    get Carousel(): Carousel;
    get Media(): IMedia[];
    createContainerElements(): void;
    show(index: number): void;
    close(): void;
    dispose(): void;
    setThumbnailsActiveState(value?: boolean): void;
    createMenuBar(): CgElement;
    setMenubarFixed(value: boolean): void;
    setMediaInfo(media: IMedia, index: number, length: number, carousel: Carousel): void;
}
//# sourceMappingURL=fullscreen.d.ts.map