import { CgElement } from '../dom/utils';
import { Carousel } from './carousel';
export declare class Thumbnails {
    private active;
    private carousel;
    model: CgElement;
    private thumbnailList?;
    constructor(carousel: Carousel);
    get isActive(): boolean;
    show(): void;
    hide(): void;
    toggle(): void;
    init(): CgElement;
    setActive(index: number, lastActiveIndex?: number): void;
    create_thumbnails(): CgElement;
    dispose(): void;
}
//# sourceMappingURL=thumbnails.d.ts.map