"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configure = configure;
exports.getDate = getDate;
exports.buildOptions = buildOptions;
exports.getDateTimeOptions = getDateTimeOptions;
var luxon_1 = require("luxon");
var defaultConfig = {
    defaultFormat: 'dd. LL yyyy'
};
function configure(cb) {
    cb(defaultConfig);
}
function getDate(date, opts) {
    opts = opts !== null && opts !== void 0 ? opts : {};
    if (!opts.locale) {
        opts.locale = defaultConfig.locale;
    }
    if (!opts.zone) {
        opts.zone = defaultConfig.zone;
    }
    return typeof date === 'string' ?
        luxon_1.DateTime.fromISO(date, opts) :
        luxon_1.DateTime.fromJSDate(date, opts);
}
function buildOptions(opts) {
    var _a;
    var options = Object.assign({}, defaultConfig, opts !== null && opts !== void 0 ? opts : {});
    if (!options.format) {
        options.format = (_a = defaultConfig.format) !== null && _a !== void 0 ? _a : defaultConfig.defaultFormat;
    }
    if (!options.defaultFormat) {
        options.format;
    }
    return options;
}
function getDateTimeOptions(opts) {
    var _a, _b;
    return {
        locale: (_a = opts === null || opts === void 0 ? void 0 : opts.locale) !== null && _a !== void 0 ? _a : defaultConfig.locale,
        zone: (_b = opts === null || opts === void 0 ? void 0 : opts.zone) !== null && _b !== void 0 ? _b : defaultConfig.zone
    };
}

//# sourceMappingURL=datetime-config.js.map
