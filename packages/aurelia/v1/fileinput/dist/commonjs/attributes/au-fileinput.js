"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileinputAttrComponent = void 0;
const tslib_1 = require("tslib");
const aurelia_framework_1 = require("aurelia-framework");
const aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
const aurelia_pal_1 = require("aurelia-pal");
const core_1 = require("@ev-core/core");
let FileinputAttrComponent = class FileinputAttrComponent {
    constructor() {
        this.el = (0, aurelia_dependency_injection_1.resolve)(aurelia_pal_1.DOM.Element);
        this.fi = (0, aurelia_dependency_injection_1.resolve)(core_1.FileinputCall);
        this.handleOnClick = async () => {
            const files = await this.fi.call(this.opts);
            this.submit(files);
        };
    }
    attached() {
        this.el.addEventListener('click', this.handleOnClick);
    }
    detached() {
        this.el.removeEventListener('click', this.handleOnClick);
    }
};
exports.FileinputAttrComponent = FileinputAttrComponent;
tslib_1.__decorate([
    aurelia_framework_1.bindable,
    tslib_1.__metadata("design:type", Object)
], FileinputAttrComponent.prototype, "opts", void 0);
tslib_1.__decorate([
    aurelia_framework_1.bindable,
    tslib_1.__metadata("design:type", Function)
], FileinputAttrComponent.prototype, "submit", void 0);
exports.FileinputAttrComponent = FileinputAttrComponent = tslib_1.__decorate([
    (0, aurelia_framework_1.customAttribute)('au-fileinput'),
    tslib_1.__metadata("design:paramtypes", [])
], FileinputAttrComponent);

//# sourceMappingURL=au-fileinput.js.map
