import { __decorate } from "tslib";
import { resolve, valueConverter } from 'aurelia-framework';
import { Router } from 'aurelia-router';
var RouteHrefValueConverter = (function () {
    function RouteHrefValueConverter() {
        this.router = resolve(Router);
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
    RouteHrefValueConverter = __decorate([
        valueConverter('routeHref')
    ], RouteHrefValueConverter);
    return RouteHrefValueConverter;
}());
export { RouteHrefValueConverter };

//# sourceMappingURL=route-href.js.map
