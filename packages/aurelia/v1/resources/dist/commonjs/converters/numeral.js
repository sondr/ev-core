"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberformatValueConverter = void 0;
var tslib_1 = require("tslib");
var aurelia_framework_1 = require("aurelia-framework");
var numeral = tslib_1.__importStar(require("numeral"));
numeral.register('locale', 'nb', {
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal: function (number) {
        return number === 1 ? 'e' : 'er';
    },
    currency: {
        symbol: 'NOK'
    }
});
numeral.register('locale', 'se', {
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'mn',
        billion: 'md',
        trillion: 'bn'
    },
    ordinal: function (number) {
        var a = Math.abs(number) % 10, b = Math.abs(number) % 100;
        if ((a === 1 || a === 2) && (b !== 11 && b !== 12)) {
            return ':a';
        }
        return ':e';
    },
    currency: {
        symbol: 'SEK'
    }
});
var numberformatValueConverter = (function () {
    function numberformatValueConverter() {
    }
    numberformatValueConverter.prototype.toView = function (value, format, locale) {
        if (locale === void 0) { locale = 'nb'; }
        numeral.locale(locale);
        return numeral(value).format(format);
    };
    numberformatValueConverter = tslib_1.__decorate([
        (0, aurelia_framework_1.valueConverter)('numeral')
    ], numberformatValueConverter);
    return numberformatValueConverter;
}());
exports.numberformatValueConverter = numberformatValueConverter;

//# sourceMappingURL=numeral.js.map
