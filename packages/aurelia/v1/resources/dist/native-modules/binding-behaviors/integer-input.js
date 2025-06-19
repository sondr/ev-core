import { __decorate } from "tslib";
import { bindingBehavior } from 'aurelia-binding';
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
    IntegerInputBindingBehavior = __decorate([
        bindingBehavior('integer')
    ], IntegerInputBindingBehavior);
    return IntegerInputBindingBehavior;
}());
export { IntegerInputBindingBehavior };

//# sourceMappingURL=integer-input.js.map
