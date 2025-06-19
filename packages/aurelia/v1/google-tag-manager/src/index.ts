import { FrameworkConfiguration } from 'aurelia-framework';
import { TagManager } from './gtm/tag-manager';
import { OptionsInterface } from './gtm/configure';

export function configure(aurelia: FrameworkConfiguration, configCallback?: (config: any) => Promise<any>) {
  const instance = aurelia.container.get(TagManager) as TagManager;

  if (configCallback !== undefined && typeof (configCallback) === 'function') {
    configCallback(instance);
  }
}

export {
  TagManager,
  OptionsInterface
};