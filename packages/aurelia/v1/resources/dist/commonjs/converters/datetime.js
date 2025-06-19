"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatetimeValueConverter = void 0;
var tslib_1 = require("tslib");
var aurelia_framework_1 = require("aurelia-framework");
var datetime_config_1 = require("./datetime-config");
var DatetimeValueConverter = (function () {
    function DatetimeValueConverter() {
        this.toView = DatetimeValueConverter_1.convert;
    }
    DatetimeValueConverter_1 = DatetimeValueConverter;
    DatetimeValueConverter.convert = function (date, options) {
        var _a;
        options = (0, datetime_config_1.buildOptions)(options);
        var dtOptions = (0, datetime_config_1.getDateTimeOptions)(options);
        var dt = (0, datetime_config_1.getDate)(date, dtOptions);
        var type = (_a = options === null || options === void 0 ? void 0 : options.type) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!type || type == 'toformat') {
            return dt.toFormat(options.format);
        }
        if (type == 'torelative') {
            var base = undefined;
            if (options.relativeBase) {
                base = (0, datetime_config_1.getDate)(options.relativeBase, dtOptions);
            }
            return dt.toRelative({ base: base, round: false });
        }
        if (type == 'torelativecalendar') {
            var base = undefined;
            if (options.relativeBase) {
                base = (0, datetime_config_1.getDate)(options.relativeBase, dtOptions);
            }
            return dt.toRelativeCalendar({ base: base });
        }
    };
    var DatetimeValueConverter_1;
    DatetimeValueConverter.configure = datetime_config_1.configure;
    DatetimeValueConverter = DatetimeValueConverter_1 = tslib_1.__decorate([
        (0, aurelia_framework_1.valueConverter)('datetime')
    ], DatetimeValueConverter);
    return DatetimeValueConverter;
}());
exports.DatetimeValueConverter = DatetimeValueConverter;

//# sourceMappingURL=datetime.js.map
