"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinValueConverter = void 0;
var tslib_1 = require("tslib");
var aurelia_framework_1 = require("aurelia-framework");
var JoinValueConverter = (function () {
    function JoinValueConverter() {
    }
    JoinValueConverter.prototype.toView = function (arr, seperator) {
        if (seperator === void 0) { seperator = ', '; }
        return arr === null || arr === void 0 ? void 0 : arr.join(seperator);
    };
    JoinValueConverter = tslib_1.__decorate([
        (0, aurelia_framework_1.valueConverter)('join')
    ], JoinValueConverter);
    return JoinValueConverter;
}());
exports.JoinValueConverter = JoinValueConverter;

//# sourceMappingURL=join.js.map
