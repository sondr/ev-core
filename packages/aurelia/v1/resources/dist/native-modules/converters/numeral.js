import { __decorate } from "tslib";
import { valueConverter } from 'aurelia-framework';
import * as numeral from 'numeral';
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
    numberformatValueConverter = __decorate([
        valueConverter('numeral')
    ], numberformatValueConverter);
    return numberformatValueConverter;
}());
export { numberformatValueConverter };

//# sourceMappingURL=numeral.js.map
