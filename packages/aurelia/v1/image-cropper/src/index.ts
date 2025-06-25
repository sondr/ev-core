import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

import { CropperCustomElement, IOptions } from './elements/cropper-element';

export function configure(config: FrameworkConfiguration): void {
  config.globalResources([
    PLATFORM.moduleName('./elements/cropper-element')
  ]);
}

export {
  CropperCustomElement,
  IOptions
}