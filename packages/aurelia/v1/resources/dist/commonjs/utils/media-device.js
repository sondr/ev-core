"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaDevice = void 0;
var tslib_1 = require("tslib");
var aurelia_framework_1 = require("aurelia-framework");
var MediaDevice = (function () {
    function MediaDevice() {
    }
    MediaDevice.prototype.start = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4, aurelia_framework_1.PLATFORM.global.navigator.mediaDevices.getDisplayMedia(options)];
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
exports.MediaDevice = MediaDevice;

//# sourceMappingURL=media-device.js.map
