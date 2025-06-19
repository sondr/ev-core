import { __decorate } from "tslib";
import { viewEngineHooks } from 'aurelia-framework';
var toElementAttr = 'to-element';
var AsElementViewHook = (function () {
    function AsElementViewHook() {
    }
    AsElementViewHook_1 = AsElementViewHook;
    AsElementViewHook.prototype.beforeCompile = function (template) {
        var _a;
        for (var _i = 0, _b = AsElementViewHook_1.tags; _i < _b.length; _i++) {
            var t = _b[_i];
            var elements = template.querySelectorAll(t.from);
            for (var _c = 0, _d = Array.from(elements); _c < _d.length; _c++) {
                var el = _d[_c];
                var toElement = (_a = el.attributes.getNamedItem(toElementAttr)) === null || _a === void 0 ? void 0 : _a.value;
                if (toElement) {
                    el.attributes.removeNamedItem(toElementAttr);
                }
                else {
                    toElement = t.to;
                }
                var next = document.createElement(toElement);
                for (var i = 0, l = el.attributes.length; i < l; ++i) {
                    var nodeName = el.attributes.item(i).nodeName;
                    var nodeValue = el.attributes.item(i).nodeValue;
                    next.setAttribute(nodeName, nodeValue);
                }
                next.setAttribute('as-element', t.from);
                next.innerHTML = el.innerHTML;
                el.parentNode.replaceChild(next, el);
            }
        }
    };
    var AsElementViewHook_1;
    AsElementViewHook.tags = [];
    AsElementViewHook = AsElementViewHook_1 = __decorate([
        viewEngineHooks()
    ], AsElementViewHook);
    return AsElementViewHook;
}());
export { AsElementViewHook };

//# sourceMappingURL=as-element.js.map
