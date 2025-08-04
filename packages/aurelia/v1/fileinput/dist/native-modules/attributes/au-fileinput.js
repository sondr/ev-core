var _a;
import { __decorate, __metadata } from "tslib";
import { bindable, customAttribute } from "aurelia-framework";
import { resolve } from "aurelia-dependency-injection";
import { DOM } from "aurelia-pal";
import { FileinputCall, IFileInputOptions } from "@ev-core/core";
let FileinputAttrComponent = class FileinputAttrComponent {
    constructor() {
        this.el = resolve(DOM.Element);
        this.fi = resolve(FileinputCall);
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
__decorate([
    bindable,
    __metadata("design:type", typeof (_a = typeof IFileInputOptions !== "undefined" && IFileInputOptions) === "function" ? _a : Object)
], FileinputAttrComponent.prototype, "opts", void 0);
__decorate([
    bindable,
    __metadata("design:type", Function)
], FileinputAttrComponent.prototype, "submit", void 0);
FileinputAttrComponent = __decorate([
    customAttribute('au-fileinput'),
    __metadata("design:paramtypes", [])
], FileinputAttrComponent);
export { FileinputAttrComponent };

//# sourceMappingURL=au-fileinput.js.map
