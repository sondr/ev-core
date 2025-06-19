"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configure = configure;
const aurelia_pal_1 = require("aurelia-pal");
function configure(config) {
    config.globalResources([
        aurelia_pal_1.PLATFORM.moduleName('./attributes/au-fileinput')
    ]);
}

//# sourceMappingURL=index.js.map
