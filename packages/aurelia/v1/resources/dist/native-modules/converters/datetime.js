import { __decorate } from "tslib";
import { valueConverter } from 'aurelia-framework';
import { buildOptions, getDate, getDateTimeOptions, configure } from './datetime-config';
var DatetimeValueConverter = (function () {
    function DatetimeValueConverter() {
        this.toView = DatetimeValueConverter_1.convert;
    }
    DatetimeValueConverter_1 = DatetimeValueConverter;
    DatetimeValueConverter.convert = function (date, options) {
        var _a;
        options = buildOptions(options);
        var dtOptions = getDateTimeOptions(options);
        var dt = getDate(date, dtOptions);
        var type = (_a = options === null || options === void 0 ? void 0 : options.type) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!type || type == 'toformat') {
            return dt.toFormat(options.format);
        }
        if (type == 'torelative') {
            var base = undefined;
            if (options.relativeBase) {
                base = getDate(options.relativeBase, dtOptions);
            }
            return dt.toRelative({ base: base, round: false });
        }
        if (type == 'torelativecalendar') {
            var base = undefined;
            if (options.relativeBase) {
                base = getDate(options.relativeBase, dtOptions);
            }
            return dt.toRelativeCalendar({ base: base });
        }
    };
    var DatetimeValueConverter_1;
    DatetimeValueConverter.configure = configure;
    DatetimeValueConverter = DatetimeValueConverter_1 = __decorate([
        valueConverter('datetime')
    ], DatetimeValueConverter);
    return DatetimeValueConverter;
}());
export { DatetimeValueConverter };

//# sourceMappingURL=datetime.js.map
