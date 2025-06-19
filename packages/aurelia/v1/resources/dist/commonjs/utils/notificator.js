"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notificator = void 0;
var tslib_1 = require("tslib");
var aurelia_framework_1 = require("aurelia-framework");
var Notificator = (function () {
    function Notificator() {
    }
    Object.defineProperty(Notificator.prototype, "permission", {
        get: function () { return aurelia_framework_1.PLATFORM.global.Notification.permission; },
        enumerable: false,
        configurable: true
    });
    Notificator.prototype.requestPermission = function () { return aurelia_framework_1.PLATFORM.global.Notification.requestPermission(); };
    Notificator.prototype.notify = function (title, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var permission;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        permission = this.permission;
                        if (!(this.permission == 'default')) return [3, 2];
                        return [4, this.requestPermission()];
                    case 1:
                        permission = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (permission == 'granted') {
                            return [2, new aurelia_framework_1.PLATFORM.global.Notification(title, options)];
                        }
                        return [2, undefined];
                }
            });
        });
    };
    return Notificator;
}());
exports.Notificator = Notificator;

//# sourceMappingURL=notificator.js.map
