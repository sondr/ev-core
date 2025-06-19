import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

export function configure(fwc: FrameworkConfiguration, configCallback?: (config: any) => Promise<any>) {
fwc.globalResources([
    PLATFORM.moduleName('./elements/hello-world')
  ]);

  //const instance = fwc.container.get(ToConfigure);
  // if (configCallback !== undefined && typeof (configCallback) === 'function') {
  //   configCallback(instance);
  // } 
}