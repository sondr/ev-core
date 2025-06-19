import { __decorate } from "tslib";
import { valueConverter } from 'aurelia-framework';
var NumberFormatValueConverter = (function () {
    function NumberFormatValueConverter() {
        this.toView = NumberFormatValueConverter_1.convert;
    }
    NumberFormatValueConverter_1 = NumberFormatValueConverter;
    NumberFormatValueConverter.setConfig = function (cb) {
        cb(this.config);
    };
    NumberFormatValueConverter.convert = function (value, opts) {
        var options = Object.assign({}, NumberFormatValueConverter_1.config, opts !== null && opts !== void 0 ? opts : {});
        var parts = (value || 0).toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, options.delimiter);
        return parts.join(",");
    };
    var NumberFormatValueConverter_1;
    NumberFormatValueConverter.config = {
        disabled: false,
        delimiter: ' '
    };
    NumberFormatValueConverter = NumberFormatValueConverter_1 = __decorate([
        valueConverter('numberformat')
    ], NumberFormatValueConverter);
    return NumberFormatValueConverter;
}());
export { NumberFormatValueConverter };

//# sourceMappingURL=numberformat.js.map
