"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegerInputBindingBehavior = void 0;
var tslib_1 = require("tslib");
var aurelia_binding_1 = require("aurelia-binding");
var IntegerInputBindingBehavior = (function () {
    function IntegerInputBindingBehavior() {
    }
    IntegerInputBindingBehavior.prototype.bind = function (binding, source) {
        binding.standardUpdateSource = binding.updateSource;
        binding.updateSource = function (value) {
            var intValue = Number.parseInt(value, 10);
            if (Number.isNaN(intValue)) {
                binding.standardUpdateSource(0);
                return;
            }
            binding.standardUpdateSource(intValue);
            if (intValue.toString(10) !== value) {
                binding.updateTarget(intValue.toString(10));
            }
        };
    };
    IntegerInputBindingBehavior.prototype.unbind = function (binding, source) {
        binding.updateSource = binding.standardUpdateSource;
        binding.standardUpdateSource = null;
    };
    IntegerInputBindingBehavior = tslib_1.__decorate([
        (0, aurelia_binding_1.bindingBehavior)('integer')
    ], IntegerInputBindingBehavior);
    return IntegerInputBindingBehavior;
}());
exports.IntegerInputBindingBehavior = IntegerInputBindingBehavior;

//# sourceMappingURL=integer-input.js.map
