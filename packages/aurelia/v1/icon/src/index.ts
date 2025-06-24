import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

export function configure(config: FrameworkConfiguration): void {
  config.globalResources([
    PLATFORM.moduleName('./attributes/icon-attribute'),
    PLATFORM.moduleName('./value-converter/icon-valueconverter')
  ]);
}
