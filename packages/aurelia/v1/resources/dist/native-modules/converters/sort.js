import { __decorate } from "tslib";
import { valueConverter } from 'aurelia-framework';
var SortValueConverter = (function () {
    function SortValueConverter() {
        this.toView = SortValueConverter_1.sort;
    }
    SortValueConverter_1 = SortValueConverter;
    SortValueConverter.sort = function (array, opts) {
        var _a;
        var isValid = validate(array, opts);
        if (!isValid) {
            return array;
        }
        var key = opts.key;
        var factor = opts.asc === true ? 1 : -1;
        var firstValue = (_a = array.find(function (e) { return e[key]; })) === null || _a === void 0 ? void 0 : _a[key];
        if (!firstValue) {
            return array;
        }
        var sorted;
        var sortType = findSortType(firstValue);
        switch (sortType) {
            case SortTypes.Date:
                try {
                    sorted = array.sort(function (a, b) { return (a[key].getTime() - b[key].getTime()) * factor; });
                }
                catch (e) {
                    console.log(e);
                }
                break;
            case SortTypes.String:
                sorted = array.sort(function (a, b) { return ((a[key] || "").localeCompare(b[key])) * factor; });
                break;
            default:
                sorted = array.sort(function (a, b) { return (a[key] - b[key]) * factor; });
        }
        return sorted;
    };
    var SortValueConverter_1;
    SortValueConverter = SortValueConverter_1 = __decorate([
        valueConverter('sort')
    ], SortValueConverter);
    return SortValueConverter;
}());
export { SortValueConverter };
function validate(array, opts) {
    var isInvalid = !(opts === null || opts === void 0 ? void 0 : opts.key) ||
        !Array.isArray(array) ||
        array.length <= 1 ||
        !localeCompareSupport();
    return !isInvalid;
}
function localeCompareSupport() {
    try {
        'a'.localeCompare('b');
    }
    catch (e) {
        console.log("nosuppoert", e);
        return false;
    }
    return true;
}
function findSortType(obj) {
    if (obj instanceof Date && !Number.isNaN(obj)) {
        return SortTypes.Date;
    }
    if (typeof obj === 'string') {
        return SortTypes.String;
    }
    return null;
}
var SortTypes;
(function (SortTypes) {
    SortTypes["Date"] = "date";
    SortTypes["String"] = "string";
})(SortTypes || (SortTypes = {}));

//# sourceMappingURL=sort.js.map
