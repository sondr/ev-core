import { IGallery, Config, ICarGalInstance } from './interfaces';
export declare class CarGal implements ICarGalInstance {
    private eventListeners;
    galleries: IGallery[];
    private fullscreenGalleryindex?;
    constructor(config: Config);
    private findExternalImages;
    private findGalleries;
    private get_autoinit_galleries;
    private get_dataset_options;
    private setup;
    private attachGlobalEventListeners;
    private updateGalleryImageSizes;
    private attachGalleryEventListeners;
    private detachEventListeners;
    dispose(): void;
}
//# sourceMappingURL=car-gal.d.ts.map