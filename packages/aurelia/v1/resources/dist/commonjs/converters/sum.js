"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SumValueConverter = void 0;
var tslib_1 = require("tslib");
var aurelia_framework_1 = require("aurelia-framework");
var SumValueConverter = (function () {
    function SumValueConverter(parser) {
        this.parser = parser;
    }
    SumValueConverter.prototype.toView = function (arr, key) {
        if (!Array.isArray(arr) || arr.length < 1) {
            return 0;
        }
        var property;
        if (key) {
            property = this.parser.parse(key);
        }
        return arr.reduce(function (sum, current) {
            var currentValue = property ?
                property.evaluate({ bindingContext: current, overrideContext: undefined }) :
                current;
            if (currentValue == null) {
                currentValue = 0;
            }
            if (typeof currentValue === 'string') {
                var useValue = Number.parseInt(currentValue);
                currentValue = Number.isNaN(useValue) ? 0 : useValue;
            }
            return sum + currentValue;
        }, 0);
    };
    SumValueConverter = tslib_1.__decorate([
        (0, aurelia_framework_1.valueConverter)('sum'),
        (0, aurelia_framework_1.inject)(aurelia_framework_1.Parser),
        tslib_1.__metadata("design:paramtypes", [aurelia_framework_1.Parser])
    ], SumValueConverter);
    return SumValueConverter;
}());
exports.SumValueConverter = SumValueConverter;

//# sourceMappingURL=sum.js.map
