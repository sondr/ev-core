"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TakeValueConverter = exports.SumValueConverter = exports.SortValueConverter = exports.RouteHrefValueConverter = exports.NumeralValueConverter = exports.NumberFormatValueConverter = exports.JoinValueConverter = exports.FilterValueConverter = exports.DurationValueConverter = exports.DatetimeValueConverter = exports.ResourcesPluginConfiguration = void 0;
exports.configure = configure;
var tslib_1 = require("tslib");
var aurelia_pal_1 = require("aurelia-pal");
;
var configuration_builder_1 = require("./configuration-builder");
Object.defineProperty(exports, "ResourcesPluginConfiguration", { enumerable: true, get: function () { return configuration_builder_1.ResourcesPluginConfiguration; } });
var datetime_1 = require("./converters/datetime");
Object.defineProperty(exports, "DatetimeValueConverter", { enumerable: true, get: function () { return datetime_1.DatetimeValueConverter; } });
var datetime_duration_1 = require("./converters/datetime-duration");
Object.defineProperty(exports, "DurationValueConverter", { enumerable: true, get: function () { return datetime_duration_1.DurationValueConverter; } });
var filter_1 = require("./converters/filter");
Object.defineProperty(exports, "FilterValueConverter", { enumerable: true, get: function () { return filter_1.FilterValueConverter; } });
var join_1 = require("./converters/join");
Object.defineProperty(exports, "JoinValueConverter", { enumerable: true, get: function () { return join_1.JoinValueConverter; } });
var numberformat_1 = require("./converters/numberformat");
Object.defineProperty(exports, "NumberFormatValueConverter", { enumerable: true, get: function () { return numberformat_1.NumberFormatValueConverter; } });
var numeral_1 = require("./converters/numeral");
Object.defineProperty(exports, "NumeralValueConverter", { enumerable: true, get: function () { return numeral_1.NumeralValueConverter; } });
var route_href_1 = require("./converters/route-href");
Object.defineProperty(exports, "RouteHrefValueConverter", { enumerable: true, get: function () { return route_href_1.RouteHrefValueConverter; } });
var sort_1 = require("./converters/sort");
Object.defineProperty(exports, "SortValueConverter", { enumerable: true, get: function () { return sort_1.SortValueConverter; } });
var sum_1 = require("./converters/sum");
Object.defineProperty(exports, "SumValueConverter", { enumerable: true, get: function () { return sum_1.SumValueConverter; } });
var take_1 = require("./converters/take");
Object.defineProperty(exports, "TakeValueConverter", { enumerable: true, get: function () { return take_1.TakeValueConverter; } });
function configure(fc, cfg) {
    fc.globalResources([
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
    var pc = fc.container.get(configuration_builder_1.ResourcesPluginConfiguration);
    if (cfg) {
        cfg(pc);
    }
}
tslib_1.__exportStar(require("./utils/geolocator"), exports);
tslib_1.__exportStar(require("./utils/media-device"), exports);
tslib_1.__exportStar(require("./utils/notificator"), exports);
tslib_1.__exportStar(require("./utils/speech-generator"), exports);
tslib_1.__exportStar(require("./utils/timeout-intervaller"), exports);
tslib_1.__exportStar(require("./interfaces"), exports);

//# sourceMappingURL=index.js.map
