"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configure = configure;
var tslib_1 = require("tslib");
var aurelia_pal_1 = require("aurelia-pal");
function configure(config) {
    config.globalResources([
        aurelia_pal_1.PLATFORM.moduleName('./binding-behaviors/integer-input'),
        aurelia_pal_1.PLATFORM.moduleName('./converters/filter'),
        aurelia_pal_1.PLATFORM.moduleName('./converters/join'),
        aurelia_pal_1.PLATFORM.moduleName('./converters/datetime-duration'),
        aurelia_pal_1.PLATFORM.moduleName('./converters/datetime'),
        aurelia_pal_1.PLATFORM.moduleName('./converters/numberformat'),
        aurelia_pal_1.PLATFORM.moduleName('./converters/numeral'),
        aurelia_pal_1.PLATFORM.moduleName('./converters/take'),
        aurelia_pal_1.PLATFORM.moduleName('./converters/sort'),
        aurelia_pal_1.PLATFORM.moduleName('./converters/sum'),
        aurelia_pal_1.PLATFORM.moduleName('./view-hooks/as-element')
    ]);
}
tslib_1.__exportStar(require("./utils/geolocator"), exports);
tslib_1.__exportStar(require("./utils/media-device"), exports);
tslib_1.__exportStar(require("./utils/notificator"), exports);
tslib_1.__exportStar(require("./utils/speech-generator"), exports);
tslib_1.__exportStar(require("./utils/timeout-intervaller"), exports);

//# sourceMappingURL=index.js.map
