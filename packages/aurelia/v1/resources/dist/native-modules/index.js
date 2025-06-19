import { PLATFORM } from 'aurelia-pal';
export function configure(config) {
    config.globalResources([
        PLATFORM.moduleName('./binding-behaviors/integer-input'),
        PLATFORM.moduleName('./converters/filter'),
        PLATFORM.moduleName('./converters/join'),
        PLATFORM.moduleName('./converters/datetime-duration'),
        PLATFORM.moduleName('./converters/datetime'),
        PLATFORM.moduleName('./converters/numberformat'),
        PLATFORM.moduleName('./converters/numeral'),
        PLATFORM.moduleName('./converters/take'),
        PLATFORM.moduleName('./converters/sort'),
        PLATFORM.moduleName('./converters/sum'),
        PLATFORM.moduleName('./view-hooks/as-element')
    ]);
}
export * from './utils/geolocator';
export * from './utils/media-device';
export * from './utils/notificator';
export * from './utils/speech-generator';
export * from './utils/timeout-intervaller';

//# sourceMappingURL=index.js.map
