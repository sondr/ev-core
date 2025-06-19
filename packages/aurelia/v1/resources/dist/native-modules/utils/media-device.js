import { __awaiter, __generator } from "tslib";
import { PLATFORM } from 'aurelia-framework';
var MediaDevice = (function () {
    function MediaDevice() {
    }
    MediaDevice.prototype.start = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, PLATFORM.global.navigator.mediaDevices.getDisplayMedia(options)];
                    case 1:
                        _a.stream = _b.sent();
                        return [2];
                }
            });
        });
    };
    MediaDevice.prototype.stop = function () {
        var _a;
        (_a = this.stream) === null || _a === void 0 ? void 0 : _a.getTracks().forEach(function (t) { return t.stop(); });
    };
    return MediaDevice;
}());
export { MediaDevice };

//# sourceMappingURL=media-device.js.map
