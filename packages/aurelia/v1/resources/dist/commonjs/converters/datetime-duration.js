"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DurationValueConverter = void 0;
var tslib_1 = require("tslib");
var aurelia_framework_1 = require("aurelia-framework");
var javascript_time_ago_1 = tslib_1.__importDefault(require("javascript-time-ago"));
function loadLocale(locale) {
    switch (locale) {
        case 'en':
            return require('javascript-time-ago/locale/en');
        case 'nb':
            return require('javascript-time-ago/locale/nb');
        case 'sv':
            return require('javascript-time-ago/locale/sv');
        default:
            throw new Error("Locale ".concat(locale, " is not supported."));
    }
}
var en = loadLocale('en');
var nb = loadLocale('nb');
var sv = loadLocale('sv');
var localesModules = [en, nb, sv];
javascript_time_ago_1.default.addDefaultLocale(localesModules[0]);
localesModules.forEach(function (l) { return javascript_time_ago_1.default.addLocale(l); });
var DurationValueConverter = (function () {
    function DurationValueConverter() {
        this.toView = DurationValueConverter_1.convert;
    }
    DurationValueConverter_1 = DurationValueConverter;
    DurationValueConverter.configure = function (opts) {
        var _a;
        opts = Object.assign({}, opts !== null && opts !== void 0 ? opts : {});
        DurationValueConverter_1.defaultLocale = (_a = opts === null || opts === void 0 ? void 0 : opts.locale) !== null && _a !== void 0 ? _a : 'en';
        DurationValueConverter_1.opts = opts;
        DurationValueConverter_1.ctrs = {};
        localesModules.forEach(function (l) {
            var locale = l.locale;
            DurationValueConverter_1.ctrs[locale] = new javascript_time_ago_1.default(locale);
        });
        this.isConfigured = true;
    };
    ;
    DurationValueConverter.convert = function (date, opts) {
        var _a;
        DurationValueConverter_1.verifyConfig(opts);
        try {
            var parsedDate = typeof date === 'string' ? new Date(date) : date;
            var ctr = DurationValueConverter_1.ctrs[(_a = opts === null || opts === void 0 ? void 0 : opts.locale) !== null && _a !== void 0 ? _a : DurationValueConverter_1.defaultLocale];
            return ctr.format(parsedDate, opts);
        }
        catch (error) {
            console.error(error);
            return 'error';
        }
    };
    DurationValueConverter.verifyConfig = function (opts) {
        if (!this.isConfigured) {
            this.configure(opts);
        }
    };
    var DurationValueConverter_1;
    DurationValueConverter.isConfigured = false;
    DurationValueConverter = DurationValueConverter_1 = tslib_1.__decorate([
        (0, aurelia_framework_1.valueConverter)('duration')
    ], DurationValueConverter);
    return DurationValueConverter;
}());
exports.DurationValueConverter = DurationValueConverter;

//# sourceMappingURL=datetime-duration.js.map
