import { __decorate, __metadata } from "tslib";
import { inject, Parser, valueConverter } from 'aurelia-framework';
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
    SumValueConverter = __decorate([
        valueConverter('sum'),
        inject(Parser),
        __metadata("design:paramtypes", [Parser])
    ], SumValueConverter);
    return SumValueConverter;
}());
export { SumValueConverter };

//# sourceMappingURL=sum.js.map
