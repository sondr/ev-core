import { __decorate } from "tslib";
import { valueConverter } from 'aurelia-framework';
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
    TakeValueConverter = __decorate([
        valueConverter('take')
    ], TakeValueConverter);
    return TakeValueConverter;
}());
export { TakeValueConverter };
function validate(array, opts) {
    var invalid = (opts === null || opts === void 0 ? void 0 : opts.disabled) ||
        !Array.isArray(array) ||
        !((opts === null || opts === void 0 ? void 0 : opts.take) >= 0) ||
        !((opts === null || opts === void 0 ? void 0 : opts.page) >= 0 || (opts === null || opts === void 0 ? void 0 : opts.skip) >= 0);
    return !invalid;
}
;

//# sourceMappingURL=take.js.map
