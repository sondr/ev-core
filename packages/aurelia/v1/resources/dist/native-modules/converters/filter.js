import { __decorate, __metadata } from "tslib";
import { inject, Parser, valueConverter } from 'aurelia-framework';
var toMillis = function (d) {
    return d instanceof Date ? d.getTime() : new Date(d).getTime();
};
var FILTER_MODES = {
    'exact': { fn: function (a, b) { return a === b; }, stringify: true },
    'startsWith': { fn: function (a, b) { return a.startsWith(b); }, stringify: true },
    'endsWith': { fn: function (a, b) { return a.endsWith(b); }, stringify: true },
    'contains': { fn: function (a, b) { return a.indexOf(b) >= 0; }, stringify: true },
    '>=': { fn: function (a, b) { return a >= b; }, stringify: false },
    '>': { fn: function (a, b) { return a > b; }, stringify: false },
    '<=': { fn: function (a, b) { return a <= b; }, stringify: false },
    '<': { fn: function (a, b) { return a < b; }, stringify: false },
    '==': { fn: function (a, b) { return a == b; }, stringify: false },
    '===': { fn: function (a, b) { return a == b; }, stringify: false },
    '!=': { fn: function (a, b) { return a != b; }, stringify: false },
    'Array.some': {
        fn: function (a, b) { return (a || []).some(function (x) { return b.includes(x); }); },
        stringify: false,
        isArray: true
    },
    '!Array.some': {
        fn: function (a, b) { return !(a || []).some(function (x) { return b.includes(x); }); },
        stringify: false,
        isArray: true
    },
    'Array.includes': {
        fn: function (a, b) { return (a || []).includes(b); },
        stringify: false,
        isArray: true
    },
    '!Array.includes': {
        fn: function (a, b) { return !(a || []).includes(b); },
        stringify: false,
        isArray: true
    },
    'Date.>=': {
        fn: function (a, b) {
            var t1 = toMillis(a);
            var t2 = toMillis(b);
            return t1 >= t2;
        },
        stringify: false
    },
    'Date.<': {
        fn: function (a, b) {
            var t1 = toMillis(a);
            var t2 = toMillis(b);
            return t1 < t2;
        },
        stringify: false
    }
};
var FilterValueConverter = (function () {
    function FilterValueConverter(parser) {
        this.parser = parser;
    }
    FilterValueConverter.prototype.toView = function (arr, opts) {
        var _this = this;
        var isValid = validate(arr, opts);
        if (!isValid) {
            var takeIsPositiveInteger = (opts === null || opts === void 0 ? void 0 : opts.take) && opts.take > 0;
            return takeIsPositiveInteger ?
                arr.slice(0, opts.take) :
                arr;
        }
        var mode = (opts.mode && FILTER_MODES[opts.mode]) ? opts.mode : 'contains';
        var queries = Array.isArray(opts.q) ? opts.q : [opts.q];
        var properties = (Array.isArray(opts.props) ? opts.props : [opts.props]);
        var filteredArr;
        var FILTERMODE = FILTER_MODES[mode];
        if (FILTERMODE.isArray) {
            filteredArr = arr.filter(function (entry) {
                return properties.some(function (p) { return FILTERMODE.fn(queries, entry[p]); });
            });
        }
        else {
            var stringify_1 = FILTERMODE.stringify;
            var settingsFn_1 = function (term) { return stringify_1 ? String(term).toLowerCase() : term; };
            var propExpressions_1 = (Array.isArray(opts.props) ? opts.props : [opts.props]).map(function (p) { return _this.parser.parse(p); }), terms_1 = queries.map(function (query) { return stringify_1 ? String(query).toLowerCase() : query; });
            filteredArr = arr.filter(function (entry) {
                return propExpressions_1.some(function (propExp) {
                    var evaluated = propExp.evaluate({ bindingContext: entry, overrideContext: null });
                    return terms_1.some(function (t) {
                        return FILTERMODE.fn(settingsFn_1(evaluated), t);
                    });
                });
            });
        }
        return opts.take && typeof opts.take === 'number' ?
            filteredArr.slice(0, opts.take) :
            filteredArr;
    };
    FilterValueConverter = __decorate([
        valueConverter('filter'),
        inject(Parser),
        __metadata("design:paramtypes", [Parser])
    ], FilterValueConverter);
    return FilterValueConverter;
}());
export { FilterValueConverter };
function validate(arr, opts) {
    var minLength = opts.minLength || 0;
    var isInvalid = (opts === null || opts === void 0 ? void 0 : opts.disabled) ||
        !Array.isArray(arr) ||
        !(opts === null || opts === void 0 ? void 0 : opts.q) ||
        ((opts.q || '').length < minLength);
    return !isInvalid;
}
;

//# sourceMappingURL=filter.js.map
