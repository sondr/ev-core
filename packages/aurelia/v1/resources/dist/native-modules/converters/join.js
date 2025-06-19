import { __decorate } from "tslib";
import { valueConverter } from 'aurelia-framework';
var JoinValueConverter = (function () {
    function JoinValueConverter() {
    }
    JoinValueConverter.prototype.toView = function (arr, seperator) {
        if (seperator === void 0) { seperator = ', '; }
        return arr === null || arr === void 0 ? void 0 : arr.join(seperator);
    };
    JoinValueConverter = __decorate([
        valueConverter('join')
    ], JoinValueConverter);
    return JoinValueConverter;
}());
export { JoinValueConverter };

//# sourceMappingURL=join.js.map
