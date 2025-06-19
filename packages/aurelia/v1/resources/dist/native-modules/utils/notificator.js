import { __awaiter, __generator } from "tslib";
import { PLATFORM } from "aurelia-framework";
var Notificator = (function () {
    function Notificator() {
    }
    Object.defineProperty(Notificator.prototype, "permission", {
        get: function () { return PLATFORM.global.Notification.permission; },
        enumerable: false,
        configurable: true
    });
    Notificator.prototype.requestPermission = function () { return PLATFORM.global.Notification.requestPermission(); };
    Notificator.prototype.notify = function (title, options) {
        return __awaiter(this, void 0, void 0, function () {
            var permission;
            return __generator(this, function (_a) {
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
                            return [2, new PLATFORM.global.Notification(title, options)];
                        }
                        return [2, undefined];
                }
            });
        });
    };
    return Notificator;
}());
export { Notificator };

//# sourceMappingURL=notificator.js.map
