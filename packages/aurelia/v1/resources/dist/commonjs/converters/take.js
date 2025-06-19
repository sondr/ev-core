"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TakeValueConverter = void 0;
var tslib_1 = require("tslib");
var aurelia_framework_1 = require("aurelia-framework");
var TakeValueConverter = (function () {
    function TakeValueConverter() {
    }
    TakeValueConverter.prototype.toView = function (array, opts) {
        var _a;
        var valid = validate(array, opts);
        if (!valid) {
            return array;
        }
        var take = opts.take;
        var skip = opts.page >= 0 ? (opts.page * opts.take) : (_a = opts.skip) !== null && _a !== void 0 ? _a : 0;
        return array.slice(skip, skip + take);
    };
    TakeValueConverter = tslib_1.__decorate([
        (0, aurelia_framework_1.valueConverter)('take')
    ], TakeValueConverter);
    return TakeValueConverter;
}());
exports.TakeValueConverter = TakeValueConverter;
function validate(array, opts) {
    var invalid = (opts === null || opts === void 0 ? void 0 : opts.disabled) ||
        !Array.isArray(array) ||
        !((opts === null || opts === void 0 ? void 0 : opts.take) >= 0) ||
        !((opts === null || opts === void 0 ? void 0 : opts.page) >= 0 || (opts === null || opts === void 0 ? void 0 : opts.skip) >= 0);
    return !invalid;
}
;

//# sourceMappingURL=take.js.map
