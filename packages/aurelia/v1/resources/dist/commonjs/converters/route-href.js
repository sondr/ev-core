"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteHrefValueConverter = void 0;
var tslib_1 = require("tslib");
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_router_1 = require("aurelia-router");
var RouteHrefValueConverter = (function () {
    function RouteHrefValueConverter() {
        this.router = (0, aurelia_framework_1.resolve)(aurelia_router_1.Router);
    }
    RouteHrefValueConverter.prototype.toView = function (route, params) {
        if (!route) {
            return '';
        }
        if (params) {
            return this.router.generate(route, params);
        }
        return this.router.generate(route);
    };
    RouteHrefValueConverter = tslib_1.__decorate([
        (0, aurelia_framework_1.valueConverter)('routeHref')
    ], RouteHrefValueConverter);
    return RouteHrefValueConverter;
}());
exports.RouteHrefValueConverter = RouteHrefValueConverter;

//# sourceMappingURL=route-href.js.map
