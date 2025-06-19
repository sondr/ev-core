import { FrameworkConfiguration } from 'aurelia-framework';
import { TagManager } from './gtm/tag-manager';
import { OptionsInterface } from './gtm/configure';
export declare function configure(aurelia: FrameworkConfiguration, configCallback?: (config: any) => Promise<any>): void;
export { TagManager };
export { OptionsInterface };
