"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagManager = void 0;
exports.configure = configure;
const tag_manager_1 = require("./gtm/tag-manager");
Object.defineProperty(exports, "TagManager", { enumerable: true, get: function () { return tag_manager_1.TagManager; } });
function configure(aurelia, configCallback) {
    const instance = aurelia.container.get(tag_manager_1.TagManager);
    if (configCallback !== undefined && typeof (configCallback) === 'function') {
        configCallback(instance);
    }
}

//# sourceMappingURL=index.js.map
