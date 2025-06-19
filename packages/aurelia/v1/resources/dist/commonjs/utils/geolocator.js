"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoLocator = void 0;
var aurelia_framework_1 = require("aurelia-framework");
var GeoLocator = (function () {
    function GeoLocator() {
        this.id = undefined;
        this.ctr = new aurelia_framework_1.PLATFORM.global.Geolocation();
    }
    GeoLocator.prototype.locate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.ctr.getCurrentPosition(function (location) {
                return resolve(location);
            }, function (error) { return reject(error); });
        });
    };
    GeoLocator.prototype.watch = function (success, error) {
        var watcher = this.ctr.watchPosition(success, error);
    };
    GeoLocator.prototype.stopWatch = function () {
        if (this.id) {
            this.ctr.clearWatch(this.id);
            this.id = undefined;
        }
    };
    return GeoLocator;
}());
exports.GeoLocator = GeoLocator;

//# sourceMappingURL=geolocator.js.map
